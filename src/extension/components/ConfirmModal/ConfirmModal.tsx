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
import React, { createRef, FC, RefObject } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import Button from '@extension/components/Button';
import Warning from '@extension/components/Warning';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Features
import { IConfirm } from '@extension/features/application';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// Selectors
import { useSelectConfirm } from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

interface IProps {
  onClose: () => void;
}

const ConfirmModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const confirm: IConfirm | null = useSelectConfirm();
  const defaultTextColor: string = useDefaultTextColor();
  const initialRef: RefObject<HTMLButtonElement> | undefined = createRef();
  const handleCancelClick = () => {
    if (confirm?.onCancel) {
      confirm.onCancel();
    }

    onClose();
  };
  const handleConfirmClick = () => {
    if (confirm?.onConfirm) {
      confirm.onConfirm();
    }

    onClose();
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={!!confirm}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        alignSelf="flex-end"
        backgroundColor="var(--chakra-colors-chakra-body-bg)"
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        minH="0dvh"
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {confirm?.title || 'Confirm'}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4} w="full">
            <Text color={defaultTextColor} fontSize="md" textAlign="left">
              {confirm?.description || 'Are you sure?'}
            </Text>
            {confirm?.warningText && (
              <Warning message={confirm.warningText} size="sm" />
            )}
          </VStack>
        </ModalBody>
        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={4} w="full">
            <Button
              colorScheme="primary"
              onClick={handleCancelClick}
              ref={initialRef}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>
            <Button
              colorScheme="primary"
              onClick={handleConfirmClick}
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
