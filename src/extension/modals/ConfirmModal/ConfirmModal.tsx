import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkOutline } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import Warning from '@extension/components/Warning';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// features
import type { IConfirmModal } from '@extension/features/layout';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import { useSelectConfirmModal } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { IModalProps } from '@extension/types';

const ConfirmModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const initialRef = useRef<HTMLButtonElement | null>(null);
  // hooks
  const confirm: IConfirmModal | null = useSelectConfirmModal();
  // selectors
  const defaultTextColor: string = useDefaultTextColor();
  // handlers
  const handleCancelClick = () => {
    if (confirm?.onCancel) {
      confirm.onCancel();
    }

    handleClose();
  };
  const handleConfirmClick = () => {
    if (confirm?.onConfirm) {
      confirm.onConfirm();
    }

    handleClose();
  };
  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={!!confirm}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />

      <ModalContent
        alignSelf="flex-end"
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        minH="0dvh"
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {confirm?.title || t<string>('headings.confirm')}
          </Heading>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            {/*description*/}
            <Text color={defaultTextColor} fontSize="sm" textAlign="left">
              {confirm?.description || t<string>('captions.defaultConfirm')}
            </Text>

            {/*warning text*/}
            {confirm?.warningText && (
              <Warning message={confirm.warningText} size="sm" />
            )}
          </VStack>
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {/*cancel*/}
            <Button
              onClick={handleCancelClick}
              ref={initialRef}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>

            {/*confirm*/}
            <Button
              onClick={handleConfirmClick}
              rightIcon={<IoCheckmarkOutline />}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.confirm')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
