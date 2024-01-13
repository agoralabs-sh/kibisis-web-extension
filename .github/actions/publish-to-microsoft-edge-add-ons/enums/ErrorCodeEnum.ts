enum ErrorCodeEnum {
  UnknownError = 1, // process exit(1) is a general error
  InvalidInputError = 2,
  FileNotFoundError = 3,
  HttpResponseError = 4,
  UploadError = 5,
}

export default ErrorCodeEnum;
