import { Modal, ModalContent } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';

// components
import ScanQRCodeModalAccountImportContent from './ScanQRCodeModalAccountImportContent';
import ScanQRCodeModalScanningContent from './ScanQRCodeModalScanningContent';
import ScanQRCodeModalUnknownURIContent from './ScanQRCodeModalUnknownURIContent';

// constants
import { BODY_BACKGROUND_COLOR } from '@extension/constants';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// hooks
import useCaptureQrCode from '@extension/hooks/useCaptureQrCode';

// selectors
import {
  useSelectLogger,
  useSelectScanQRCodeModal,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

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
  const { scanning, startScanningAction, stopScanningAction, uri } =
    useCaptureQrCode();
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    stopScanningAction();
    onClose();
  };
  const handleRetryScan = () => startScanningAction();
  // renders
  const renderContent = () => {
    let arc0300Schema: IARC0300BaseSchema | null;

    if (scanning) {
      return (
        <ScanQRCodeModalScanningContent onCancelClick={handleCancelClick} />
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
                  onCancelClick={handleCancelClick}
                  onComplete={handleClose}
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
      <ScanQRCodeModalUnknownURIContent
        onCancelClick={handleCancelClick}
        onTryAgainClick={handleRetryScan}
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
