import { Modal } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

// components
import ScanQRCodeModalAccountImportContent from './ScanQRCodeModalAccountImportContent';
import ScanQRCodeModalScanningContent from './ScanQRCodeModalScanningContent';
import ScanQRCodeModalSelectScanLocationContent from './ScanQRCodeModalSelectScanLocationContent';
import ScanQRCodeModalStreamWebcamContent from './ScanQRCodeModalStreamWebcamContent';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// hooks
import useCaptureQrCode from '@extension/hooks/useCaptureQrCode';

// selectors
import {
  useSelectLogger,
  useSelectScanQRCodeModal,
} from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type {
  IARC0300AccountImportSchema,
  IARC0300BaseSchema,
} from '@extension/types';

// utils
import parseURIToARC0300Schema from '@extension/utils/parseURIToARC0300Schema';

interface IProps {
  onClose: () => void;
}

const ScanQRCodeModal: FC<IProps> = ({ onClose }: IProps) => {
  // selectors
  const logger: ILogger = useSelectLogger();
  const isOpen: boolean = useSelectScanQRCodeModal();
  // hooks
  const { resetAction, scanning, startScanningAction, uri } =
    useCaptureQrCode();
  // state
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    resetAction();
    onClose();
  };
  const handlePreviousClick = () => {
    resetAction();
    setShowWebcam(false); // close the webcam, if open
  };
  const handleScanBrowserWindowClick = () => {
    startScanningAction('browserWindow');
  };
  const handleScanUsingWebcamClick = async () => {
    setShowWebcam(true);
    startScanningAction('extensionPopup');
  };
  // renders
  const renderContent = () => {
    let arc0300Schema: IARC0300BaseSchema | null;

    if (showWebcam) {
      return (
        <ScanQRCodeModalStreamWebcamContent
          onPreviousClick={handlePreviousClick}
        />
      );
    }

    if (scanning) {
      return (
        <ScanQRCodeModalScanningContent onPreviousClick={handlePreviousClick} />
      );
    }

    if (uri) {
      arc0300Schema = parseURIToARC0300Schema(uri, { logger });

      if (arc0300Schema) {
        switch (arc0300Schema.authority) {
          case ARC0300AuthorityEnum.Account:
            if (arc0300Schema.paths[0] === ARC0300PathEnum.Import) {
              return (
                <ScanQRCodeModalAccountImportContent
                  onComplete={handleClose}
                  onPreviousClick={handlePreviousClick}
                  schema={arc0300Schema as IARC0300AccountImportSchema}
                />
              );
            }

            break;
          default:
            break;
        }
      }
    }

    return (
      <ScanQRCodeModalSelectScanLocationContent
        onCancelClick={handleCancelClick}
        onScanBrowserWindowClick={handleScanBrowserWindowClick}
        onScanUsingWebcamClick={handleScanUsingWebcamClick}
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
    >
      {renderContent()}
    </Modal>
  );
};

export default ScanQRCodeModal;
