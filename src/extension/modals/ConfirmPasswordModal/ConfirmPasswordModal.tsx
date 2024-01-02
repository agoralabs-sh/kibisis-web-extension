import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import browser from 'webextension-polyfill';

// components
import Button from '@extension/components/Button';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// selectors
import { useSelectLogger } from '@extension/selectors';

// services
import { PrivateKeyService } from '@extension/services';

// theme
import { theme } from '@extension/theme';

// types
import { ILogger } from '@common/types';

interface IProps {
  hint?: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (password: string) => void;
}

const ConfirmPasswordModal: FC<IProps> = ({
  hint,
  isOpen,
  onCancel,
  onConfirm,
}: IProps) => {
  const { t } = useTranslation();
  const passwordInputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  // hooks
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  // selectors
  const logger: ILogger = useSelectLogger();
  // state
  const [valid, setValid] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  // misc
  const reset = () => {
    resetPassword();
    setValid(false);
    setVerifying(false);
  };
  // handlers
  const handleCancelClick = () => handleClose();
  const handleConfirmClick = async () => {
    let isValid: boolean;
    let privateKeyService: PrivateKeyService;

    // check if the input is valid
    if (validatePassword()) {
      return;
    }

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });

    setVerifying(true);

    isValid = await privateKeyService.verifyPassword(password);

    setVerifying(false);

    if (!isValid) {
      setPasswordError(t<string>('errors.inputs.invalidPassword'));
    }

    setValid(isValid);

    onConfirm(password);

    // clean up
    reset();
  };
  const handleClose = () => {
    onCancel();

    // clean up
    reset();
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleConfirmClick();
    }
  };

  // set focus when opening
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

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
        {/*content*/}
        <ModalBody>
          <VStack w="full">
            <PasswordInput
              disabled={verifying}
              error={passwordError}
              hint={hint || t<string>('captions.mustEnterPasswordToConfirm')}
              inputRef={passwordInputRef}
              onChange={onPasswordChange}
              onKeyUp={handleKeyUpPasswordInput}
              value={password || ''}
            />
          </VStack>
        </ModalBody>

        {/*footer*/}
        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={4} w="full">
            <Button
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>
            <Button
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
