import {
  HStack,
  SkeletonText,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import Button from '@extension/components/Button';
import CopyButton from '@extension/components/CopyButton';
import PageHeader from '@extension/components/PageHeader';
import SeedPhraseDisplay, {
  SeedPhraseDisplaySkeleton,
} from '@extension/components/SeedPhraseDisplay';

// constants
import {
  ACCOUNT_SELECT_ITEM_MINIMUM_HEIGHT,
  DEFAULT_GAP,
} from '@extension/constants';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useViewSeedPhrase from './hooks/useViewSeedPhrase';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectActiveAccount,
  useSelectNonWatchAccounts,
} from '@extension/selectors';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IMainRootState,
  TEncryptionCredentials,
} from '@extension/types';
import type { IAccountAndSeedPhraseValue } from './types';
import createMaskedSeedPhrase from '@extension/utils/createMaskedSeedPhrase';

const ViewSeedPhrasePage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectNonWatchAccounts();
  const activeAccount = useSelectActiveAccount();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const { decrypting, decryptSeedPhraseAction } = useViewSeedPhrase();
  // state
  const [credentials, setCredentials] = useState<TEncryptionCredentials | null>(
    null
  );
  const [value, setValue] = useState<IAccountAndSeedPhraseValue | null>(null);
  // misc
  const _context = 'view-seed-phrase--page';
  // handlers
  const handleAccountSelect = async (account: IAccountWithExtendedProps) => {
    setValue(
      await decryptSeedPhraseAction({
        account,
        credentials,
        onError: handleOnError,
      })
    );
  };
  const handleOnAuthenticationModalConfirm = async (
    _credentials: TEncryptionCredentials
  ) => {
    if (!value) {
      return;
    }

    setCredentials(_credentials);
    setValue(
      await decryptSeedPhraseAction({
        account: value.account,
        credentials: _credentials,
        onError: handleOnError,
      })
    );
  };
  const handleHideClick = () => {
    setCredentials(null);

    value &&
      setValue({
        ...value,
        masked: true,
        seedPhrase: createMaskedSeedPhrase(),
      });
  };
  const handleOnError = (error: BaseExtensionError) =>
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
  const handleViewClick = async () => {
    // if we have the credentials, attempt to decrypt them
    if (value && credentials) {
      setValue(
        await decryptSeedPhraseAction({
          account: value.account,
          credentials,
          onError: handleOnError,
        })
      );

      return;
    }

    // otherwise go get them
    onAuthenticationModalOpen();
  };

  useEffect(() => {
    (async () => {
      let account: IAccountWithExtendedProps;

      if (activeAccount && !value) {
        account = activeAccount;

        // if the active account is a watch account, get the first non-watch account
        if (account.watchAccount) {
          account = accounts[0];
        }

        setValue(
          await decryptSeedPhraseAction({
            account,
            credentials,
            onError: handleOnError,
          })
        );
      }
    })();
  }, [activeAccount]);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
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
          {!value ? (
            <SkeletonText
              height={`${ACCOUNT_SELECT_ITEM_MINIMUM_HEIGHT}px`}
              noOfLines={1}
              w="full"
            />
          ) : (
            <AccountSelect
              _context={_context}
              accounts={accounts}
              allowWatchAccounts={false}
              onSelect={handleAccountSelect}
              required={true}
              value={value.account}
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
          {!value ? (
            <SeedPhraseDisplaySkeleton />
          ) : (
            <SeedPhraseDisplay
              _context={_context}
              seedPhrase={value.seedPhrase}
            />
          )}
        </VStack>

        {!value || value.masked ? (
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
        ) : (
          <HStack justifyContent="center" spacing={DEFAULT_GAP / 3} w="full">
            {/*hide button*/}
            <Button
              isLoading={decrypting}
              onClick={handleHideClick}
              rightIcon={<IoEyeOffOutline />}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.hide')}
            </Button>

            {/*copy button*/}
            <CopyButton
              colorScheme={primaryColorScheme}
              size="lg"
              value={value.seedPhrase}
              variant="solid"
              w="full"
            >
              {t<string>('buttons.copy')}
            </CopyButton>
          </HStack>
          // copy seed phrase button
        )}
      </VStack>
    </>
  );
};

export default ViewSeedPhrasePage;
