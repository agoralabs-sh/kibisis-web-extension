import { Modal, ModalContent } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';

// components
import ScanQRCodeModalScanningContent from './ScanQRCodeModalScanningContent';
import ScanQRCodeModalUnknownURIContent from './ScanQRCodeModalUnknownURIContent';

// constants
import { BODY_BACKGROUND_COLOR } from '@extension/constants';

// hooks
import useCaptureQrCode from '@extension/hooks/useCaptureQrCode';

// selectors
import { useSelectScanQRCodeModal } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import { IArc0300BaseSchema } from '@extension/types';

interface IProps {
  onClose: () => void;
}

const ScanQRCodeModal: FC<IProps> = ({ onClose }: IProps) => {
  // selectors
  const isOpen: boolean = useSelectScanQRCodeModal();
  // hooks
  const { scanning, startScanningAction, stopScanningAction, uri } =
    useCaptureQrCode();
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    stopScanningAction();
    onClose();
  };
  // renders
  const renderContent = () => {
    let arc0300Schema: IArc0300BaseSchema | null;

    if (scanning) {
      return (
        <ScanQRCodeModalScanningContent onCancelClick={handleCancelClick} />
      );
    }

    return (
      <ScanQRCodeModalUnknownURIContent
        onCancelClick={handleCancelClick}
        uri={uri}
      />
    );
  };

  useEffect(() => {
    if (isOpen) {
      startScanningAction();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        {renderContent()}
      </ModalContent>
    </Modal>
  );
};

export default ScanQRCodeModal;
