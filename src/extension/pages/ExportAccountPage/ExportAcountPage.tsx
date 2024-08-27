import {
  Box,
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
import { IoEyeOffOutline, IoListOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import PageHeader from '@extension/components/PageHeader';

// constants
import {
  DEFAULT_GAP,
  EXPORT_ACCOUNT_PAGE_LIMIT,
  EXPORT_ACCOUNT_QR_CODE_DURATION,
} from '@extension/constants';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { BaseExtensionError, DecryptionError } from '@extension/errors';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// images
import qrCodePlaceholderImage from '@extension/images/placeholder_qr_code.png';

// modals
import { AccountSelectModal } from '@extension/components/AccountSelect';
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// selectors
import { useSelectAccounts, useSelectLogger } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IMainRootState,
  TEncryptionCredentials,
} from '@extension/types';
import type { IExportAccount } from '@extension/utils/createAccountImportURI';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import createAccountImportURI from '@extension/utils/createAccountImportURI';
import fetchDecryptedKeyPairFromStorageWithPassword from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPassword';
import fetchDecryptedKeyPairFromStorageWithPasskey from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPasskey';
import fetchDecryptedKeyPairFromStorageWithUnencrypted from '@extension/utils/fetchDecryptedKeyPairFromStorageWithUnencrypted';

const ExportAccountPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isAccountSelectModalOpen,
    onClose: onAccountSelectClose,
    onOpen: onAccountSelectModalOpen,
  } = useDisclosure();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  const logger = useSelectLogger();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // states
  const [pagination, setPagination] = useState<[number, number]>([1, 1]);
  const [selectedAccounts, setSelectedAccounts] = useState<
    IAccountWithExtendedProps[] | null
  >(null);
  const [svgStrings, setSvgStrings] = useState<string[] | null>(null);
  // misc
  const _context = 'export-account-page';
  const placeholderIconSize = calculateIconSize('md');
  const qrCodeSize = 300;
  const reset = () => {
    setPagination([1, 1]);
    setSelectedAccounts(null);
    setSvgStrings(null);
  };
  // handlers
  const handleOnAccountSelect = (_accounts: IAccountWithExtendedProps[]) => {
    if (_accounts.length <= 0) {
      return;
    }

    setSelectedAccounts(_accounts);

    return onAuthenticationModalOpen();
  };
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    let _svgStrings: string[];
    let keyPair: Ed21559KeyPair | null = null;
    let uris: string[];

    if (!selectedAccounts) {
      logger.debug(
        `${ExportAccountPage.name}#${_functionName}: no accounts selected`
      );

      return;
    }

    try {
      uris = createAccountImportURI({
        accounts: await Promise.all(
          selectedAccounts.map<Promise<IExportAccount>>(
            async ({ name, publicKey }) => {
              switch (result.type) {
                case EncryptionMethodEnum.Passkey:
                  keyPair = await fetchDecryptedKeyPairFromStorageWithPasskey({
                    inputKeyMaterial: result.inputKeyMaterial,
                    logger,
                    publicKey,
                  });

                  break;
                case EncryptionMethodEnum.Password:
                  keyPair = await fetchDecryptedKeyPairFromStorageWithPassword({
                    logger,
                    password: result.password,
                    publicKey,
                  });

                  break;
                case EncryptionMethodEnum.Unencrypted:
                  keyPair =
                    await fetchDecryptedKeyPairFromStorageWithUnencrypted({
                      logger,
                      publicKey,
                    });

                  break;
                default:
                  keyPair = null;

                  break;
              }

              if (!keyPair) {
                throw new DecryptionError(
                  `failed to get private key for account "${convertPublicKeyToAVMAddress(
                    publicKey
                  )}"`
                );
              }

              return {
                privateKey: keyPair.privateKey,
                ...(name && {
                  name,
                }),
              };
            }
          )
        ),
      });
      _svgStrings = await Promise.all(
        uris.map(
          async (value) =>
            await toString(value, {
              type: 'svg',
              width: qrCodeSize,
            })
        )
      );

      setSvgStrings(_svgStrings);
      setPagination([
        1,
        Math.ceil(selectedAccounts.length / EXPORT_ACCOUNT_PAGE_LIMIT),
      ]); // set the pagination
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

      reset();
    }
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
  const handleSelectAccountsClick = () => onAccountSelectModalOpen();

  useEffect(() => {
    const intervalId: number = window.setInterval(() => {
      setPagination(([current, total]) => {
        // if the current page is at the total, start again
        if (current >= total) {
          return [1, total];
        }

        return [current + 1, total];
      });
    }, EXPORT_ACCOUNT_QR_CODE_DURATION);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
      />

      {/*account select modal*/}
      <AccountSelectModal
        _context={_context}
        accounts={accounts}
        allowWatchAccounts={false}
        isOpen={isAccountSelectModalOpen}
        multiple={true}
        onClose={onAccountSelectClose}
        onSelect={handleOnAccountSelect}
      />

      <PageHeader
        title={t<string>('titles.page', { context: 'exportAccount' })}
      />

      <VStack
        flexGrow={1}
        pb={DEFAULT_GAP}
        px={DEFAULT_GAP}
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        <VStack flexGrow={1} spacing={DEFAULT_GAP} w="full">
          {accounts.length <= 0 ? (
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
                textAlign="center"
                w="full"
              >
                {t<string>('captions.exportAccount')}
              </Text>

              {/*qr code*/}
              {!svgStrings ? (
                <Box
                  blur="8px"
                  borderRadius={theme.radii['md']}
                  filter="auto"
                  h={`${qrCodeSize}px`}
                  sx={{
                    alignItems: 'center',
                    background: `url(${qrCodePlaceholderImage}) center/cover no-repeat`,
                    boxSize: `${qrCodeSize}px`,
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    zIndex: 1,
                  }}
                  w={`${qrCodeSize}px`}
                >
                  <Icon
                    as={IoEyeOffOutline}
                    color="gray.600"
                    h={placeholderIconSize}
                    w={placeholderIconSize}
                  />
                </Box>
              ) : (
                <>
                  <Box
                    borderRadius={theme.radii['md']}
                    dangerouslySetInnerHTML={{
                      __html: sanitize(svgStrings[pagination[0] - 1], {
                        USE_PROFILES: { svg: true, svgFilters: true },
                      }),
                    }}
                  />

                  <Text
                    color={subTextColor}
                    fontSize="sm"
                    textAlign="center"
                    w="full"
                  >
                    {t<string>('captions.displayingCountOfTotal', {
                      count: pagination[0],
                      total: pagination[1],
                    })}
                  </Text>
                </>
              )}
            </>
          )}
        </VStack>

        {/*select accounts button*/}
        <Button
          onClick={handleSelectAccountsClick}
          rightIcon={<IoListOutline />}
          size="lg"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.selectAccounts')}
        </Button>
      </VStack>
    </>
  );
};

export default ExportAccountPage;
