@inline function safeShiftLeft(lhs: u64, rhs: u64): u64 {
  return rhs >= 64 ? 0 : lhs << rhs
}

/**
 * Calculate how many times a simple loop will run.
 *
 * Returns 0 when it's a dead loop.
 *
 * Algorithm by FCC <https://github.com/1stchrc>
 *
 * How does it work? Idk, it just works ;D
 */
export function simpleLoop<T extends number>(initial: T, delta: T): u64 {
  let loops: u64 = 0
  let lp: i32 = 0
  let bits: i32 = sizeof<T>() * 8

  for (let ln: i32 = 1; ln <= bits; ++ln) {
    let mask: u64 = ~safeShiftLeft(-1, ln)
    let mDelta: u64 = delta & mask
    if (!lp && mDelta) lp = ln
    if ((initial + loops * mDelta) & mask) {
      if (lp) loops += 1 << (ln - lp)
      else return 0
    }
  }
  return loops
}

