import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import browser from 'webextension-polyfill';

// Components
import Button from '@extension/components/Button';
import PasswordInput from '@extension/components/PasswordInput';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Selectors
import { useSelectLogger } from '@extension/selectors';

// Services
import { PrivateKeyService } from '@extension/services';

// Theme
import { theme } from '@extension/theme';

// Types
import { ILogger } from '@common/types';

interface IProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (password: string) => void;
}

const ConfirmPasswordModal: FC<IProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}: IProps) => {
  const { t } = useTranslation();
  const logger: ILogger = useSelectLogger();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const handleClose = () => {
    setPassword(null);
    onCancel();
  };
  const handleConfirmClick = async () => {
    let isValid: boolean;
    let privateKeyService: PrivateKeyService;

    if (!password) {
      setError(t<string>('errors.inputs.required', { name: 'Password' }));

      return;
    }

    setError(null);

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });

    setVerifying(true);

    isValid = await privateKeyService.verifyPassword(password);

    setVerifying(false);

    if (!isValid) {
      setError(t<string>('errors.inputs.invalidPassword'));
    }

    setValid(isValid);
  };
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPassword(event.target.value);
  };

  useEffect(() => {
    if (password && valid) {
      setPassword(null);
      onConfirm(password);
    }
  }, [valid]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        alignSelf="flex-end"
        backgroundColor="var(--chakra-colors-chakra-body-bg)"
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        minH={0}
      >
        <ModalBody>
          <VStack w="full">
            <PasswordInput
              disabled={verifying}
              error={error}
              hint={t<string>('captions.mustEnterPasswordToSign')}
              onChange={handlePasswordChange}
              value={password || ''}
            />
          </VStack>
        </ModalBody>
        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={4} w="full">
            <Button
              colorScheme="primary"
              onClick={handleClose}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>
            <Button
              colorScheme="primary"
              isLoading={verifying}
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

export default ConfirmPasswordModal;
