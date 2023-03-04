import { CreateToastFnReturn } from '@chakra-ui/react';

// Errors
import { BaseError } from '../../../errors';

// Types
import { ILogger } from '../../../types';

interface IApplicationState {
  error: BaseError | null;
  logger: ILogger;
  toast: CreateToastFnReturn | null;
}

export default IApplicationState;
