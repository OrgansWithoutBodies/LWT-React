import {
  gzipObject,
  gzipStringOrArrayBuffer,
  unGzObject,
  unGzString,
} from "./gzip";

describe("GZip Test", () => {
  it("zip->unzip is idempotent", () => {
    const testString = "TEST123";
    const testObj = { key1: "TEST123", key2: "12093i812093" };
    expect(unGzString(gzipStringOrArrayBuffer(testString))).toEqual(testString);
    expect(unGzObject(gzipObject(testObj))).toEqual(testObj);
  });
});
