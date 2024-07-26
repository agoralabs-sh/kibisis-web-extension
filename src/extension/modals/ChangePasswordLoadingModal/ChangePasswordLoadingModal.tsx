import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import ReEncryptKeysLoadingContent from '@extension/components/ReEncryptKeysLoadingContent';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

const ChangePasswordLoadingModal: FC<IProps> = ({
  encryptionProgressState,
  isOpen,
  onClose,
}) => {
  // handlers
  const handleCLose = () => onClose && onClose();

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleCLose}
      size="full"
    >
      <ModalOverlay />

      <ModalContent
        alignSelf="flex-end"
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        minH="45%"
      >
        <ModalBody display="flex" px={DEFAULT_GAP * 2}>
          <ReEncryptKeysLoadingContent
            encryptionProgressState={encryptionProgressState}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordLoadingModal;
