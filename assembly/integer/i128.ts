
import { u128 } from './u128';

export class i128 {

  static readonly Zero: i128 = new i128()
  static readonly One:  i128 = new i128(1)
  static readonly Min:  i128 = new i128(0, 0x8000000000000000)
  static readonly Max:  i128 = new i128(u64.MAX_VALUE, 0x7FFFFFFFFFFFFFFF)

  constructor(
    public lo: i64 = 0,
    public hi: i64 = 0,
  ) {}

  @inline
  isNegative(): bool {
    return <bool>(this.hi >> 63);
  }

  @inline
  isZero(): bool {
    return !(this.lo | this.hi);
  }

  @inline @operator.prefix('~')
  not(): i128 {
    return new i128(~this.lo, ~this.hi);
  }

  @inline @operator.prefix('+')
  pos(): i128 {
    return this;
  }

  @inline @operator.prefix('-')
  neg(): i128 {
    var lo = ~this.lo, hi = ~this.hi;
    var cy = ((lo & 1) + (lo >> 1)) >> 63;
    return new i128(lo + 1, hi + cy);
  }

  @inline @operator.prefix('!')
  static isEmpty(value: i128): bool {
    return !value || !value.isZero();
  }

  @inline @operator('|')
  static or(a: i128, b: i128): i128 {
    return new i128(a.lo | b.lo, a.hi | b.hi);
  }

  @inline @operator('^')
  static xor(a: i128, b: u128): i128 {
    return new i128(a.lo ^ b.lo, a.hi ^ b.hi);
  }

  @inline @operator('&')
  static and(a: i128, b: i128): i128 {
    return new i128(a.lo & b.lo, a.hi & b.hi);
  }

  @inline @operator('<<')
  static shl(value: i128, shift: i32): i128 {
    shift &= 127;

    // need for preventing redundant i32 -> u64 extends
    var shift64: i64 = shift;

    var mod1: i64 = ((((shift64 + 127) | shift64) & 64) >> 6) - 1;
    var mod2: i64 = (shift64 >> 6) - 1;

    shift64 &= 63;

    var vl = value.lo;
    var lo = vl << shift64;
    var hi = lo & ~mod2;

    hi |= ((value.hi << shift64) | ((vl >>> (64 - shift64)) & mod1)) & mod2;

    return new i128(lo & mod2, hi);
  }

  @inline @operator('+')
  static add(a: i128, b: i128): i128 {
    var bl = b.lo;
    var lo = a.lo + bl   - (<i64>(b  <  0));
    var hi = a.hi + b.hi + (<i64>(lo < bl));

    return new i128(lo, hi);
  }

  @inline @operator('-')
  static sub(a: i128, b: i128): i128 {
    var al = a.lo;
    var lo = al   - b.lo + (<i64>(b  <  0));
    var hi = a.hi - b.hi - (<i64>(lo > al));

    return new i128(lo, hi);
  }


  /*
  @inline
  static abs(value: i128): i128 {
    return value < 0 ? value.neg() : value;
  }
  */

  // TODO
}
