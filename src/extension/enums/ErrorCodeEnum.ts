enum ErrorCodeEnum {
  // general
  UnknownError = 1000,
  MalformedDataError = 1001,
  ParsingError = 1002,

  // private key service
  InvalidPasswordError = 2000,
  EncryptionError = 2001,
  DecryptionError = 2002,
  PrivateKeyAlreadyExistsError = 2003,
}

export default ErrorCodeEnum;
