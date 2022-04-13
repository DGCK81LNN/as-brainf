import { BFProgram, InstructionType } from "./types"
import { simpleLoop } from "./utils"

export enum Message {
  None = 0,
  Exit = -1,
  AwaitingInput = -2,
  Debugger = -3,
  PointerOverflow = 1,
  DeadSimpleLoop = 2,
  InternalError = 3,
}

export class BFRunner<T extends number, U extends TypedArray<T>> {
  constructor(public readonly program: BFProgram<T>, public readonly memorySize: i32) {
    this.memory = instantiate<U>(memorySize)
  }
  readonly memory: U
  readonly inputBuffer: T[] = new Array<T>()
  readonly outputBuffer: T[] = new Array<T>()
  ip: i32 = 0
  mp: i32 = 0
  inputP: i32 = 0
  inputClosed: boolean = false

  @inline private inBounds(index: i32): boolean {
    return index >= 0 && index < this.memorySize
  }

  step(): Message {
    if (this.ip >= this.program.length) return Message.Exit
    let instr = this.program.instructions[this.ip]
    let offsets = instr.offsets
    let deltas = instr.deltas
    this.mp += instr.offset

    switch (instr.type) {
      case InstructionType.Add: {
        if (!offsets || !deltas) return Message.InternalError

        for (let i = 0; i < offsets.length; ++i) {
          let index = this.mp + offsets[i]
          if (!this.inBounds(index)) return Message.PointerOverflow
          this.memory[index] += deltas[i]
        }
        break
      }
      case InstructionType.Output: {
        if (!offsets || !deltas) return Message.InternalError

        for (let i: i32 = 0; i < offsets.length; ++i) {
          let index = this.mp + offsets[i]
          if (!this.inBounds(index)) return Message.PointerOverflow
          this.outputBuffer.push(this.memory[index] + deltas[i])
        }
        break
      }
      case InstructionType.Input: {
        if (this.inputP >= this.inputBuffer.length) {
          if (this.inputClosed) break
          return Message.AwaitingInput
        }
        if (!this.inBounds(this.mp)) return Message.PointerOverflow
        this.memory[this.mp] = this.inputBuffer.shift()
        break
      }
      case InstructionType.SimpleLoop: {
        if (!offsets || !deltas) return Message.InternalError

        if (!this.inBounds(this.mp)) return Message.PointerOverflow
        let initial: T = this.memory[this.mp]
        if (!initial) break
        let cdi: i32 = offsets.indexOf(0)
        let delta: T = cdi === -1 ? 0 : deltas[cdi]
        if (initial && !delta) return Message.DeadSimpleLoop
        let loops = simpleLoop<T>(initial, delta)
        if (!loops) return Message.DeadSimpleLoop

        for (let i = 0; i < offsets.length; ++i) {
          let index = this.mp + offsets[i]
          if (!this.inBounds(index)) return Message.PointerOverflow
          this.memory[index] += deltas[i] * (loops as T)
        }
        break
      }
      case InstructionType.LoopStart: {
        if (!this.inBounds(this.mp)) return Message.PointerOverflow
        if (!this.memory[this.mp]) this.ip = instr.target
        break
      }
      case InstructionType.LoopEnd: {
        if (!this.inBounds(this.mp)) return Message.PointerOverflow
        if (this.memory[this.mp]) this.ip = instr.target
        break
      }
      case InstructionType.Debugger: {
        this.ip++
        return Message.Debugger
        break
      }
    }

    this.ip++
    return Message.None
  }

  steps(maxSteps: i32): Message {
    for (let i: i32 = 0; i < maxSteps; ++i) {
      let message = this.step()
      if (message !== Message.None) return message
    }
    return Message.None
  }

  stepsTime(maxTime: i32): Message {
    let startTime: i64 = Date.now()
    do {
      let message = this.step()
      if (message !== Message.None) return message
    } while (Date.now() - startTime < maxTime)
    return Message.None
  }

  flushOutput(): U | null {
    if (!this.outputBuffer.length) return null
    let result = instantiate<U>(this.outputBuffer.length)
    result.set(this.outputBuffer)
    this.outputBuffer.length = 0
    return result
  }

  input(input: U): void {
    for (let i = 0, len = input.length; i < len; ++i)
      this.inputBuffer.push(input[i])
  }
}
