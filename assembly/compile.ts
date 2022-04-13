import { BFToken, BFTokenString, tokenize } from "./tokenize"
import { BFProgram, Instruction, InstructionType, KVPair, KVPairArray } from "./types"

export function compile<T extends number>(source: string): BFProgram<T> {
  return compileFromTokenString<T>(tokenize(source))
}

function flushOuts<T extends number>(
  instructions: Instruction<T>[],
  sourceMap: i32[],
  outputBuf: KVPairArray<i32, T>,
  i: i32
): void {
  if (outputBuf.length) {
    instructions.push({
      type: InstructionType.Output,
      offset: 0,
      offsets: StaticArray.fromArray(outputBuf.keys()),
      deltas: StaticArray.fromArray(outputBuf.values()),
      target: 0,
    })
    sourceMap.push(i)
    outputBuf.length = 0
  }
}

function flushAdds<T extends number>(
  instructions: Instruction<T>[],
  sourceMap: i32[],
  addBuf: Map<i32, T>,
  i: i32
): void {
  if (addBuf.size) {
    instructions.push({
      type: InstructionType.Add,
      offset: 0,
      offsets: StaticArray.fromArray(addBuf.keys()),
      deltas: StaticArray.fromArray(addBuf.values()),
      target: 0,
    })
    sourceMap.push(i)
    addBuf.clear()
  }
}

function addInstr<T extends number>(
  instructions: Instruction<T>[],
  sourceMap: i32[],
  type: InstructionType,
  data: i32,
  offset: i32,
  i: i32
): void {
  instructions.push({
    type: type,
    offset,
    offsets: null,
    deltas: null,
    target: data,
  })
  sourceMap.push(i)
}

function makeSimpleLoop<T extends number>(
  instruction: Instruction<T>,
  addBuf: Map<i32, T>
): void {
  assert(instruction.type === InstructionType.LoopStart)
  instruction.type = InstructionType.SimpleLoop
  instruction.offsets = StaticArray.fromArray(addBuf.keys())
  instruction.deltas = StaticArray.fromArray(addBuf.values())
  instruction.target = 0
  addBuf.clear()
}

export function compileFromTokenString<T extends number>(
  tokenString: BFTokenString
): BFProgram<T> {
  const instructions = new Array<Instruction<T>>()
  const sourceMap = new Array<i32>()
  const addBuf = new Map<i32, T>()
  const outputBuf = new KVPairArray<i32, T>()
  const loopStack = new Array<i32>()

  let currentOffset: i32 = 0
  let bufI: i32 = 0

  for (let i: i32 = 0; i < tokenString.length; ++i) {
    let currentDelta: T = addBuf.has(currentOffset) ? addBuf.get(currentOffset) : <T>0
    switch (tokenString.tokens[i]) {
      case BFToken.Increment: {
        addBuf.set(currentOffset, <T>(currentDelta + 1))
        break
      }
      case BFToken.Decrement: {
        addBuf.set(currentOffset, <T>(currentDelta - 1))
        break
      }
      case BFToken.Input: {
        flushOuts(instructions, sourceMap, outputBuf, bufI)
        flushAdds(instructions, sourceMap, addBuf, bufI)
        bufI = i + 1
        addInstr(instructions, sourceMap, InstructionType.Input, 0, currentOffset, i)
        currentOffset = 0
        break
      }
      case BFToken.Output: {
        outputBuf.push(new KVPair(currentOffset, currentDelta))
        break
      }
      case BFToken.MoveLeft: {
        currentOffset--
        break
      }
      case BFToken.MoveRight: {
        currentOffset++
        break
      }
      case BFToken.LoopStart: {
        flushOuts(instructions, sourceMap, outputBuf, i)
        flushAdds(instructions, sourceMap, addBuf, bufI)
        bufI = i + 1
        loopStack.push(instructions.length)
        addInstr(instructions, sourceMap, InstructionType.LoopStart, -1, currentOffset, i)
        currentOffset = 0
        break
      }
      case BFToken.LoopEnd: {
        if (!loopStack.length) throw new Error("Unexpected closing bracket")

        let match: i32 = loopStack.pop()
        if (
          !outputBuf.length &&
          !currentOffset &&
          match === instructions.length - 1
        )
          makeSimpleLoop(instructions[match], addBuf)
        else {
          flushOuts(instructions, sourceMap, outputBuf, i)
          flushAdds(instructions, sourceMap, addBuf, bufI)
          bufI = i + 1
          instructions[match].target = instructions.length
          addInstr(
            instructions,
            sourceMap,
            InstructionType.LoopEnd,
            match,
            currentOffset,
            i
          )
          currentOffset = 0
        }
        break
      }
      case BFToken.Debugger: {
        flushOuts(instructions, sourceMap, outputBuf, i)
        flushAdds(instructions, sourceMap, addBuf, bufI)
        bufI = i + 1
        addInstr(instructions, sourceMap, InstructionType.Debugger, 0, currentOffset, i)
        currentOffset = 0
        break
      }
    }
  }

  if (loopStack.length) throw new Error("Unclosed brackets")

  flushOuts(instructions, sourceMap, outputBuf, bufI)
  sourceMap.push(tokenString.sourceMap[tokenString.length])

  return {
    length: instructions.length,
    instructions: StaticArray.fromArray(instructions),
    sourceMap: StaticArray.fromArray(sourceMap),
  }
}
