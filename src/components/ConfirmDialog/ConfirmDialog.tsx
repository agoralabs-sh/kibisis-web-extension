import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import React, { createRef, FC, RefObject } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import Button from '../Button';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

interface IProps {
  description: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}

const ConfirmDialog: FC<IProps> = ({
  description,
  isOpen,
  onConfirm,
  onCancel,
  title,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const cancelRef: RefObject<HTMLButtonElement> | undefined = createRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      motionPreset="slideInBottom"
      onClose={onCancel}
    >
      <AlertDialogOverlay>
        <AlertDialogContent
          backgroundColor="var(--chakra-colors-chakra-body-bg)"
          borderRadius="md"
        >
          <AlertDialogHeader
            color={defaultTextColor}
            fontSize="lg"
            fontWeight="bold"
          >
            {title}
          </AlertDialogHeader>
          <AlertDialogBody color={defaultTextColor} w="full">
            {description}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              colorScheme="primary"
              mr={3}
              onClick={onCancel}
              ref={cancelRef}
              variant="ouline"
            >
              {t<string>('buttons.cancel')}
            </Button>
            <Button colorScheme="red" onClick={onConfirm} variant="solid">
              {t<string>('buttons.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmDialog;
