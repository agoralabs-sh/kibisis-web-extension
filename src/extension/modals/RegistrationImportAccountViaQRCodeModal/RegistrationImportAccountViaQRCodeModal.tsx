import { Modal } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

// components
import ScanModeModalContent from '@extension/components/ScanModeModalContent';
import ScanQRCodeViaCameraModalContent from '@extension/components/ScanQRCodeViaCameraModalContent';
import ScanQRCodeViaTabModalContent from '@extension/components/ScanQRCodeViaTabModalContent';
import UnknownURIModalContent from '@extension/components/UnknownURIModalContent';
import ConfirmAccountModalContent from './ConfirmAccountModalContent';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// selectors
import { useSelectLogger, useSelectNetworks } from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type {
  IARC0300AccountImportSchema,
  IARC0300BaseSchema,
  INetwork,
  IRegistrationAddAccountCompleteResult,
} from '@extension/types';
import type { IProps } from './types';

// utils
import parseURIToARC0300Schema from '@extension/utils/parseURIToARC0300Schema';

const RegistrationImportAccountViaQRCodeModal: FC<IProps> = ({
  isOpen,
  onClose,
  onComplete,
  saving,
}) => {
  // selectors
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
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
  const handleOnComplete = async (
    result: IRegistrationAddAccountCompleteResult
  ) => onComplete(result);
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

      if (
        !arc0300Schema ||
        arc0300Schema.authority !== ARC0300AuthorityEnum.Account ||
        arc0300Schema.paths[0] !== ARC0300PathEnum.Import
      ) {
        return (
          <UnknownURIModalContent
            onPreviousClick={handlePreviousClick}
            uri={uri}
          />
        );
      }

      return (
        <ConfirmAccountModalContent
          onComplete={handleOnComplete}
          onPreviousClick={handlePreviousClick}
          schema={arc0300Schema as IARC0300AccountImportSchema}
          saving={saving}
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
        onScanViaCameraClick={handleScanViaCameraClick}
        onScanViaTabClick={handleScanViaTabClick}
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

export default RegistrationImportAccountViaQRCodeModal;
