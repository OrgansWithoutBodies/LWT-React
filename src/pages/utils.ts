export function byteSizeOfString(str: string): number {
  return new Blob([str]).size;
}
