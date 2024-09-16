// types
import type IConfirmModal from './IConfirmModal';
import type IScanQRCodeModal from './IScanQRCodeModal';

interface IState {
  confirmModal: IConfirmModal | null;
  scanQRCodeModal: IScanQRCodeModal | null;
  sidebar: boolean;
  whatsNewModal: boolean;
}

export default IState;
