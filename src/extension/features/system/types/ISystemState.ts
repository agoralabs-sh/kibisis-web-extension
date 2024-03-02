// types
import type { ILogger } from '@common/types';
import IConfirm from './IConfirm';

interface ISystemState {
  confirm: IConfirm | null;
  logger: ILogger;
  online: boolean;
  scanQRCodeModal: boolean;
  sidebar: boolean;
}

export default ISystemState;
