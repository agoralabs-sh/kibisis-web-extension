interface IDecodedJwtPayload {
  address: string;
  audience: string;
  expiresAt: Date;
  id?: string;
  issuedAt?: Date;
}

export default IDecodedJwtPayload;
