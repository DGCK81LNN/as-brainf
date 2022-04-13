export class KVPair<K, V> {
  constructor(public readonly key: K, public readonly value: V) {}
}

export class KVPairArray<K, V> extends Array<KVPair<K, V>> {
  keys(): K[] {
    const arr = new Array<K>()
    for (let i = 0; i < this.length; ++i) arr.push(this[i].key)
    return arr
  }
  values(): V[] {
    const arr = new Array<V>()
    for (let i = 0; i < this.length; ++i) arr.push(this[i].value)
    return arr
  }
}

export enum InstructionType {
  /** Change the values of specified memory cells. */
  Add = 1,
  /** Output the values of specified memory cells. */
  Output,
  /** Input a value into the current cell. */
  Input,
  /**
   * Repeatedly change the values of specified memory cells until the current
   * cell's value becomes zero.
   */
  SimpleLoop,
  /**
   * Jump to the corresponding `LoopEnd` if the current cell's value is zero.
   */
  LoopStart,
  /**
   * Jump to the corresponding `LoopStart` if the current cell's value is not
   * zero.
   */
  LoopEnd,
  /** Pause the program execution. */
  Debugger,
}

export class Instruction<T extends number> {
  /** The type of the instruction. */
  type: InstructionType
  /**
   * An offset by which to move the pointer before executing the instruction.
   */
  offset: i32
  /**
   * A sequence of pointer offsets for each value in `deltas`, relative to the
   * current pointer position.
   */
  offsets: StaticArray<i32> | null
  /** A sequence of deltas by which to adjust the values in memory cells. */
  deltas: StaticArray<T> | null
  /**
   * Position of the matching counterpart of a `LoopStart` or `LoopEnd`
   * instruction.
   */
  target: i32
}

export class BFProgram<T extends number> {
  length: i32
  instructions: StaticArray<Instruction<T>>
  sourceMap: StaticArray<i32> | null
}
