enum ErrorCodeEnum {
  // general
  UnknownError = 1000,
  MalformedDataError = 1001,

  // private key service
  InvalidPasswordError = 2000,
  EncryptionError = 2001,
  DecryptionError = 2002,
}

export default ErrorCodeEnum;
