import { SkeletonText, Text, useDisclosure, VStack } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEyeOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import Button from '@extension/components/Button';
import CopyButton from '@extension/components/CopyButton';
import PageHeader from '@extension/components/PageHeader';
import SeedPhraseDisplay, {
  createMaskedSeedPhrase,
} from '@extension/components/SeedPhraseDisplay';

// constants
import {
  ACCOUNT_SELECT_ITEM_MINIMUM_HEIGHT,
  DEFAULT_GAP,
} from '@extension/constants';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { BaseExtensionError, DecryptionError } from '@extension/errors';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// modals
import AuthenticationModal, {
  TOnConfirmResult,
} from '@extension/modals/AuthenticationModal';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// selectors
import {
  useSelectActiveAccount,
  useSelectLogger,
  useSelectNonWatchAccounts,
} from '@extension/selectors';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
} from '@extension/types';
import type { ISeedPhraseInput } from './types';

// utils
import convertPrivateKeyToSeedPhrase from '@extension/utils/convertPrivateKeyToSeedPhrase';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import fetchDecryptedKeyPairFromStorageWithPasskey from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPasskey';
import fetchDecryptedKeyPairFromStorageWithPassword from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPassword';

const ViewSeedPhrasePage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectNonWatchAccounts();
  const activeAccount = useSelectActiveAccount();
  const logger = useSelectLogger();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  // state
  const [decrypting, setDecrypting] = useState<boolean>(false);
  const [seedPhrase, setSeedPhrase] = useState<ISeedPhraseInput>({
    masked: true,
    value: createMaskedSeedPhrase(),
  });
  const [selectedAccount, setSelectedAccount] =
    useState<IAccountWithExtendedProps | null>(null);
  // handlers
  const handleAccountSelect = (account: IAccountWithExtendedProps) =>
    setSelectedAccount(account);
  const handleOnAuthenticationModalConfirm = async (
    result: TOnConfirmResult
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    let keyPair: Ed21559KeyPair | null = null;

    if (!selectedAccount) {
      logger?.debug(
        `${ViewSeedPhrasePage.name}#${_functionName}: no account selected`
      );

      return;
    }

    setDecrypting(true);

    // get the private key
    try {
      if (result.type === EncryptionMethodEnum.Passkey) {
        keyPair = await fetchDecryptedKeyPairFromStorageWithPasskey({
          inputKeyMaterial: result.inputKeyMaterial,
          logger,
          publicKey: selectedAccount.publicKey,
        });
      }

      if (result.type === EncryptionMethodEnum.Password) {
        keyPair = await fetchDecryptedKeyPairFromStorageWithPassword({
          logger,
          password: result.password,
          publicKey: selectedAccount.publicKey,
        });
      }

      if (!keyPair) {
        throw new DecryptionError(
          `failed to get private key for account "${convertPublicKeyToAVMAddress(
            selectedAccount.publicKey
          )}"`
        );
      }

      // convert the private key to the seed phrase
      setSeedPhrase({
        masked: false,
        value: convertPrivateKeyToSeedPhrase({
          logger,
          privateKey: keyPair.privateKey,
        }),
      });
    } catch (error) {
      logger?.error(`${ViewSeedPhrasePage.name}#${_functionName}:`, error);

      // reset the seed phrase
      setSeedPhrase({
        masked: true,
        value: createMaskedSeedPhrase(),
      });

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
    }

    setDecrypting(false);
  };
  const handleOnAuthenticationError = (error: BaseExtensionError) =>
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
  const handleViewClick = () => onAuthenticationModalOpen();

  useEffect(() => {
    let _selectedAccount: IAccountWithExtendedProps;

    if (activeAccount && !selectedAccount) {
      _selectedAccount = activeAccount;

      // if the active account is a watch account, get the first non-watch account
      if (_selectedAccount.watchAccount) {
        _selectedAccount = accounts[0];
      }

      setSelectedAccount(_selectedAccount);
    }
  }, [activeAccount]);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onCancel={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnAuthenticationError}
      />

      {/*page title*/}
      <PageHeader
        title={t<string>('titles.page', { context: 'viewSeedPhrase' })}
      />

      <VStack
        flexGrow={1}
        pb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        <VStack flexGrow={1} spacing={DEFAULT_GAP} w="full">
          {/*captions*/}
          <Text
            color={defaultTextColor}
            fontSize="sm"
            textAlign="left"
            w="full"
          >
            {t<string>('captions.viewSeedPhrase1')}
          </Text>

          {/*account select*/}
          {!selectedAccount ? (
            <SkeletonText
              height={`${ACCOUNT_SELECT_ITEM_MINIMUM_HEIGHT}px`}
              noOfLines={1}
              w="full"
            />
          ) : (
            <AccountSelect
              accounts={accounts}
              onSelect={handleAccountSelect}
              value={selectedAccount}
            />
          )}

          <Text
            color={defaultTextColor}
            fontSize="sm"
            textAlign="left"
            w="full"
          >
            {t<string>('captions.viewSeedPhrase2')}
          </Text>

          {/*seed phrase*/}
          <SeedPhraseDisplay seedPhrase={seedPhrase.value} />
        </VStack>

        {!seedPhrase.masked ? (
          // copy seed phrase button
          <CopyButton
            colorScheme={primaryColorScheme}
            size="lg"
            value={seedPhrase.value}
            variant="solid"
            w="full"
          >
            {t<string>('buttons.copy')}
          </CopyButton>
        ) : (
          // view button
          <Button
            isLoading={decrypting}
            onClick={handleViewClick}
            rightIcon={<IoEyeOutline />}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.view')}
          </Button>
        )}
      </VStack>
    </>
  );
};

export default ViewSeedPhrasePage;
