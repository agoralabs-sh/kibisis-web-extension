function padString(input: string): string {
  const segmentLength: number = 4;
  const diff: number = input.length % segmentLength;
  let buffer: Uint8Array;
  let encoder: TextEncoder;
  let padLength: number;
  let position: number;

  if (!diff) {
    return input;
  }

  encoder = new TextEncoder();
  padLength = segmentLength - diff;
  position = input.length;
  buffer = new Uint8Array(input.length + padLength);

  buffer.set(encoder.encode(input));

  while (padLength--) {
    buffer.set(encoder.encode('='), position++);
  }

  return buffer.toString();
}

export default function decodeBase64Url(input: string): string {
  const base64String: string = padString(input)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  return window.atob(base64String);
}
