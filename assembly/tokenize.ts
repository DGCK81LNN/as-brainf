export enum BFToken {
  Increment = 1,
  Decrement,
  Input,
  Output,
  MoveLeft,
  MoveRight,
  LoopStart,
  LoopEnd,
  Debugger,
}

export class BFTokenString {
  length: i32
  tokens: StaticArray<BFToken>
  sourceMap: StaticArray<i32>
}

export function tokenize(source: string): BFTokenString {
  const tokens = new Array<BFToken>()
  const sourceMap = new Array<i32>()
  for (let i: i32 = 0, len = source.length; i < len; ++i) {
    const cc = source.charCodeAt(i)
    switch (cc) {
      case 0x23:
        tokens.push(BFToken.Debugger)
        break
      case 0x2b:
        tokens.push(BFToken.Increment)
        break
      case 0x2d:
        tokens.push(BFToken.Decrement)
        break
      case 0x2c:
        tokens.push(BFToken.Input)
        break
      case 0x2e:
        tokens.push(BFToken.Output)
        break
      case 0x3c:
        tokens.push(BFToken.MoveLeft)
        break
      case 0x3e:
        tokens.push(BFToken.MoveRight)
        break
      case 0x5b:
        tokens.push(BFToken.LoopStart)
        break
      case 0x5d:
        tokens.push(BFToken.LoopEnd)
        break
      default:
        continue
    }
    sourceMap.push(i)
  }
  sourceMap.push(source.length)

  return {
    length: tokens.length,
    tokens: StaticArray.fromArray(tokens),
    sourceMap: StaticArray.fromArray(sourceMap),
  }
}
