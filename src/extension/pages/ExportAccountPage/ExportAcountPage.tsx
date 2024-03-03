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
import { decode as decodeHex } from '@stablelib/hex';
import { sanitize } from 'dompurify';
import { toString } from 'qrcode';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoEyeOffOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

// components
import AccountSelect from '@extension/components/AccountSelect';
import ConfirmPasswordModal from '@extension/modals/ConfirmPasswordModal';
import CopyButton from '@extension/components/CopyButton';
import EmptyState from '@extension/components/EmptyState';
import PageHeader from '@extension/components/PageHeader';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// errors
import { DecryptionError } from '@extension/errors';

// features
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// images
import qrCodePlaceholderImage from '@extension/images/placeholder_qr_code.png';

// selectors
import {
  useSelectAccounts,
  useSelectActiveAccount,
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectSettings,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { ILogger } from '@common/types';
import type { IAccount, IAppThunkDispatch, ISettings } from '@extension/types';

// utils
import createAccountImportURI from '@extension/utils/createAccountImportURI';

const ExportAccountPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const {
    isOpen: isPasswordConfirmModalOpen,
    onClose: onPasswordConfirmModalClose,
    onOpen: onPasswordConfirmModalOpen,
  } = useDisclosure();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const activeAccount: IAccount | null = useSelectActiveAccount();
  const logger: ILogger = useSelectLogger();
  const passwordLockPassword: string | null = useSelectPasswordLockPassword();
  const settings: ISettings = useSelectSettings();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  // states
  const [password, setPassword] = useState<string | null>(null);
  const [selectedAccount, setSelectAccount] = useState<IAccount | null>(
    activeAccount
  );
  const [svgString, setSvgString] = useState<string | null>(null);
  const [uri, setURI] = useState<string | null>(null);
  // misc
  const qrCodeSize: number = 300;
  const createQRCode = async () => {
    const _functionName: string = 'createQRCode';
    const privateService: PrivateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
    let privateKey: Uint8Array | null;
    let _svgString: string;
    let _uri: string;

    if (!selectedAccount) {
      logger.debug(
        `${ExportAccountPage.name}#${_functionName}: no account selected`
      );

      return;
    }

    if (!password) {
      logger.debug(
        `${ExportAccountPage.name}#${_functionName}: no password found`
      );

      return;
    }

    try {
      privateKey = await privateService.getDecryptedPrivateKey(
        decodeHex(selectedAccount.publicKey),
        password
      );

      if (!privateKey) {
        throw new DecryptionError(
          `failed to get private key for account "${AccountService.convertPublicKeyToAlgorandAddress(
            selectedAccount.publicKey
          )}"`
        );
      }

      _uri = createAccountImportURI({
        assets: [],
        privateKey,
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
  const handleOnAccountSelect = (account: IAccount) =>
    setSelectAccount(account);
  const handleOnConfirmModalConfirm = (_password: string) => {
    onPasswordConfirmModalClose();
    setPassword(_password);
  };
  const handleViewClick = () => {
    if (settings.security.enablePasswordLock && passwordLockPassword) {
      setPassword(passwordLockPassword);

      return;
    }

    // get password
    onPasswordConfirmModalOpen();
  };

  useEffect(() => {
    if (password && selectedAccount) {
      (async () => await createQRCode())();
    }
  }, [selectedAccount, password]);

  return (
    <>
      <ConfirmPasswordModal
        isOpen={isPasswordConfirmModalOpen}
        onCancel={onPasswordConfirmModalClose}
        onConfirm={handleOnConfirmModalConfirm}
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
