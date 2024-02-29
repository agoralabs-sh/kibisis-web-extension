import { Modal } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

// components
import ScanQRCodeModalAccountImportContent from '@extension/components/ScanQRCodeModalAccountImportContent';
import ScanQRCodeModalCameraStreamContent from '@extension/components/ScanQRCodeModalCameraStreamContent';
import ScanQRCodeModalSelectScanModeContent from '@extension/components/ScanQRCodeModalScanModeContent';
import ScanQRCodeModalScanningBrowserWindowContent from '@extension/components/ScanQRCodeModalScanningBrowserWindowContent';
import ScanQRCodeModalUnknownURIContent from '@extension/components/ScanQRCodeModalUnkownURIContent';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// hooks
import useCaptureQRCode from '@extension/hooks/useCaptureQRCode';

// selectors
import { useSelectLogger, useSelectNetworks } from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type {
  IARC0300AccountImportSchema,
  IARC0300BaseSchema,
  INetwork,
} from '@extension/types';
import type { IProps } from './types';

// utils
import parseURIToARC0300Schema from '@extension/utils/parseURIToARC0300Schema';

const ScanQRCodeAddAccountModal: FC<IProps> = ({ isOpen, onClose }) => {
  // selectors
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
  // hooks
  const { resetAction, scanning, startScanningAction, uri } =
    useCaptureQRCode();
  // state
  const [showCamera, setShowCamera] = useState<boolean>(false);
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    resetAction();
    onClose();
  };
  const handlePreviousClick = () => {
    resetAction();
    setShowCamera(false); // close the webcam, if open
  };
  const handleScanBrowserWindowClick = () => {
    startScanningAction('browserWindow');
  };
  const handleScanUsingCameraClick = async () => {
    setShowCamera(true);
    startScanningAction('extensionPopup');
  };
  // renders
  const renderContent = () => {
    let arc0300Schema: IARC0300BaseSchema | null;

    if (uri) {
      arc0300Schema = parseURIToARC0300Schema(uri, {
        logger,
        supportedNetworks: networks,
      });

      if (
        !arc0300Schema ||
        arc0300Schema.authority !== ARC0300AuthorityEnum.Account ||
        arc0300Schema.paths[0] !== ARC0300PathEnum.Import
      ) {
        return (
          <ScanQRCodeModalUnknownURIContent
            onPreviousClick={handlePreviousClick}
            uri={uri}
          />
        );
      }

      return (
        <ScanQRCodeModalAccountImportContent
          onComplete={handleClose}
          onPreviousClick={handlePreviousClick}
          schema={arc0300Schema as IARC0300AccountImportSchema}
        />
      );
    }

    if (showCamera) {
      return (
        <ScanQRCodeModalCameraStreamContent
          onPreviousClick={handlePreviousClick}
        />
      );
    }

    if (scanning) {
      return (
        <ScanQRCodeModalScanningBrowserWindowContent
          onPreviousClick={handlePreviousClick}
        />
      );
    }

    return (
      <ScanQRCodeModalSelectScanModeContent
        onCancelClick={handleCancelClick}
        onScanBrowserWindowClick={handleScanBrowserWindowClick}
        onScanUsingCameraClick={handleScanUsingCameraClick}
      />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
      useInert={false} // ensure the camera screen can be captured
    >
      {renderContent()}
    </Modal>
  );
};

export default ScanQRCodeAddAccountModal;
