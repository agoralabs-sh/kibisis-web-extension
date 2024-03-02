interface ISaveNewAccountPayload {
  name: string | null;
  privateKey: Uint8Array;
  password: string;
}

export default ISaveNewAccountPayload;
