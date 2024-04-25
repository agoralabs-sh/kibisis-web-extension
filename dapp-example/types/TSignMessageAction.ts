// types
import type ISignMessageActionResult from './ISignMessageActionResult';

type TSignMessageAction = (
  message: string,
  signer?: string
) => Promise<ISignMessageActionResult> | ISignMessageActionResult;

export default TSignMessageAction;
