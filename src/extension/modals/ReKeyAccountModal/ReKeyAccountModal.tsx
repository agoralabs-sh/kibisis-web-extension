import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  VStack,
} from '@chakra-ui/react';
import React, { FC, KeyboardEvent, ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import ReKeyAccountConfirmingModalContent from './ReKeyAccountConfirmingModalContent';
import ReKeyAccountModalContent from './ReKeyAccountModalContent';
import UndoReKeyAccountModalContent from './UndoReKeyAccountModalContent';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import { updateAccountsThunk } from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';
import {
  reKeyAccountThunk,
  undoReKeyAccountThunk,
} from '@extension/features/re-key-account';

// hooks
import { useAddressInput } from '@extension/components/AddressInput';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useReKeyAccountModal from './hooks/useReKeyAccountModal';

// selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectSettings,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppThunkDispatch, IModalProps } from '@extension/types';

const ReKeyAccountModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts = useSelectAccounts();
  const logger = useSelectLogger();
  const passwordLockPassword = useSelectPasswordLockPassword();
  const settings = useSelectSettings();
  // hooks
  const {
    error: authAddressError,
    onBlur: onAuthAddressBlur,
    onChange: onAuthAddressChange,
    reset: resetAuthAddress,
    validate: validateAuthAddress,
    value: authAddress,
  } = useAddressInput();
  const defaultTextColor = useDefaultTextColor();
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const {
    account,
    accountInformation,
    confirming,
    network,
    type: reKeyType,
  } = useReKeyAccountModal();
  // misc
  const checkPassword = (): string | null => {
    const _functionName = 'checkPassword';

    // if there is no password lock
    if (!settings.security.enablePasswordLock && !passwordLockPassword) {
      // validate the password input
      if (validatePassword()) {
        logger.debug(
          `${ReKeyAccountModal.name}#${_functionName}: password not valid`
        );

        return null;
      }
    }

    return settings.security.enablePasswordLock
      ? passwordLockPassword
      : password;
  };
  const isOpen = !!account && !!accountInformation;
  const handleError = (error: BaseExtensionError) => {
    switch (error.code) {
      case ErrorCodeEnum.InvalidPasswordError:
        setPasswordError(t<string>('errors.inputs.invalidPassword'));

        break;
      case ErrorCodeEnum.OfflineError:
        dispatch(
          createNotification({
            ephemeral: true,
            title: t<string>('headings.offline'),
            type: 'error',
          })
        );
        break;
      default:
        dispatch(
          createNotification({
            description: t<string>('errors.descriptions.code', {
              code: error.code,
              context: error.code,
            }),
            ephemeral: true,
            title: t<string>('errors.titles.code', { context: error.code }),
            type: 'error',
          })
        );
        break;
    }
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    resetPassword();
    resetAuthAddress();
    onClose && onClose();
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      reKeyType === 'undo'
        ? await handleUndoReKeyClick()
        : await handleReKeyClick();
    }
  };
  const handleReKeyClick = async () => {
    const _functionName = 'handleReKeyClick';
    let _password: string | null;
    let transactionId: string | null;

    if (
      !account ||
      !accountInformation ||
      !authAddress ||
      !network ||
      validateAuthAddress()
    ) {
      return;
    }

    _password = checkPassword();

    if (!_password) {
      logger.debug(
        `${ReKeyAccountModal.name}#${_functionName}: unable to use password from password lock, value is "null"`
      );

      return;
    }

    try {
      transactionId = await dispatch(
        reKeyAccountThunk({
          authorizedAddress: authAddress,
          reKeyAccount: account,
          network: network,
          password: _password,
        })
      ).unwrap();

      if (transactionId) {
        dispatch(
          createNotification({
            title: t<string>('headings.reKeyAccountSuccessful'),
            type: 'success',
          })
        );

        // force update the account information as we spent fees and refresh all the new transactions
        dispatch(
          updateAccountsThunk({
            accountIds: [account.id],
            forceInformationUpdate: true,
            refreshTransactions: true,
          })
        );
      }

      handleClose();
    } catch (error) {
      handleError(error);
    }
  };
  const handleUndoReKeyClick = async () => {
    const _functionName = 'handleUndoReKeyClick';
    let _password: string | null;
    let transactionId: string | null;

    if (!account || !accountInformation || !network) {
      return;
    }

    _password = checkPassword();

    if (!_password) {
      logger.debug(
        `${ReKeyAccountModal.name}#${_functionName}: unable to use password from password lock, value is "null"`
      );

      return;
    }

    try {
      transactionId = await dispatch(
        undoReKeyAccountThunk({
          reKeyAccount: account,
          network: network,
          password: _password,
        })
      ).unwrap();

      if (transactionId) {
        dispatch(
          createNotification({
            title: t<string>('headings.undoReKeyAccountSuccessful'),
            type: 'success',
          })
        );

        // force update the account information as we spent fees and refresh all the new transactions
        dispatch(
          updateAccountsThunk({
            accountIds: [account.id],
            forceInformationUpdate: true,
            refreshTransactions: true,
          })
        );
      }

      handleClose();
    } catch (error) {
      handleError(error);
    }
  };
  // renders
  const renderContent = () => {
    if (account && accountInformation && network) {
      // undoing a re-key
      if (accountInformation.authAddress && reKeyType === 'undo') {
        if (confirming) {
          return (
            <ReKeyAccountConfirmingModalContent
              accounts={accounts}
              currentAddress={accountInformation.authAddress}
              network={network}
              reKeyAddress={AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              )}
              reKeyType={reKeyType}
            />
          );
        }

        return (
          <UndoReKeyAccountModalContent
            account={account}
            accounts={accounts}
            authAddress={accountInformation.authAddress}
            network={network}
          />
        );
      }

      // re-key account
      if (reKeyType === 'rekey') {
        if (confirming && authAddress) {
          return (
            <ReKeyAccountConfirmingModalContent
              accounts={accounts}
              currentAddress={
                accountInformation.authAddress ||
                AccountService.convertPublicKeyToAlgorandAddress(
                  account.publicKey
                )
              }
              network={network}
              reKeyAddress={authAddress}
              reKeyType={reKeyType}
            />
          );
        }

        return (
          <ReKeyAccountModalContent
            account={account}
            accountInformation={accountInformation}
            accounts={accounts}
            authAddress={authAddress}
            authAddressError={authAddressError}
            network={network}
            onAuthAddressBlur={onAuthAddressBlur}
            onAuthAddressChange={onAuthAddressChange}
          />
        );
      }
    }

    return (
      <VStack spacing={DEFAULT_GAP / 3} w="full">
        <ModalSkeletonItem />
        <ModalSkeletonItem />
        <ModalSkeletonItem />
      </VStack>
    );
  };
  const renderFooter = () => {
    const cancelButtonNode: ReactNode = (
      <Button onClick={handleCancelClick} size="lg" variant="outline" w="full">
        {t<string>('buttons.cancel')}
      </Button>
    );

    if (confirming) {
      return null;
    }

    if (accountInformation) {
      return (
        <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
          {!settings.security.enablePasswordLock && !passwordLockPassword && (
            <PasswordInput
              error={passwordError}
              hint={t<string>(
                reKeyType === 'undo'
                  ? 'captions.mustEnterPasswordToAuthorizeUndoReKey'
                  : 'captions.mustEnterPasswordToAuthorizeReKey'
              )}
              inputRef={passwordInputRef}
              onChange={onPasswordChange}
              onKeyUp={handleKeyUpPasswordInput}
              value={password}
            />
          )}

          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {cancelButtonNode}

            {reKeyType === 'undo' ? (
              <Button
                onClick={handleUndoReKeyClick}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.undo')}
              </Button>
            ) : (
              <Button
                onClick={handleReKeyClick}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.reKey')}
              </Button>
            )}
          </HStack>
        </VStack>
      );
    }

    return cancelButtonNode;
  };

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>(
              accountInformation && reKeyType === 'undo'
                ? 'headings.undoReKey'
                : 'headings.reKeyAccount'
            )}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={0}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReKeyAccountModal;
