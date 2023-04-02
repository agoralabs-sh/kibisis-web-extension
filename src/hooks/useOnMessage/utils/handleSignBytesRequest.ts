// Types
import {
  IAppThunkDispatch,
  IExtensionSignBytesRequestPayload,
  ISession,
} from '../../../types';
import { IIncomingRequest } from '../types';

interface IOptions {
  sessions: ISession[];
}

export default function handleSignBytesRequest(
  dispatch: IAppThunkDispatch,
  request: IIncomingRequest<IExtensionSignBytesRequestPayload>,
  { sessions }: IOptions
): void {
  console.log('handleSignBytesRequest()#request: ', request);
}
