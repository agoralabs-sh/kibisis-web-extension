import { Modal } from '@chakra-ui/react';
import { TransactionType } from 'algosdk';
import React, { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline } from 'react-icons/io5';

// components
import ARC0300AccountImportModalContent from '@extension/components/ARC0300AccountImportModalContent';
import ARC0300AssetAddModalContent from '@extension/components/ARC0300AssetAddModalContent';
import ARC0300KeyRegistrationTransactionSendModalContent from '@extension/components/ARC0300KeyRegistrationTransactionSendModalContent';
import ScanModeModalContent from '@extension/components/ScanModeModalContent';
import ScanQRCodeViaCameraModalContent from '@extension/components/ScanQRCodeViaCameraModalContent';
import ScanQRCodeViaScreenCaptureModalContent from '@extension/components/ScanQRCodeViaScreenCaptureModalContent';
import ScanQRCodeViaTabModalContent from '@extension/components/ScanQRCodeViaTabModalContent';
import UnknownURIModalContent from '@extension/components/UnknownURIModalContent';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// selectors
import {
  useSelectLogger,
  useSelectNetworks,
  useSelectScanQRCodeModal,
} from '@extension/selectors';

// types
import type {
  IARC0300AccountImportSchema,
  IARC0300AssetAddSchema,
  IARC0300BaseSchema,
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
  IModalProps,
  TARC0300TransactionSendSchemas,
} from '@extension/types';

// utils
import isARC0300SchemaPaginationComplete from '@extension/utils/isARC0300SchemaPaginationComplete';
import parseURIToARC0300Schema from '@extension/utils/parseURIToARC0300Schema';
import determinePaginationFromARC0300Schemas from '@extension/utils/determinePaginationFromARC0300Schemas';

const ScanQRCodeModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  // selectors
  const logger = useSelectLogger();
  const networks = useSelectNetworks();
  const scanQRCodeModal = useSelectScanQRCodeModal();
  // state
  const [scanViaCamera, setScanViaCamera] = useState<boolean>(false);
  const [scanViaScreenCapture, setScanViaScreenCapture] =
    useState<boolean>(false);
  const [scanViaTab, setScanViaTab] = useState<boolean>(false);
  const [uris, setURIs] = useState<string[]>([]);
  // misc
  const _context = 'scan-qr-code-modal';
  const reset = () => {
    setURIs([]);
    setScanViaCamera(false);
    setScanViaScreenCapture(false);
    setScanViaTab(false);
  };
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    reset();
    onClose && onClose();
  };
  const handleOnURI = (uri: string) => {
    const index = uris.findIndex((value) => value === uri);

    // if the uri doesn't exist, add it
    if (index < 0) {
      setURIs([...uris, uri]);
    }
  };
  const handlePreviousClick = () => reset();
  const handleScanViaCameraClick = () => setScanViaCamera(true);
  const handleScanViaScreenCaptureClick = () => setScanViaScreenCapture(true);
  const handleScanViaTabClick = () => setScanViaTab(true);
  // renders
  const renderContent = () => {
    let pagination: [number, number] | null = null;
    let primeSchema: IARC0300BaseSchema | null;
    let schemas: IARC0300BaseSchema[];

    if (uris.length > 0) {
      schemas = uris.reduce((acc, currentValue) => {
        const schema = parseURIToARC0300Schema(currentValue, {
          logger,
          supportedNetworks: networks,
        });

        return !schema ? acc : [...acc, schema];
      }, []);

      if (!scanQRCodeModal) {
        // TODO: show loading screening

        return;
      }

      primeSchema = schemas[0];

      // if the uri cannot be parsed
      if (!primeSchema) {
        return (
          <UnknownURIModalContent
            onPreviousClick={handlePreviousClick}
            uri={uris[0]}
          />
        );
      }

      switch (primeSchema.authority) {
        case ARC0300AuthorityEnum.Account:
          if (
            scanQRCodeModal.allowedAuthorities.length <= 0 ||
            scanQRCodeModal.allowedAuthorities.includes(
              ARC0300AuthorityEnum.Account
            )
          ) {
            // import
            if (
              primeSchema.paths[0] === ARC0300PathEnum.Import &&
              (scanQRCodeModal.allowedParams.length <= 0 ||
                scanQRCodeModal.allowedParams.includes(ARC0300PathEnum.Import))
            ) {
              if (isARC0300SchemaPaginationComplete(schemas)) {
                return (
                  <ARC0300AccountImportModalContent
                    _context={_context}
                    cancelButtonIcon={<IoArrowBackOutline />}
                    cancelButtonLabel={t<string>('buttons.previous')}
                    onComplete={handleClose}
                    onCancel={handlePreviousClick}
                    schemaOrSchemas={schemas as IARC0300AccountImportSchema[]}
                  />
                );
              }

              // set pagination to update ui
              pagination = determinePaginationFromARC0300Schemas(schemas);
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
              primeSchema.paths[0] === ARC0300PathEnum.Add &&
              (scanQRCodeModal.allowedParams.length <= 0 ||
                scanQRCodeModal.allowedParams.includes(ARC0300PathEnum.Add))
            ) {
              return (
                <ARC0300AssetAddModalContent
                  _context={_context}
                  cancelButtonIcon={<IoArrowBackOutline />}
                  cancelButtonLabel={t<string>('buttons.previous')}
                  onComplete={handleClose}
                  onCancel={handlePreviousClick}
                  schemaOrSchemas={primeSchema as IARC0300AssetAddSchema}
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
              primeSchema.paths[0] === ARC0300PathEnum.Send &&
              (scanQRCodeModal.allowedParams.length <= 0 ||
                scanQRCodeModal.allowedParams.includes(ARC0300PathEnum.Send))
            ) {
              switch (
                (primeSchema as TARC0300TransactionSendSchemas).query.type
              ) {
                case TransactionType.keyreg:
                  return (
                    <ARC0300KeyRegistrationTransactionSendModalContent
                      _context={_context}
                      cancelButtonIcon={<IoArrowBackOutline />}
                      cancelButtonLabel={t<string>('buttons.previous')}
                      onComplete={handleClose}
                      onCancel={handlePreviousClick}
                      schemaOrSchemas={
                        primeSchema as
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

    if (scanViaCamera) {
      return (
        <ScanQRCodeViaCameraModalContent
          onPreviousClick={handlePreviousClick}
          onURI={handleOnURI}
          {...(pagination && { pagination })}
        />
      );
    }

    if (scanViaScreenCapture) {
      return (
        <ScanQRCodeViaScreenCaptureModalContent
          onPreviousClick={handlePreviousClick}
          onURI={handleOnURI}
          {...(pagination && { pagination })}
        />
      );
    }

    if (scanViaTab) {
      return (
        <ScanQRCodeViaTabModalContent
          onPreviousClick={handlePreviousClick}
          onURI={handleOnURI}
          {...(pagination && { pagination })}
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
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      {renderContent()}
    </Modal>
  );
};

export default ScanQRCodeModal;
