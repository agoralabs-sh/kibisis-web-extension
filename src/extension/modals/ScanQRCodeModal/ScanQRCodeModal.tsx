import { Modal } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

// components
import AccountImportConfirmationModalContent from '@extension/components/AccountImportConfirmationModalContent';
import ScanModeModalContent from '@extension/components/ScanModeModalContent';
import ScanQRCodeViaCameraModalContent from '@extension/components/ScanQRCodeViaCameraModalContent';
import ScanQRCodeViaTabModalContent from '@extension/components/ScanQRCodeViaTabModalContent';
import UnknownURIModalContent from '@extension/components/UnknownURIModalContent';
import AssetAddModalContent from './AssetAddModalContent';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

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

interface IProps {
  onClose: () => void;
}

const ScanQRCodeModal: FC<IProps> = ({ onClose }: IProps) => {
  // selectors
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
  const isOpen: boolean = useSelectScanQRCodeModal();
  // state
  const [scanViaCamera, setScanViaCamera] = useState<boolean>(false);
  const [scanViaTab, setScanViaTab] = useState<boolean>(false);
  const [uri, setURI] = useState<string | null>(null);
  // misc
  const reset = () => {
    setURI(null);
    setScanViaCamera(false);
    setScanViaTab(false);
  };
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    reset();
    onClose();
  };
  const handleOnURI = (uri: string) => setURI(uri);
  const handlePreviousClick = () => reset();
  const handleScanBrowserWindowClick = () => setScanViaTab(true);
  const handleScanUsingCameraClick = () => setScanViaCamera(true);
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
                <AccountImportConfirmationModalContent
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
                <AssetAddModalContent
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
        <UnknownURIModalContent
          onPreviousClick={handlePreviousClick}
          uri={uri}
        />
      );
    }

    if (scanViaCamera) {
      return (
        <ScanQRCodeViaCameraModalContent
          onPreviousClick={handlePreviousClick}
          onURI={handleOnURI}
        />
      );
    }

    if (scanViaTab) {
      return (
        <ScanQRCodeViaTabModalContent
          onPreviousClick={handlePreviousClick}
          onURI={handleOnURI}
        />
      );
    }

    return (
      <ScanModeModalContent
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
    >
      {renderContent()}
    </Modal>
  );
};

export default ScanQRCodeModal;
