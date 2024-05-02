import {
  Heading,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, {
  FC,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';
import Button from '@extension/components/Button';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import ModalSubHeading from '@extension/components/ModalSubHeading';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';

// constants
import {
  ACCOUNTS_ROUTE,
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
} from '@extension/constants';

// enums
import {
  AccountTabEnum,
  ARC0300QueryEnum,
  ErrorCodeEnum,
} from '@extension/enums';

// features
import {
  addARC0200AssetHoldingsThunk,
  IUpdateAssetHoldingsResult,
  saveActiveAccountDetails,
  saveNewAccountThunk,
} from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useUpdateARC0200Assets from '@extension/hooks/useUpdateARC0200Assets';

// selectors
import {
  useSelectActiveAccountDetails,
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectSelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';
import ActionTrackingService from '@extension/services/ActionTrackingService';

// theme
import { theme } from '@extension/theme';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IARC0300AccountImportSchema,
  IActiveAccountDetails,
  IAppThunkDispatch,
  INetwork,
  ISettings,
} from '@extension/types';
import type { IModalContentProps } from './types';

// utils
import convertPrivateKeyToAddress from '@extension/utils/convertPrivateKeyToAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';
import decodePrivateKeyFromAccountImportSchema from '@extension/utils/decodePrivateKeyFromImportKeySchema';

const AccountImportModalContent: FC<
  IModalContentProps<IARC0300AccountImportSchema>
> = ({ onComplete, onPreviousClick, schema }) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const passwordInputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  // selectors
  const activeAccountDetails: IActiveAccountDetails | null =
    useSelectActiveAccountDetails();
  const logger: ILogger = useSelectLogger();
  const network: INetwork | null = useSelectSelectedNetwork();
  const passwordLockPassword: string | null = useSelectPasswordLockPassword();
  const settings: ISettings = useSelectSettings();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const {
    assets,
    loading,
    reset: resetUpdateAssets,
  } = useUpdateARC0200Assets(schema.query[ARC0300QueryEnum.Asset]);
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // states
  const [address, setAddress] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  // handlers
  const handlePreviousClick = () => {
    reset();
    onPreviousClick();
  };
  const handleImportClick = async () => {
    const _functionName: string = 'handleImportClick';
    let _password: string | null;
    let account: IAccount | null;
    let actionTrackingService: ActionTrackingService;
    let privateKey: Uint8Array | null;
    let result: IUpdateAssetHoldingsResult;

    // if there is no password lock
    if (!settings.security.enablePasswordLock && !passwordLockPassword) {
      // validate the password input
      if (validatePassword()) {
        logger.debug(
          `${AccountImportModalContent.name}#${_functionName}: password not valid`
        );

        return;
      }
    }

    _password = settings.security.enablePasswordLock
      ? passwordLockPassword
      : password;

    if (!_password) {
      logger.debug(
        `${AccountImportModalContent.name}#${_functionName}: unable to use password from password lock, value is "null"`
      );

      dispatch(
        createNotification({
          description: t<string>('errors.descriptions.code', {
            context: ErrorCodeEnum.ParsingError,
            type: 'password',
          }),
          ephemeral: true,
          title: t<string>('errors.titles.code', {
            context: ErrorCodeEnum.ParsingError,
          }),
          type: 'error',
        })
      );

      return;
    }

    privateKey = decodePrivateKeyFromAccountImportSchema(schema);

    if (!privateKey) {
      logger.debug(
        `${AccountImportModalContent.name}#${_functionName}: failed to decode the private key`
      );

      dispatch(
        createNotification({
          description: t<string>('errors.descriptions.code', {
            context: ErrorCodeEnum.ParsingError,
            type: 'key',
          }),
          ephemeral: true,
          title: t<string>('errors.titles.code', {
            context: ErrorCodeEnum.ParsingError,
          }),
          type: 'error',
        })
      );

      return;
    }

    setSaving(true);

    try {
      account = await dispatch(
        saveNewAccountThunk({
          name: null,
          password: _password,
          privateKey,
        })
      ).unwrap();

      // if there are assets, add them to the new account
      if (assets.length > 0 && network) {
        result = await dispatch(
          addARC0200AssetHoldingsThunk({
            accountId: account.id,
            assets,
            genesisHash: network.genesisHash,
          })
        ).unwrap();

        account = result.account;
      }
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

          break;
        case ErrorCodeEnum.PrivateKeyAlreadyExistsError:
          logger.debug(
            `${AccountImportModalContent.name}#${_functionName}: account already exists, carry on`
          );

          // clean up and close
          handleOnComplete();

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

      setSaving(false);

      return;
    }

    if (account) {
      dispatch(
        createNotification({
          ephemeral: true,
          description: t<string>('captions.addedAccount', {
            address: ellipseAddress(
              AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              )
            ),
          }),
          title: t<string>('headings.addedAccount'),
          type: 'success',
        })
      );

      actionTrackingService = new ActionTrackingService({
        logger,
      });

      // track the action
      await actionTrackingService.importAccountViaQRCodeAction(
        AccountService.convertPublicKeyToAlgorandAddress(account.publicKey)
      );

      // go to the account and the assets tab
      dispatch(
        saveActiveAccountDetails({
          accountId: account.id,
          tabIndex: activeAccountDetails?.tabIndex || AccountTabEnum.Assets,
        })
      );
      navigate(ACCOUNTS_ROUTE);
    }

    // clean up and close
    handleOnComplete();
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleImportClick();
    }
  };
  const handleOnComplete = () => {
    reset();
    onComplete();
  };
  const reset = () => {
    resetPassword();
    resetUpdateAssets();
    setSaving(false);
  };

  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    const privateKey: Uint8Array | null =
      decodePrivateKeyFromAccountImportSchema(schema);

    if (privateKey) {
      setAddress(convertPrivateKeyToAddress(privateKey));
    }
  }, []);

  return (
    <ModalContent
      backgroundColor={BODY_BACKGROUND_COLOR}
      borderTopRadius={theme.radii['3xl']}
      borderBottomRadius={0}
    >
      {/*header*/}
      <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {t<string>('headings.importAccount')}
        </Heading>
      </ModalHeader>

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.importAccount')}
          </Text>

          <VStack spacing={2} w="full">
            <ModalSubHeading text={t<string>('labels.account')} />

            {/*address*/}
            {!address ? (
              <ModalSkeletonItem />
            ) : (
              <ModalTextItem
                label={`${t<string>('labels.address')}:`}
                tooltipLabel={address}
                value={ellipseAddress(address, {
                  end: 10,
                  start: 10,
                })}
              />
            )}
          </VStack>

          {/*assets*/}
          {loading && (
            <VStack spacing={2} w="full">
              <ModalSkeletonItem />
              <ModalSkeletonItem />
              <ModalSkeletonItem />
            </VStack>
          )}
          {assets.length > 0 && !loading && (
            <VStack spacing={2} w="full">
              <ModalSubHeading text={t<string>('labels.assets')} />

              {assets.map((value, index) => (
                <ModalItem
                  key={`account-import-add-asset-${index}`}
                  label={`${value.name}:`}
                  value={
                    <HStack spacing={2}>
                      {/*icon*/}
                      <AssetAvatar
                        asset={value}
                        fallbackIcon={
                          <AssetIcon
                            color={primaryButtonTextColor}
                            h={3}
                            w={3}
                            {...(network && {
                              networkTheme: network.chakraTheme,
                            })}
                          />
                        }
                        size="xs"
                      />

                      {/*symbol*/}
                      <Text color={subTextColor} fontSize="xs">
                        {value.symbol}
                      </Text>

                      {/*type*/}
                      <AssetBadge size="xs" type={value.type} />
                    </HStack>
                  }
                />
              ))}
            </VStack>
          )}
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>
        <VStack alignItems="flex-start" spacing={4} w="full">
          {!settings.security.enablePasswordLock && !passwordLockPassword && (
            <PasswordInput
              error={passwordError}
              hint={t<string>('captions.mustEnterPasswordToImportAccount')}
              onChange={onPasswordChange}
              onKeyUp={handleKeyUpPasswordInput}
              inputRef={passwordInputRef}
              value={password}
            />
          )}

          <HStack spacing={4} w="full">
            {/*previous button*/}
            <Button
              leftIcon={<IoArrowBackOutline />}
              onClick={handlePreviousClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.previous')}
            </Button>

            {/*import button*/}
            <Button
              isLoading={loading || saving}
              onClick={handleImportClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.import')}
            </Button>
          </HStack>
        </VStack>
      </ModalFooter>
    </ModalContent>
  );
};

export default AccountImportModalContent;
