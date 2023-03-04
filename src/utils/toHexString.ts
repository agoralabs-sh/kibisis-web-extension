export default function toHexString(bytes: Uint8Array): string {
  return bytes
    .reduce((acc, value) => [...acc, value.toString(16).padStart(2, '0')], [])
    .join('');
}
