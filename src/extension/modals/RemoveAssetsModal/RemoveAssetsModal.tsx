import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, KeyboardEvent, ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetBadge from '@extension/components/AssetBadge';
import Button from '@extension/components/Button';
import CopyIconButton from '@extension/components/CopyIconButton';
import InfoIconTooltip from '@extension/components/InfoIconTooltip';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import RemoveAssetsConfirmingModalContent from './RemoveAssetsConfirmingModalContent';

// constants
import {
  ACCOUNTS_ROUTE,
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
} from '@extension/constants';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';

// features
import {
  removeARC0200AssetHoldingsThunk,
  removeStandardAssetHoldingsThunk,
} from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';
import { setConfirming } from '@extension/features/remove-assets';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectRemoveAssetsAccount,
  useSelectRemoveAssetsConfirming,
  useSelectRemoveAssetsSelectedAsset,
  useSelectSelectedNetwork,
  useSelectSettings,
  useSelectSettingsPreferredBlockExplorer,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppThunkDispatch } from '@extension/types';
import type { IRemoveAssetsModalProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';

const RemoveAssetsModal: FC<IRemoveAssetsModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate = useNavigate();
  // selectors
  const account = useSelectRemoveAssetsAccount();
  const accounts = useSelectAccounts();
  const confirming = useSelectRemoveAssetsConfirming();
  const explorer = useSelectSettingsPreferredBlockExplorer();
  const logger = useSelectLogger();
  const passwordLockPassword = useSelectPasswordLockPassword();
  const selectedNetwork = useSelectSelectedNetwork();
  const selectedAsset = useSelectRemoveAssetsSelectedAsset();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const subTextColor = useSubTextColor();
  // misc
  const isOpen = !!account && !!selectedAsset;
  // handlers
  const handleRemoveARC0200AssetClick = async () => {
    if (
      !selectedNetwork ||
      !account ||
      !selectedAsset ||
      selectedAsset.type !== AssetTypeEnum.ARC0200
    ) {
      return;
    }

    dispatch(setConfirming(true));

    try {
      await dispatch(
        removeARC0200AssetHoldingsThunk({
          accountId: account.id,
          assets: [selectedAsset],
          genesisHash: selectedNetwork.genesisHash,
        })
      ).unwrap();

      dispatch(
        createNotification({
          title: t<string>('headings.hiddenAsset', {
            symbol: selectedAsset.symbol,
          }),
          type: 'success',
        })
      );

      // go to the accounts page
      navigate(ACCOUNTS_ROUTE, {
        replace: true,
      });

      handleClose();
    } catch (error) {
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

    dispatch(setConfirming(false));
  };
  const handleRemoveStandardAssetClick = async () => {
    const _functionName = 'handleAddStandardAssetClick';
    let _password: string | null;

    if (
      !selectedNetwork ||
      !account ||
      !selectedAsset ||
      selectedAsset.type !== AssetTypeEnum.Standard
    ) {
      return;
    }

    // if there is no password lock
    if (!settings.security.enablePasswordLock && !passwordLockPassword) {
      // validate the password input
      if (validatePassword()) {
        logger.debug(
          `${RemoveAssetsModal.name}#${_functionName}: password not valid`
        );

        return;
      }
    }

    _password = settings.security.enablePasswordLock
      ? passwordLockPassword
      : password;

    if (!_password) {
      logger.debug(
        `${RemoveAssetsModal.name}#${_functionName}: unable to use password from password lock, value is "null"`
      );

      return;
    }

    dispatch(setConfirming(true));

    try {
      await dispatch(
        removeStandardAssetHoldingsThunk({
          accountId: account.id,
          assets: [selectedAsset],
          genesisHash: selectedNetwork.genesisHash,
          password: _password,
        })
      ).unwrap();

      dispatch(
        createNotification({
          title: t<string>('headings.removedAsset', {
            symbol:
              selectedAsset.unitName || selectedAsset.name || selectedAsset.id,
          }),
          type: 'success',
        })
      );

      // go to the accounts page
      navigate(ACCOUNTS_ROUTE, {
        replace: true,
      });

      handleClose();
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

          break;
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
    }

    dispatch(setConfirming(false));
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    resetPassword();
    onClose();
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      if (selectedAsset?.type === AssetTypeEnum.ARC0200) {
        return await handleRemoveARC0200AssetClick();
      }

      if (selectedAsset?.type === AssetTypeEnum.Standard) {
        return await handleRemoveStandardAssetClick();
      }
    }
  };
  // renders
  const renderContent = () => {
    let address: string;
    let symbol: string | null = null;

    if (!account || !selectedNetwork || !selectedAsset) {
      return null;
    }

    if (confirming) {
      return <RemoveAssetsConfirmingModalContent asset={selectedAsset} />;
    }

    switch (selectedAsset.type) {
      case AssetTypeEnum.ARC0200:
        symbol = selectedAsset.symbol;
        break;
      case AssetTypeEnum.Standard:
        if (selectedAsset.unitName) {
          symbol = selectedAsset.unitName;
        }

        break;
      default:
        break;
    }

    address = convertPublicKeyToAVMAddress(account.publicKey);

    return (
      <VStack
        alignItems="flex-start"
        justifyContent="flex-start"
        px={DEFAULT_GAP}
        spacing={DEFAULT_GAP - 2}
        w="full"
      >
        <Text
          color={defaultTextColor}
          fontSize="sm"
          textAlign="center"
          w="full"
        >
          {t<string>('captions.removeAsset', {
            context: selectedAsset.type,
            symbol: symbol || 'asset',
          })}
        </Text>

        <VStack spacing={0} w="full">
          {/*account*/}
          <HStack spacing={1} w="full">
            <ModalItem
              flexGrow={1}
              label={`${t<string>('labels.account')}:`}
              value={
                <AddressDisplay
                  accounts={accounts}
                  address={address}
                  ariaLabel="From address"
                  size="sm"
                  network={selectedNetwork}
                />
              }
            />

            {/*copy address*/}
            <CopyIconButton
              ariaLabel={t<string>('labels.copyAddress')}
              tooltipLabel={t<string>('labels.copyAddress')}
              value={address}
            />

            {/*open account on explorer*/}
            {explorer && (
              <OpenTabIconButton
                tooltipLabel={t<string>('captions.openOn', {
                  name: explorer.canonicalName,
                })}
                url={`${explorer.baseUrl}${explorer.accountPath}/${address}`}
              />
            )}
          </HStack>

          {/*name*/}
          {selectedAsset.name && (
            <ModalTextItem
              label={`${t<string>('labels.name')}:`}
              value={selectedAsset.name}
            />
          )}

          {/*symbol*/}
          {symbol && (
            <ModalTextItem
              label={`${t<string>('labels.symbol')}:`}
              value={symbol}
            />
          )}

          {/*type*/}
          <ModalItem
            label={`${t<string>('labels.type')}:`}
            value={<AssetBadge type={selectedAsset.type} />}
          />

          {/*fee*/}
          {selectedAsset.type === AssetTypeEnum.Standard && (
            <HStack spacing={1} w="full">
              <ModalAssetItem
                amountInAtomicUnits={new BigNumber(selectedNetwork.minFee)}
                decimals={selectedNetwork.nativeCurrency.decimals}
                icon={createIconFromDataUri(
                  selectedNetwork.nativeCurrency.iconUrl,
                  {
                    color: subTextColor,
                    h: 3,
                    w: 3,
                  }
                )}
                label={`${t<string>('labels.fee')}:`}
              />

              {/*info*/}
              <InfoIconTooltip
                color={subTextColor}
                label={t<string>('captions.optOutFee')}
              />
            </HStack>
          )}

          <HStack spacing={1} w="full">
            {/*id*/}
            <ModalTextItem
              flexGrow={1}
              isCode={true}
              label={`${t<string>('labels.id')}:`}
              value={selectedAsset.id}
            />

            {/*copy asset/application id*/}
            <CopyIconButton
              ariaLabel={
                selectedAsset.type === AssetTypeEnum.Standard
                  ? t<string>('labels.copyAssetId')
                  : t<string>('labels.copyApplicationId')
              }
              tooltipLabel={
                selectedAsset.type === AssetTypeEnum.Standard
                  ? t<string>('labels.copyAssetId')
                  : t<string>('labels.copyApplicationId')
              }
              value={selectedAsset.id}
            />

            {/*open asset on explorer*/}
            {explorer && (
              <OpenTabIconButton
                tooltipLabel={t<string>('captions.openOn', {
                  name: explorer.canonicalName,
                })}
                url={`${explorer.baseUrl}${
                  selectedAsset.type === AssetTypeEnum.Standard
                    ? explorer.assetPath
                    : explorer.applicationPath
                }/${selectedAsset.id}`}
              />
            )}
          </HStack>
        </VStack>
      </VStack>
    );
  };
  const renderFooter = () => {
    let cancelButtonNode: ReactNode;

    if (confirming) {
      return null;
    }

    cancelButtonNode = (
      <Button onClick={handleCancelClick} size="lg" variant="outline" w="full">
        {t<string>('buttons.cancel')}
      </Button>
    );

    if (selectedAsset) {
      if (selectedAsset.type === AssetTypeEnum.ARC0200) {
        return (
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {cancelButtonNode}

            <Button
              onClick={handleRemoveARC0200AssetClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.hide')}
            </Button>
          </HStack>
        );
      }

      if (selectedAsset.type === AssetTypeEnum.Standard) {
        return (
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
            {!settings.security.enablePasswordLock && !passwordLockPassword && (
              <PasswordInput
                error={passwordError}
                hint={t<string>('captions.mustEnterPasswordToAuthorizeOptOut')}
                inputRef={passwordInputRef}
                onChange={onPasswordChange}
                onKeyUp={handleKeyUpPasswordInput}
                value={password}
              />
            )}

            <HStack spacing={DEFAULT_GAP - 2} w="full">
              {cancelButtonNode}

              <Button
                onClick={handleRemoveStandardAssetClick}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.remove')}
              </Button>
            </HStack>
          </VStack>
        );
      }
    }

    return cancelButtonNode;
  };
  const renderHeader = () => {
    let symbol: string = 'Asset';

    if (!selectedAsset) {
      return null;
    }

    switch (selectedAsset.type) {
      case AssetTypeEnum.ARC0200:
        symbol = selectedAsset.symbol;
        break;
      case AssetTypeEnum.Standard:
        if (selectedAsset.unitName) {
          symbol = selectedAsset.unitName;
        }

        break;
      default:
        break;
    }

    return (
      <Heading color={defaultTextColor} size="md" textAlign="center">
        {t<string>('headings.removeAsset', {
          context: selectedAsset.type,
          symbol,
        })}
      </Heading>
    );
  };

  // only standard assets will have the password submit
  useEffect(() => {
    if (
      selectedAsset &&
      selectedAsset.type === AssetTypeEnum.Standard &&
      passwordInputRef.current
    ) {
      passwordInputRef.current.focus();
    }
  }, [selectedAsset]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          {renderHeader()}
        </ModalHeader>

        <ModalBody display="flex" px={0}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RemoveAssetsModal;
