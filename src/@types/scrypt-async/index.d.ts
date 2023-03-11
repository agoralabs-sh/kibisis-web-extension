declare module 'scrypt-async' {
  interface Options {
    N?: number | undefined;
    logN?: number | undefined;
    r: number;
    p: number;
    dkLen: number;
    encoding?: 'base64' | 'binary' | 'hex' | undefined;
    interruptStep?: number | undefined;
  }

  function scrypt(
    password: number[] | string | Uint8Array,
    salt: number[] | string | Uint8Array,
    options: Options,
    callback: (key: number[] | string | Uint8Array) => void
  );

  export = scrypt;
}
