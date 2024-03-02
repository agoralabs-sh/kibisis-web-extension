// types
import type { ILogger } from '@common/types';
import IConfirmModal from './IConfirmModal';

interface ISystemState {
  confirmModal: IConfirmModal | null;
  logger: ILogger;
  online: boolean;
  scanQRCodeModal: boolean;
  sidebar: boolean;
}

export default ISystemState;
