import { Modal } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

// components
import ScanModeModalContent from '@extension/components/ScanModeModalContent';
import ScanQRCodeViaCameraModalContent from '@extension/components/ScanQRCodeViaCameraModalContent';
import ScanQRCodeViaTabModalContent from '@extension/components/ScanQRCodeViaTabModalContent';
import UnknownURIModalContent from '@extension/components/UnknownURIModalContent';
import AccountImportModalContent from './AccountImportModalContent';
import AssetAddModalContent from './AssetAddModalContent';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// features
import type { IScanQRCodeModal } from '@extension/features/system';

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
  const scanQRCodeModal: IScanQRCodeModal | null = useSelectScanQRCodeModal();
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
  const handleScanViaCameraClick = () => setScanViaCamera(true);
  const handleScanViaTabClick = () => setScanViaTab(true);
  // renders
  const renderContent = () => {
    let arc0300Schema: IARC0300BaseSchema | null;

    if (uri) {
      arc0300Schema = parseURIToARC0300Schema(uri, {
        logger,
        supportedNetworks: networks,
      });

      if (scanQRCodeModal && arc0300Schema) {
        switch (arc0300Schema.authority) {
          case ARC0300AuthorityEnum.Account:
            if (
              scanQRCodeModal.allowedAuthorities.length <= 0 ||
              scanQRCodeModal.allowedAuthorities.includes(
                ARC0300AuthorityEnum.Account
              )
            ) {
              // import
              if (
                arc0300Schema.paths[0] === ARC0300PathEnum.Import &&
                (scanQRCodeModal.allowedParams.length <= 0 ||
                  scanQRCodeModal.allowedParams.includes(
                    ARC0300PathEnum.Import
                  ))
              ) {
                return (
                  <AccountImportModalContent
                    onComplete={handleClose}
                    onPreviousClick={handlePreviousClick}
                    schema={arc0300Schema as IARC0300AccountImportSchema}
                  />
                );
              }
            }

            break;
          case ARC0300AuthorityEnum.Asset:
            if (
              scanQRCodeModal.allowedAuthorities.length <= 0 ||
              scanQRCodeModal.allowedAuthorities.includes(
                ARC0300AuthorityEnum.Asset
              )
            ) {
              // add
              if (
                arc0300Schema.paths[0] === ARC0300PathEnum.Add &&
                (scanQRCodeModal.allowedParams.length <= 0 ||
                  scanQRCodeModal.allowedParams.includes(ARC0300PathEnum.Add))
              ) {
                return (
                  <AssetAddModalContent
                    onComplete={handleClose}
                    onPreviousClick={handlePreviousClick}
                    schema={arc0300Schema as IARC0300AssetAddSchema}
                  />
                );
              }
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
        onScanViaTabClick={handleScanViaTabClick}
        onScanViaCameraClick={handleScanViaCameraClick}
      />
    );
  };

  return (
    <Modal
      isOpen={!!scanQRCodeModal}
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
