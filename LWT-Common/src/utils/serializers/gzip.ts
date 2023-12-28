import { deflate } from "pako";

/**
 *
 * @param val
 */
export function gzipString(val: string): Uint8Array {
  // unescape(encodeURIComponent?
  return deflate(val);
}
/**
 *
 * @param val
 */
export function objectToGzUInt8(val: object): Uint8Array {
  return deflate(JSON.stringify(val));
}
