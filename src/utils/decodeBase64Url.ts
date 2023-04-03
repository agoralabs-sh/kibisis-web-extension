export default function decodeBase64Url(input: string): string {
  let result: string = input
    .replace(/-/g, '+') // replace non-url compatible chars with base64 standard chars
    .replace(/_/g, '/');
  let padLength: number = result.length % 4;

  if (padLength > 0) {
    if (padLength === 1) {
      throw new Error(
        'InvalidLengthError: input base64url string is the wrong length to determine padding'
      );
    }

    result += new Array(5 - padLength).join('=');
  }

  return window.atob(result);
}
