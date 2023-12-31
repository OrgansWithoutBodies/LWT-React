import { base64ToUInt8, uInt8ToBase64 } from ".";
import { gzipObject, gzipString, unGzString } from "./gzip";

describe("Binary Tests", () => {
  it("B64 Object Works", () => {
    const testObj = {
      key1: "TEST123",
      key2: "12093i812093",
      key3: false,
      key4: [1, 2, "123", 4],
    };
    const u8Array = gzipObject(testObj);
    expect(base64ToUInt8(uInt8ToBase64(u8Array))).toEqual(u8Array);
  });
  it("B64 String Works", () => {
    // const testObj = { key1: "TEST123", key2: "12093i812093" };
    const originalString = new Array(2000)
      .fill(0)
      .map(() =>
        String.fromCharCode(0x0000 + Math.random() * (0x100ff - 0x30a0 + 1))
      )
      .join("");
    console.log(originalString);
    const u8Array = gzipString(originalString);
    expect(unGzString(base64ToUInt8(uInt8ToBase64(u8Array)))).toEqual(
      originalString
    );
  });
});
