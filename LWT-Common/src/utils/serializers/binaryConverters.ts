import { BrandedString } from "lwt-schemas";

type Base64String = BrandedString<"B64">;
export const uInt8ToBase64 = (u8: Uint8Array): Base64String => {
  const decoder = new TextDecoder("utf8");
  const b64encoded = btoa(decoder.decode(u8));
  return b64encoded as Base64String;
};
export const base64ToUInt8 = (b64: Base64String): Uint8Array => {
  const binaryString = atob(b64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// // note: `buffer` arg can be an ArrayBuffer or a Uint8Array
// async function bufferToBase64(buffer) {
//   // use a FileReader to generate a base64 data URI:
//   const base64url = await new Promise(r => {
//     const reader = new FileReader()
//     reader.onload = () => r(reader.result)
//     reader.readAsDataURL(new Blob([buffer]))
//   });
//   // remove the `data:...;base64,` part from the start
//   return base64url.slice(base64url.indexOf(',') + 1);
// }

export const blobToBase64 = (blob: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
