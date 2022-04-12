let program: string
let programPointer: i32
let memory: Uint8Array
let memoryPointer: i32
let jumpStack = new Array<i32>()

export function init(newProgram: string, newMemorySize: i32): void {
  program = newProgram
  programPointer = 0
  memory = new Uint8Array(newMemorySize)
  memoryPointer = 0
  memory.fill(0)
}

export function step(inMsgType: i32, inMsgValue: i32): StaticArray<i32> {
  let outMsgType: i32 = 0
  let outMsgValue: i32 = 0
  if (programPointer === program.length) {
    outMsgType = -1
  } else {
    switch (program.charCodeAt(programPointer++)) {
      case 0x2b: {
        memory[memoryPointer]++
        break
      }
      case 0x2d: {
        memory[memoryPointer]--
        break
      }
      case 0x2c: {
        if (inMsgType === 0x2c) {
          memory[memoryPointer] = u8(inMsgValue)
        } else {
          programPointer--
          outMsgType = 0x2c
          outMsgValue = memory[memoryPointer]
        }
        break
      }
      case 0x2e: {
        outMsgType = 0x2e
        outMsgValue = memory[memoryPointer]
        break
      }
      case 0x3c: {
        memoryPointer--
        break
      }
      case 0x3e: {
        memoryPointer++
        break
      }
      case 0x5b: {
        if (memory[memoryPointer]) jumpStack.push(programPointer)
        else {
          let depth: i32 = 1
          while (depth) {
            let instr = program.charCodeAt(programPointer++)
            if (instr === 0x5b) depth++
            else if (instr === 0x5d) depth--
          }
        }
        break
      }
      case 0x5d: {
        if (memory[memoryPointer])
          programPointer = jumpStack[jumpStack.length - 1]
        else
          jumpStack.pop()
        break
      }
    }
  }
  return [programPointer, outMsgType, outMsgValue]
}

export function getMemory(): Uint8Array {
  return memory
}

export function getMemoryPointer(): i32 {
  return memoryPointer
}

export function steps(times: u16): i32[] {
  throw "not implemented"
}
