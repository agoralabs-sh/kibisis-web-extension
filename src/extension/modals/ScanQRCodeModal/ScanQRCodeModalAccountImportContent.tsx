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
import BigNumber from 'bignumber.js';
import React, {
  FC,
  KeyboardEvent,
  MutableRefObject,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { Location, useLocation } from 'react-router-dom';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetDisplay from '@extension/components/AssetDisplay';
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
  ARC0300QueryEnum,
  AssetTypeEnum,
  ErrorCodeEnum,
} from '@extension/enums';

// features
import {
  addARC0200AssetHoldingsThunk,
  saveActiveAccountDetails,
  saveNewAccountThunk,
} from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useAccountInformationAndAssetHoldings from './hooks/useAccountInformationAndAssetHoldings';
import useUpdateARC0200Assets from './hooks/useUpdateARC0200Assets';
import useUpdateStandardAssets from './hooks/useUpdateStandardAssets';

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

// theme
import { theme } from '@extension/theme';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IActiveAccountDetails,
  IAppThunkDispatch,
  IARC0200Asset,
  IARC0300AccountImportSchema,
  INetwork,
  ISettings,
  IStandardAsset,
} from '@extension/types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import convertPrivateKeyToAddress from '@extension/utils/convertPrivateKeyToAddress';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import decodePrivateKeyFromAccountImportSchema from '@extension/utils/decodePrivateKeyFromImportKeySchema';
import ellipseAddress from '@extension/utils/ellipseAddress';

interface IProps {
  onComplete: () => void;
  onPreviousClick: () => void;
  schema: IARC0300AccountImportSchema;
}

