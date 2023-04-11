interface ISaveCredentialsPayload {
  name: string | null;
  privateKey: Uint8Array;
}

export default ISaveCredentialsPayload;
