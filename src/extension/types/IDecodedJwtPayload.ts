interface IDecodedJwtPayload {
  audience?: string;
  expiresAt: Date;
  id?: string;
  issuedAt?: Date;
  issuer?: string;
  subject?: string;
}

export default IDecodedJwtPayload;
