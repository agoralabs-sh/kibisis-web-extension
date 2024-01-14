import { setFailed } from '@actions/core';
import { AxiosError } from 'axios';

// enums
import { ErrorCodeEnum } from '../enums';

// errors
import { ActionError } from '../errors';

export default function handleError(error: Error | AxiosError): void {
  if ((error as AxiosError).isAxiosError) {
    if ((error as AxiosError).response) {
      setFailed(
        `http status "${
          (error as AxiosError).response?.status
        }": ${JSON.stringify((error as AxiosError).response?.data)}`
      );

      process.exit(ErrorCodeEnum.HttpResponseError);
    }
  }

  if ((error as ActionError).code && (error as ActionError).code > 0) {
    setFailed(error.message);

    process.exit((error as ActionError).code);
  }

  setFailed(error.message);

  process.exit(ErrorCodeEnum.UnknownError);
}
