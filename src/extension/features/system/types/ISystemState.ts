// types
import type { ILogger } from '@common/types';
import IConfirmModal from './IConfirmModal';
import IScanQRCodeModal from './IScanQRCodeModal';

interface ISystemState {
  confirmModal: IConfirmModal | null;
  logger: ILogger;
  online: boolean;
  scanQRCodeModal: IScanQRCodeModal | null;
  sidebar: boolean;
}

export default ISystemState;
