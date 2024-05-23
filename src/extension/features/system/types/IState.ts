// types
import type { ILogger } from '@common/types';
import type IConfirmModal from './IConfirmModal';
import type IScanQRCodeModal from './IScanQRCodeModal';

interface IState {
  confirmModal: IConfirmModal | null;
  logger: ILogger;
  online: boolean;
  scanQRCodeModal: IScanQRCodeModal | null;
  sidebar: boolean;
}

export default IState;
