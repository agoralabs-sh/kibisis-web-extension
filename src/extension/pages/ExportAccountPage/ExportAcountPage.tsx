import {
  Box,
  Button,
  Code,
  Icon,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { sanitize } from 'dompurify';
import { toString } from 'qrcode';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEyeOffOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import CopyButton from '@extension/components/CopyButton';
import EmptyState from '@extension/components/EmptyState';
import PageHeader from '@extension/components/PageHeader';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { BaseExtensionError, DecryptionError } from '@extension/errors';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// images
import qrCodePlaceholderImage from '@extension/images/placeholder_qr_code.png';

// modals
import AuthenticationModal, {
  TOnConfirmResult,
} from '@extension/modals/AuthenticationModal';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// selectors
import {
  useSelectAccounts,
  useSelectActiveAccount,
  useSelectLogger,
} from '@extension/selectors';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
} from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import createAccountImportURI from '@extension/utils/createAccountImportURI';
import createWatchAccountImportURI from '@extension/utils/createWatchAccountImportURI';
import fetchDecryptedKeyPairFromStorageWithPassword from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPassword';
import fetchDecryptedKeyPairFromStorageWithPasskey from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPasskey';

const ExportAccountPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  const activeAccount = useSelectActiveAccount();
  const logger = useSelectLogger();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  // states
  const [selectedAccount, setSelectedAccount] =
    useState<IAccountWithExtendedProps | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [uri, setURI] = useState<string | null>(null);
  // misc
  const qrCodeSize = 300;
  const createQRCodeForWatchAccount = async () => {
    const _functionName = 'createQRCodeForWatchAccount';
    let _svgString: string;
    let _uri: string;

    if (!selectedAccount) {
      logger.debug(
        `${ExportAccountPage.name}#${_functionName}: no account selected`
      );

      return;
    }

    try {
      _uri = createWatchAccountImportURI({
        address: convertPublicKeyToAVMAddress(
          PrivateKeyService.decode(selectedAccount.publicKey)
        ),
        assets: [],
      });
      _svgString = await toString(_uri, {
        type: 'svg',
        width: qrCodeSize,
      });

      setSvgString(_svgString);
      setURI(_uri);
    } catch (error) {
      logger.error(`${ExportAccountPage.name}#${_functionName}:`, error);

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

      setSvgString(null);
      setURI(null);

      return;
    }
  };
  // handlers
  const handleOnAccountSelect = async (account: IAccountWithExtendedProps) => {
    setSvgString(null);
    setURI(null);
    setSelectedAccount(account);
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
  const handleOnAuthenticationModalConfirm = async (
    result: TOnConfirmResult
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    let _svgString: string;
    let _uri: string;
    let keyPair: Ed21559KeyPair | null = null;

    if (!selectedAccount) {
      logger.debug(
        `${ExportAccountPage.name}#${_functionName}: no account selected`
      );

      return;
    }

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
            PrivateKeyService.decode(selectedAccount.publicKey)
          )}"`
        );
      }

      _uri = createAccountImportURI({
        assets: [],
        privateKey: keyPair.privateKey,
      });
      _svgString = await toString(_uri, {
        type: 'svg',
        width: qrCodeSize,
      });

      setSvgString(_svgString);
      setURI(_uri);
    } catch (error) {
      logger.error(`${ExportAccountPage.name}#${_functionName}:`, error);

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

      setSvgString(null);
      setURI(null);
    }
  };
  const handleViewClick = () => onAuthenticationModalOpen();

  useEffect(() => {
    if (selectedAccount && selectedAccount.watchAccount) {
      (async () => await createQRCodeForWatchAccount())();
    }
  }, [selectedAccount]);
  useEffect(() => {
    if (activeAccount && !selectedAccount) {
      setSelectedAccount(activeAccount);
    }
  }, [activeAccount]);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnAuthenticationError}
      />

      <PageHeader
        title={t<string>('titles.page', { context: 'exportAccount' })}
      />

      <VStack
        flexGrow={1}
        pb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={2}
        w="full"
      >
        <VStack flexGrow={1} spacing={DEFAULT_GAP} w="full">
          {!selectedAccount ? (
            <>
              {/*empty state*/}
              <Spacer />

              <EmptyState text={t<string>('headings.noAccountsFound')} />

              <Spacer />
            </>
          ) : (
            <>
              <Text
                color={defaultTextColor}
                fontSize="sm"
                textAlign="left"
                w="full"
              >
                {t<string>('captions.exportAccount')}
              </Text>

              {/*account select*/}
              <AccountSelect
                accounts={accounts}
                onSelect={handleOnAccountSelect}
                value={selectedAccount}
              />

              {/*qr code*/}
              {!svgString ? (
                <Button
                  h={`${qrCodeSize}px`}
                  onClick={handleViewClick}
                  position="relative"
                  variant="unstyled"
                  w={`${qrCodeSize}px`}
                >
                  <Box
                    blur="8px"
                    filter="auto"
                    h="full"
                    sx={{
                      alignItems: 'center',
                      background: `url(${qrCodePlaceholderImage}) center/cover no-repeat`,
                      boxSize: 'full',
                      display: 'flex',
                      justifyContent: 'center',
                      textAlign: 'center',
                      zIndex: 1,
                    }}
                    w="full"
                  >
                    <Icon as={IoEyeOffOutline} color="gray.600" h={6} w={6} />
                  </Box>
                </Button>
              ) : (
                <Box
                  dangerouslySetInnerHTML={{
                    __html: sanitize(svgString, {
                      USE_PROFILES: { svg: true, svgFilters: true },
                    }),
                  }}
                />
              )}

              {/*uri*/}
              {uri && (
                <Code fontSize="sm" wordBreak="break-word">
                  {uri}
                </Code>
              )}
            </>
          )}
        </VStack>

        {/*copy button*/}
        {uri && (
          <CopyButton
            colorScheme={primaryColorScheme}
            size="md"
            value={uri}
            variant="solid"
            w="full"
          >
            {t<string>('buttons.copyURI')}
          </CopyButton>
        )}
      </VStack>
    </>
  );
};

export default ExportAccountPage;
