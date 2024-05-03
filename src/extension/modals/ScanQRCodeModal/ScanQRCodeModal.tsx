import { Modal } from '@chakra-ui/react';
import { TransactionType } from 'algosdk';
import React, { FC, useState } from 'react';

// components
import ScanModeModalContent from '@extension/components/ScanModeModalContent';
import ScanQRCodeViaCameraModalContent from '@extension/components/ScanQRCodeViaCameraModalContent';
import ScanQRCodeViaScreenCaptureModalContent from '@extension/components/ScanQRCodeViaScreenCaptureModalContent';
import ScanQRCodeViaTabModalContent from '@extension/components/ScanQRCodeViaTabModalContent';
import UnknownURIModalContent from '@extension/components/UnknownURIModalContent';
import AccountImportModalContent from './AccountImportModalContent';
import AssetAddModalContent from './AssetAddModalContent';
import KeyRegistrationTransactionSendModal from './KeyRegistrationTransactionSendModal';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// selectors
import {
  useSelectLogger,
  useSelectNetworks,
  useSelectScanQRCodeModal,
} from '@extension/selectors';

// types
import {
  IARC0300AccountImportSchema,
  IARC0300AssetAddSchema,
  IARC0300BaseSchema,
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
  IModalProps,
  TARC0300TransactionSendSchemas,
} from '@extension/types';

// utils
import parseURIToARC0300Schema from '@extension/utils/parseURIToARC0300Schema';

const ScanQRCodeModal: FC<IModalProps> = ({ onClose }) => {
  // selectors
  const logger = useSelectLogger();
  const networks = useSelectNetworks();
  const scanQRCodeModal = useSelectScanQRCodeModal();
  // state
  const [scanViaCamera, setScanViaCamera] = useState<boolean>(false);
  const [scanViaScreenCapture, setScanViaScreenCapture] =
    useState<boolean>(false);
  const [scanViaTab, setScanViaTab] = useState<boolean>(false);
  const [uri, setURI] = useState<string | null>(null);
  // misc
  const reset = () => {
    setURI(null);
    setScanViaCamera(false);
    setScanViaScreenCapture(false);
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
  const handleScanViaScreenCaptureClick = () => setScanViaScreenCapture(true);
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
          case ARC0300AuthorityEnum.Transaction:
            if (
              scanQRCodeModal.allowedAuthorities.length <= 0 ||
              scanQRCodeModal.allowedAuthorities.includes(
                ARC0300AuthorityEnum.Transaction
              )
            ) {
              // send
              if (
                arc0300Schema.paths[0] === ARC0300PathEnum.Send &&
                (scanQRCodeModal.allowedParams.length <= 0 ||
                  scanQRCodeModal.allowedParams.includes(ARC0300PathEnum.Send))
              ) {
                switch (
                  (arc0300Schema as TARC0300TransactionSendSchemas).query.type
                ) {
                  case TransactionType.keyreg:
                    return (
                      <KeyRegistrationTransactionSendModal
                        onComplete={handleClose}
                        onPreviousClick={handlePreviousClick}
                        schema={
                          arc0300Schema as
                            | IARC0300OfflineKeyRegistrationTransactionSendSchema
                            | IARC0300OnlineKeyRegistrationTransactionSendSchema
                        }
                      />
                    );
                  default:
                    break;
                }
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

    if (scanViaScreenCapture) {
      return (
        <ScanQRCodeViaScreenCaptureModalContent
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
        onScanViaCameraClick={handleScanViaCameraClick}
        onScanViaScreenCaptureClick={handleScanViaScreenCaptureClick}
        onScanViaTabClick={handleScanViaTabClick}
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
