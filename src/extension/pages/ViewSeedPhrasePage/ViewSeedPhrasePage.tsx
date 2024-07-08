import { SkeletonText, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { decode as decodeHex } from '@stablelib/hex';
import { secretKeyToMnemonic } from 'algosdk';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEyeOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

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

// errors
import { DecryptionError } from '@extension/errors';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// modals
import ConfirmPasswordModal from '@extension/modals/ConfirmPasswordModal';

// selectors
import {
  useSelectActiveAccount,
  useSelectNonWatchAccounts,
  useSelectLogger,
} from '@extension/selectors';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import fetchDecryptedPrivateKeyWithPassword from '@extension/utils/fetchDecryptedPrivateKeyWithPassword';

const ViewSeedPhrasePage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  // selectors
  const accounts = useSelectNonWatchAccounts();
  const activeAccount = useSelectActiveAccount();
  const logger = useSelectLogger();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  // state
  const [password, setPassword] = useState<string | null>(null);
  const [seedPhrase, setSeedPhrase] = useState<string>(
    createMaskedSeedPhrase()
  );
  const [selectedAccount, setSelectedAccount] =
    useState<IAccountWithExtendedProps | null>(null);
  // misc
  const decryptSeedPhrase = async () => {
    const _functionName = 'decryptSeedPhrase';
    let privateKey: Uint8Array | null;

    if (!password || !selectedAccount) {
      logger?.debug(
        `${ViewSeedPhrasePage.name}#${_functionName}: no password or account found`
      );

      return;
    }

    // get the private key
    try {
      privateKey = await fetchDecryptedPrivateKeyWithPassword({
        logger,
        password,
        publicKey: selectedAccount.publicKey,
      });

      if (!privateKey) {
        throw new DecryptionError(
          `failed to get private key for account "${convertPublicKeyToAVMAddress(
            selectedAccount.publicKey
          )}"`
        );
      }

      // convert the secret key to the mnemonic
      setSeedPhrase(secretKeyToMnemonic(privateKey));
    } catch (error) {
      logger?.error(
        `${ViewSeedPhrasePage.name}#${_functionName}: ${error.message}`
      );

      // reset the seed phrase
      setSeedPhrase(createMaskedSeedPhrase());

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

      return;
    }
  };
  // handlers
  const handleAccountSelect = (account: IAccountWithExtendedProps) =>
    setSelectedAccount(account);
  const handleOnConfirmPasswordModalConfirm = async (password: string) => {
    // close the password modal
    onClose();

    setPassword(password);
  };
  const handleViewClick = () => onOpen();

  useEffect(() => {
    if (password) {
      (async () => await decryptSeedPhrase())();
    }
  }, [password, selectedAccount]);
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
      <ConfirmPasswordModal
        isOpen={isOpen}
        onCancel={onClose}
        onConfirm={handleOnConfirmPasswordModalConfirm}
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
          <SeedPhraseDisplay seedPhrase={seedPhrase} />
        </VStack>

        {password ? (
          // copy seed phrase button
          <CopyButton
            colorScheme={primaryColorScheme}
            size="lg"
            value={seedPhrase}
            variant="solid"
            w="full"
          >
            {t<string>('buttons.copy')}
          </CopyButton>
        ) : (
          // view button
          <Button
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
