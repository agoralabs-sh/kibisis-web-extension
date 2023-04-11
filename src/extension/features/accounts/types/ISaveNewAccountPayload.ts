interface ISaveNewAccountPayload {
  name: string | null;
  password: string;
  privateKey: Uint8Array;
}

export default ISaveNewAccountPayload;
