import { useSelector } from 'react-redux';

// features
import type { IScanQRCodeModal } from '@extension/features/system';

// types
import type { IMainRootState } from '@extension/types';

/**
 * Selects the state of the scan QR code modal.
 * @returns {IScanQRCodeModal | null} the scan QR code modal state.
 */
export default function useSelectScanQRCodeModal(): IScanQRCodeModal | null {
  return useSelector<IMainRootState, IScanQRCodeModal | null>(
    (state) => state.system.scanQRCodeModal
  );
}
