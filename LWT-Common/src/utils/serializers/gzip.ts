import { deflate, inflate } from "pako";
export function unGzString(val: Uint8Array): string {
  return inflate(val, {
    to: "string",
  });
}
/**
 *
 * @param val
 */
export function gzipStringOrArrayBuffer(
  val: string | Uint8Array | ArrayBuffer
): Uint8Array {
  // unescape(encodeURIComponent?
  return deflate(val);
}
/**
 *
 * @param val
 */
export function gzipObject(val: object): Uint8Array {
  return gzipStringOrArrayBuffer(JSON.stringify(val));
}
/**
 *
 * @param val
 */
export function unGzObject(val: Uint8Array): object {
  return JSON.parse(unGzString(val));
}
