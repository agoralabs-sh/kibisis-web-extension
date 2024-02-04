import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

/**
 * Selects whether the scan QR code modal is open.
 * @returns {boolean} true, if the scan qr code modal is open, false if it is closed.
 */
export default function useSelectScanQRCodeModal(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.system.scanQRCodeModal
  );
}
