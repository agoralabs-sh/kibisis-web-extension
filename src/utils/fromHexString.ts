export default function fromHexString(hex: string): Uint8Array {
  return new Uint8Array(
    hex
      .split(/(\w\w)/g)
      .filter((value) => !!value)
      .map((value) => parseInt(value, 16))
  );
}
