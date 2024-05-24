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
import React, { FC, KeyboardEvent, ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import Button from '@extension/components/Button';
import InfoIconTooltip from '@extension/components/InfoIconTooltip';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import ReKeyAccountConfirmingModalContent from './ReKeyAccountConfirmingModalContent';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';

// features
import { setConfirming } from '@extension/features/re-key-account';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useReKeyAccountModal from './hooks/useReKeyAccountModal';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectSettings,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppThunkDispatch, IModalProps } from '@extension/types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import isReKeyedAuthAccountAvailable from '@extension/utils/isReKeyedAuthAccountAvailable';

const ReKeyAccountModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts = useSelectAccounts();
  const logger = useSelectLogger();
  const passwordLockPassword = useSelectPasswordLockPassword();
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
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const { account, accountInformation, confirming, network } =
    useReKeyAccountModal();
  const subTextColor: string = useSubTextColor();
  // misc
  const isOpen = !!account && !!accountInformation;
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    resetPassword();
    onClose && onClose();
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    // if (event.key === 'Enter') {
    //   await handleAddStandardAssetClick();
    // }
  };
  const handleUndoReKeyClick = async () => {
    // const _functionName: string = 'handleAddStandardAssetClick';
    // let actionTrackingService: ActionTrackingService;
    // let _password: string | null;
    //
    // if (
    //   !selectedNetwork ||
    //   !account ||
    //   !selectedAsset ||
    //   selectedAsset.type !== AssetTypeEnum.Standard
    // ) {
    //   return;
    // }
    //
    // // if there is no password lock
    // if (!settings.security.enablePasswordLock && !passwordLockPassword) {
    //   // validate the password input
    //   if (validatePassword()) {
    //     logger.debug(
    //       `${ReKeyAccountModal.name}#${_functionName}: password not valid`
    //     );
    //
    //     return;
    //   }
    // }
    //
    // _password = settings.security.enablePasswordLock
    //   ? passwordLockPassword
    //   : password;
    //
    // if (!_password) {
    //   logger.debug(
    //     `${ReKeyAccountModal.name}#${_functionName}: unable to use password from password lock, value is "null"`
    //   );
    //
    //   return;
    // }
    //
    // dispatch(setConfirming(true));
    //
    // try {
    //   await dispatch(
    //     addStandardAssetHoldingsThunk({
    //       accountId: account.id,
    //       assets: [selectedAsset],
    //       genesisHash: selectedNetwork.genesisHash,
    //       password: _password,
    //     })
    //   ).unwrap();
    //
    //   actionTrackingService = new ActionTrackingService({
    //     logger,
    //   });
    //
    //   // track the action if this is a new asset
    //   if (isNewSelectedAsset) {
    //     await actionTrackingService.addStandardAssetAction(
    //       AccountService.convertPublicKeyToAlgorandAddress(account.publicKey),
    //       {
    //         assetID: selectedAsset.id,
    //         genesisHash: selectedNetwork.genesisHash,
    //       }
    //     );
    //   }
    //
    //   dispatch(
    //     createNotification({
    //       title: t<string>('headings.addedAsset', {
    //         symbol:
    //           selectedAsset.unitName || selectedAsset.name || selectedAsset.id,
    //       }),
    //       type: 'success',
    //     })
    //   );
    //
    //   handleClose();
    // } catch (error) {
    //   switch (error.code) {
    //     case ErrorCodeEnum.InvalidPasswordError:
    //       setPasswordError(t<string>('errors.inputs.invalidPassword'));
    //
    //       break;
    //     case ErrorCodeEnum.OfflineError:
    //       dispatch(
    //         createNotification({
    //           ephemeral: true,
    //           title: t<string>('headings.offline'),
    //           type: 'error',
    //         })
    //       );
    //       break;
    //     default:
    //       dispatch(
    //         createNotification({
    //           description: t<string>('errors.descriptions.code', {
    //             code: error.code,
    //             context: error.code,
    //           }),
    //           ephemeral: true,
    //           title: t<string>('errors.titles.code', { context: error.code }),
    //           type: 'error',
    //         })
    //       );
    //       break;
    //   }
    // }
    //
    // dispatch(setConfirming(false));
  };
  // renders
  const renderContent = () => {
    if (account && accountInformation && network) {
      // undoing a re-key
      if (
        accountInformation.authAddress &&
        isReKeyedAuthAccountAvailable({
          accounts,
          authAddress: accountInformation.authAddress,
        })
      ) {
        if (confirming) {
          return (
            <ReKeyAccountConfirmingModalContent
              authAddress={accountInformation.authAddress}
              isReKeying={true}
              reKeyAddress={AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              )}
            />
          );
        }
        console.log('account:', account);

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
                {t<string>('captions.undoReKeyAccount')}
              </Text>

              {/*re-keyed account*/}
              <ModalItem
                flexGrow={1}
                label={`${t<string>('labels.reKeyedAccount')}:`}
                value={
                  <AddressDisplay
                    address={AccountService.convertPublicKeyToAlgorandAddress(
                      account.publicKey
                    )}
                    ariaLabel="Re-keyed address"
                    color={subTextColor}
                    fontSize="sm"
                    network={network}
                  />
                }
              />

              {/*auth account*/}
              <ModalItem
                flexGrow={1}
                label={`${t<string>('labels.authorizedAccountToRemove')}:`}
                value={
                  <AddressDisplay
                    address={accountInformation.authAddress}
                    ariaLabel="Auth address"
                    color={subTextColor}
                    fontSize="sm"
                    network={network}
                  />
                }
              />

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
      // if the re-key is being reversed
      if (
        accountInformation.authAddress &&
        isReKeyedAuthAccountAvailable({
          accounts,
          authAddress: accountInformation.authAddress,
        })
      ) {
        return (
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
            {!settings.security.enablePasswordLock && !passwordLockPassword && (
              <PasswordInput
                error={passwordError}
                hint={t<string>(
                  'captions.mustEnterPasswordToAuthorizeUndoReKey'
                )}
                inputRef={passwordInputRef}
                onChange={onPasswordChange}
                onKeyUp={handleKeyUpPasswordInput}
                value={password}
              />
            )}

            <HStack spacing={DEFAULT_GAP - 2} w="full">
              {cancelButtonNode}

              <Button
                onClick={handleUndoReKeyClick}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.undo')}
              </Button>
            </HStack>
          </VStack>
        );
      }
    }

    return cancelButtonNode;
  };

  return (
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
              accountInformation &&
                accountInformation.authAddress &&
                isReKeyedAuthAccountAvailable({
                  accounts,
                  authAddress: accountInformation.authAddress,
                })
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
  );
};

export default ReKeyAccountModal;