const ScanQRCodeModalAccountImportContent: FC<IProps> = ({
  onComplete,
  onPreviousClick,
  schema,
}: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const location: Location = useLocation();
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
  const {
    accountInformation,
    loading: loadingAccountInformation,
    updateAccountInformationAndAssetHoldingsAction,
  } = useAccountInformationAndAssetHoldings();
  const defaultTextColor: string = useDefaultTextColor();
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
  const {
    assets: arc0200Assets,
    loading: loadingARC0200Assets,
    reset: resetUpdateARC0200Assets,
  } = useUpdateARC0200Assets({
    assetIDs: schema.query[ARC0300QueryEnum.Asset],
    network,
  });
  const {
    assets: standardAssets,
    loading: loadingStandardAssets,
    reset: resetUpdateStandardAssets,
  } = useUpdateStandardAssets({
    assetIDs:
      accountInformation?.standardAssetHoldings.map(({ id }) => id) || [], // get the standard asset information once we know which asset holdings are present
    network,
  });
  // states
  const [address, setAddress] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  // misc
  const isLoading: boolean =
    loadingAccountInformation || loadingARC0200Assets || loadingStandardAssets;
  // handlers
  const handlePreviousClick = () => {
    reset();
    onPreviousClick();
  };
  const handleImportClick = async () => {
    const _functionName: string = 'handleImportClick';
    let _password: string | null;
    let account: IAccount | null;
    let privateKey: Uint8Array | null;

    // if there is no password lock
    if (!settings.security.enablePasswordLock && !passwordLockPassword) {
      // validate the password input
      if (validatePassword()) {
        logger.debug(
          `${ScanQRCodeModalAccountImportContent.name}#${_functionName}: password not valid`
        );

        return;
      }
    }

    _password = settings.security.enablePasswordLock
      ? passwordLockPassword
      : password;

    if (!_password) {
      logger.debug(
        `${ScanQRCodeModalAccountImportContent.name}#${_functionName}: unable to use password from password lock, value is "null"`
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
        `${ScanQRCodeModalAccountImportContent.name}#${_functionName}: failed to decode the private key`
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
      if (arc0200Assets.length > 0 && network) {
        account = await dispatch(
          addARC0200AssetHoldingsThunk({
            accountId: account.id,
            assets: arc0200Assets,
            genesisHash: network.genesisHash,
          })
        ).unwrap();
      }
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

          break;
        case ErrorCodeEnum.PrivateKeyAlreadyExistsError:
          logger.debug(
            `${ScanQRCodeModalAccountImportContent.name}#${_functionName}: account already exists, carry on`
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

      // if the page is on the account page, set the new active account
      if (location.pathname.includes(ACCOUNTS_ROUTE)) {
        dispatch(
          saveActiveAccountDetails({
            accountId: account.id,
            tabIndex: activeAccountDetails?.tabIndex || 0,
          })
        );
      }
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
    resetUpdateARC0200Assets();
    resetUpdateStandardAssets();
    setSaving(false);
  };

  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);
  // 1. decode the private key to get the address
  useEffect(() => {
    const privateKey: Uint8Array | null =
      decodePrivateKeyFromAccountImportSchema(schema);

    if (privateKey) {
      setAddress(convertPrivateKeyToAddress(privateKey));
    }
  }, []);
  // 2. when we get the address, get the account information
  useEffect(() => {
    if (
      !loadingAccountInformation &&
      !accountInformation &&
      address &&
      network
    ) {
      (async () =>
        await updateAccountInformationAndAssetHoldingsAction({
          address,
          arc0200Assets: arc0200Assets,
          network,
        }))();
    }
  }, [address, arc0200Assets]);
  const renderAssets = () => {
    if (isLoading) {
      return (
        <VStack spacing={DEFAULT_GAP / 3} w="full">
          <ModalSkeletonItem />
          <ModalSkeletonItem />
          <ModalSkeletonItem />
        </VStack>
      );
    }

    if (
      accountInformation &&
      (accountInformation.arc200AssetHoldings.length > 0 ||
        accountInformation.standardAssetHoldings.length > 0)
    ) {
      return (
        <VStack spacing={DEFAULT_GAP / 3} w="full">
          <ModalSubHeading text={t<string>('headings.assets')} />

          {[
            ...accountInformation.arc200AssetHoldings,
            ...accountInformation.standardAssetHoldings,
          ].reduce<ReactElement[]>((acc, assetHolding, index) => {
            let asset: IStandardAsset | IARC0200Asset | null;
            let symbol: string | null;

            switch (assetHolding.type) {
              case AssetTypeEnum.ARC0200:
                asset =
                  arc0200Assets.find(({ id }) => id === assetHolding.id) ||
                  null;
                symbol = asset?.symbol || null;
                break;
              case AssetTypeEnum.Standard:
                asset =
                  standardAssets.find(({ id }) => id === assetHolding.id) ||
                  null;
                symbol = asset?.unitName || null;
                break;
              default:
                asset = null;
                symbol = null;
                break;
            }

            if (asset) {
              return [
                ...acc,
                <ModalItem
                  key={`account-import-asset-${index}`}
                  label={`${asset.name || asset.id}:`}
                  value={
                    <HStack spacing={DEFAULT_GAP / 3}>
                      {/*balance*/}
                      <Text color={subTextColor} fontSize="xs">
                        {formatCurrencyUnit(
                          convertToStandardUnit(
                            new BigNumber(assetHolding.amount),
                            asset.decimals
                          ),
                          {
                            decimals: asset.decimals,
                          }
                        )}
                      </Text>

                      {/*icon*/}
                      <AssetAvatar
                        asset={asset}
                        fallbackIcon={
                          <AssetIcon
                            color={primaryButtonTextColor}
                            h={4}
                            w={4}
                            {...(network && {
                              networkTheme: network.chakraTheme,
                            })}
                          />
                        }
                        size="xs"
                      />

                      {/*symbol*/}
                      {symbol && (
                        <Text color={subTextColor} fontSize="xs">
                          {symbol}
                        </Text>
                      )}

                      {/*type*/}
                      <AssetBadge size="xs" type={asset.type} />
                    </HStack>
                  }
                />,
              ];
            }

            return acc;
          }, [])}
        </VStack>
      );
    }

    return null;
  };

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
            <ModalSubHeading text={t<string>('headings.accountInformation')} />

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

            {loadingAccountInformation || !accountInformation ? (
              <>
                <ModalSkeletonItem />
              </>
            ) : (
              <>
                {/*balance*/}
                {network && (
                  <ModalItem
                    label={t<string>('labels.balance')}
                    value={
                      <AssetDisplay
                        atomicUnitAmount={
                          new BigNumber(accountInformation.atomicBalance)
                        }
                        amountColor={subTextColor}
                        decimals={network.nativeCurrency.decimals}
                        fontSize="sm"
                        icon={createIconFromDataUri(
                          network.nativeCurrency.iconUrl,
                          {
                            color: subTextColor,
                            h: 3,
                            w: 3,
                          }
                        )}
                        unit={network.nativeCurrency.symbol}
                      />
                    }
                  />
                )}
              </>
            )}
          </VStack>

          {/*assets*/}
          {renderAssets()}
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>
        <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
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
              isLoading={isLoading || saving}
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

export default ScanQRCodeModalAccountImportContent;
