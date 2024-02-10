enum ErrorCodeEnum {
  // general
  UnknownError = 1000,
  MalformedDataError = 1001,
  ParsingError = 1002,
  NetworkNotSelectedError = 1003,

  // private key
  InvalidPasswordError = 2000,
  EncryptionError = 2001,
  DecryptionError = 2002,
  PrivateKeyAlreadyExistsError = 2003,

  // connection
  OfflineError = 3000,

  // transaction
  FailedToSendTransactionError = 4000,

  // contract (application)
  InvalidABIContractError = 5000,
  ReadABIContractError = 5001,
}

export default ErrorCodeEnum;
