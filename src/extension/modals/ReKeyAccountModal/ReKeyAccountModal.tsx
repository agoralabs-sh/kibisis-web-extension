import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
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

// modals
import AuthenticationModal, {
  TOnConfirmResult,
} from '@extension/modals/AuthenticationModal';

// selectors
import { useSelectAccounts, useSelectLogger } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppThunkDispatch, IModalProps } from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

const ReKeyAccountModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  const logger = useSelectLogger();
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
    account,
    accountInformation,
    confirming,
    network,
    type: reKeyType,
  } = useReKeyAccountModal();
  // misc
  const isOpen = !!account && !!accountInformation;
  const reKeyAccount = async (result: TOnConfirmResult) => {
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

    try {
      transactionId = await dispatch(
        reKeyAccountThunk({
          authorizedAddress: authAddress,
          reKeyAccount: account,
          network: network,
          ...result,
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
  const undoReKeyAccount = async (result: TOnConfirmResult) => {
    let transactionId: string | null;

    if (!account || !accountInformation || !network) {
      return;
    }

    try {
      transactionId = await dispatch(
        undoReKeyAccountThunk({
          reKeyAccount: account,
          network: network,
          ...result,
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
  // handlers
  const handleError = (error: BaseExtensionError) => {
    switch (error.code) {
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
    resetAuthAddress();
    onClose && onClose();
  };
  const handleOnAuthenticationModalConfirm = async (
    result: TOnConfirmResult
  ) => {
    if (reKeyType === 'rekey') {
      return await reKeyAccount(result);
    }

    if (reKeyType === 'undo') {
      return await undoReKeyAccount(result);
    }
  };
  const handleReKeyOrUndoClick = () => onAuthenticationModalOpen();
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
              reKeyAddress={convertPublicKeyToAVMAddress(account.publicKey)}
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
                convertPublicKeyToAVMAddress(account.publicKey)
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
        <HStack spacing={DEFAULT_GAP - 2} w="full">
          {cancelButtonNode}

          <Button
            onClick={handleReKeyOrUndoClick}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>(reKeyType === 'undo' ? 'buttons.undo' : 'buttons.reKey')}
          </Button>
        </HStack>
      );
    }

    return cancelButtonNode;
  };

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onCancel={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleError}
        passwordHint={t<string>(
          reKeyType === 'undo'
            ? 'captions.mustEnterPasswordToAuthorizeUndoReKey'
            : 'captions.mustEnterPasswordToAuthorizeReKey'
        )}
      />

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
    </>
  );
};

export default ReKeyAccountModal;
