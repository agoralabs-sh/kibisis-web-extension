import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowUndoOutline, IoLockClosedOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AddressInput from '@extension/components/AddressInput';
import Button from '@extension/components/Button';
import InfoIconTooltip from '@extension/components/InfoIconTooltip';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ReKeyAccountConfirmingModalContent from './ReKeyAccountConfirmingModalContent';
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
import useAddressInput from '@extension/hooks/useAddressInput';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useReKeyAccountModal from './hooks/useReKeyAccountModal';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import { useSelectAccounts } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  IModalProps,
  TEncryptionCredentials,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';

const ReKeyAccountModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  // hooks
  const {
    error: reKeyToAddressError,
    label: reKeyToAddressLabel,
    onBlur: reKeyToAddressOnBlur,
    onChange: reKeyToAddressOnChange,
    onSelect: reKeyToAddressOnSelect,
    required: isReKeyToAddressRequired,
    reset: resetReKeyToAddress,
    value: reKeyToAddressValue,
    validate: validateReKeyToAddress,
  } = useAddressInput({
    label: t<string>('labels.reKeyTo'),
    required: true,
  });
  const defaultTextColor = useDefaultTextColor();
  const {
    account,
    accountInformation,
    confirming,
    network,
    type: reKeyType,
  } = useReKeyAccountModal();
  const subTextColor = useSubTextColor();
  // misc
  const _context = 're-key-account-modal';
  const isOpen = !!account && !!accountInformation;
  const reKeyAccount = async (result: TEncryptionCredentials) => {
    let transactionId: string | null;

    if (
      !account ||
      !accountInformation ||
      !network ||
      !!reKeyToAddressError ||
      !!validateReKeyToAddress(reKeyToAddressValue)
    ) {
      return;
    }

    try {
      transactionId = await dispatch(
        reKeyAccountThunk({
          authorizedAddress: reKeyToAddressValue,
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
            accountIDs: [account.id],
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
  const undoReKeyAccount = async (result: TEncryptionCredentials) => {
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
            accountIDs: [account.id],
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
    resetReKeyToAddress();
    onClose && onClose();
  };
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
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
        if (confirming && reKeyToAddressValue.length > 0) {
          return (
            <ReKeyAccountConfirmingModalContent
              accounts={accounts}
              currentAddress={
                accountInformation.authAddress ||
                convertPublicKeyToAVMAddress(account.publicKey)
              }
              network={network}
              reKeyAddress={reKeyToAddressValue}
              reKeyType={reKeyType}
            />
          );
        }

        return (
          <VStack flexGrow={1} spacing={DEFAULT_GAP / 2} w="full">
            <VStack px={DEFAULT_GAP} spacing={DEFAULT_GAP / 2} w="full">
              {/*descriptions*/}
              <Text
                color={defaultTextColor}
                fontSize="sm"
                textAlign="left"
                w="full"
              >
                {t<string>('captions.reKeyAccount')}
              </Text>

              {/*account*/}
              <ModalItem
                flexGrow={1}
                label={`${t<string>('labels.account')}:`}
                value={
                  <AddressDisplay
                    accounts={accounts}
                    address={convertPublicKeyToAVMAddress(account.publicKey)}
                    ariaLabel="Re-keyed address"
                    size="sm"
                    network={network}
                  />
                }
              />

              {/*current auth account*/}
              {accountInformation.authAddress && (
                <ModalItem
                  flexGrow={1}
                  label={`${t<string>('labels.currentAuthorizedAccount')}:`}
                  value={
                    <AddressDisplay
                      accounts={accounts}
                      address={accountInformation.authAddress}
                      ariaLabel="Current auth address"
                      colorScheme="green"
                      size="sm"
                      network={network}
                    />
                  }
                />
              )}

              {/*fee*/}
              <HStack spacing={1} w="full">
                <ModalAssetItem
                  amountInAtomicUnits={new BigNumber(network.minFee)}
                  decimals={network.nativeCurrency.decimals}
                  icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
                    color: subTextColor,
                    h: 3,
                    w: 3,
                  })}
                  label={`${t<string>('labels.fee')}:`}
                />

                {/*info*/}
                <InfoIconTooltip
                  color={subTextColor}
                  label={t<string>('captions.reKeyFee')}
                />
              </HStack>

              {/*re-key to*/}
              <AddressInput
                _context={_context}
                accounts={accounts}
                allowWatchAccounts={true}
                error={reKeyToAddressError}
                label={reKeyToAddressLabel}
                onBlur={reKeyToAddressOnBlur}
                onChange={reKeyToAddressOnChange}
                onSelect={reKeyToAddressOnSelect}
                required={isReKeyToAddressRequired}
                validate={validateReKeyToAddress}
                value={reKeyToAddressValue}
              />
            </VStack>
          </VStack>
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
            rightIcon={
              reKeyType === 'undo' ? (
                <IoArrowUndoOutline />
              ) : (
                <IoLockClosedOutline />
              )
            }
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
        onClose={onAuthenticationModalClose}
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
