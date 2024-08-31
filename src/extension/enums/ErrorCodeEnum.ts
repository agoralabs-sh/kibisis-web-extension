enum ErrorCodeEnum {
  // general
  UnknownError = 1000,
  MalformedDataError = 1001,
  ParsingError = 1002,
  NetworkNotSelectedError = 1003,
  NetworkConnectionError = 1004,
  EncodingError = 1005,
  DecodingError = 1006,

  // private key
  InvalidPasswordError = 2000,
  EncryptionError = 2001,
  DecryptionError = 2002,
  PrivateKeyAlreadyExistsError = 2003,

  // connection
  OfflineError = 3000,

  // transaction
  FailedToSendTransactionError = 4000,
  NotEnoughMinimumBalanceError = 4001,
  NotAZeroBalanceError = 4002,

  // contract (application)
  InvalidABIContractError = 5000,
  ReadABIContractError = 5001,

  // camera
  CameraError = 6000,
  CameraNotAllowedError = 6001,
  CameraNotFoundError = 6002,

  // screen capture
  ScreenCaptureError = 7000,
  ScreenCaptureNotAllowedError = 7001,
  ScreenCaptureNotFoundError = 7002,

  // passkey
  PasskeyNotSupportedError = 8000,
  PasskeyCreationError = 8001,
  UnableToFetchPasskeyError = 8002,

  // ledger
  LedgerNotConnectedError = 9000,
  LedgerNotSupportedError = 9001,
  LedgerFetchError = 9002,
}

export default ErrorCodeEnum;
