import { Modal } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

// components
import ScanQRCodeModalAccountImportContent from './ScanQRCodeModalAccountImportContent';
import ScanQRCodeModalCameraStreamContent from './ScanQRCodeModalCameraStreamContent';
import ScanQRCodeModalScanningContent from './ScanQRCodeModalScanningContent';
import ScanQRCodeModalSelectScanModeContent from './ScanQRCodeModalSelectScanModeContent';
import ScanQRCodeModalUnknownURIContent from './ScanQRCodeModalUnknownURIContent';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// hooks
import useCaptureQRCode from '@extension/hooks/useCaptureQRCode';

// selectors
import {
  useSelectLogger,
  useSelectNetworks,
  useSelectScanQRCodeModal,
} from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type {
  IARC0300AccountImportSchema,
  IARC0300AssetAddSchema,
  IARC0300BaseSchema,
  INetwork,
} from '@extension/types';

// utils
import parseURIToARC0300Schema from '@extension/utils/parseURIToARC0300Schema';
import ScanQRCodeModalAssetAddContent from '@extension/modals/ScanQRCodeModal/ScanQRCodeModalAssetAddContent';

interface IProps {
  onClose: () => void;
}

const ScanQRCodeModal: FC<IProps> = ({ onClose }: IProps) => {
  // selectors
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
  const isOpen: boolean = useSelectScanQRCodeModal();
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
          case ARC0300AuthorityEnum.Asset:
            if (arc0300Schema.paths[0] === ARC0300PathEnum.Add) {
              return (
                <ScanQRCodeModalAssetAddContent
                  onComplete={handleClose}
                  onPreviousClick={handlePreviousClick}
                  schema={arc0300Schema as IARC0300AssetAddSchema}
                />
              );
            }

            break;
          default:
            break;
        }
      }

      // if the uri cannot be parsed
      return (
        <ScanQRCodeModalUnknownURIContent
          onPreviousClick={handlePreviousClick}
          uri={uri}
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
        <ScanQRCodeModalScanningContent onPreviousClick={handlePreviousClick} />
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

export default ScanQRCodeModal;
