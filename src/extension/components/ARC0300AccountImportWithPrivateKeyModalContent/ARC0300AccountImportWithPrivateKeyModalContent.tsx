import {
  Heading,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';
import Button from '@extension/components/Button';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import ModalSubHeading from '@extension/components/ModalSubHeading';

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

// errors
import { BaseExtensionError } from '@extension/errors';

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

// modals
import AuthenticationModal, {
  TOnConfirmResult,
} from '@extension/modals/AuthenticationModal';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// selectors
import {
  useSelectActiveAccountDetails,
  useSelectLogger,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';
import QuestsService from '@extension/services/QuestsService';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccount,
  IARC0300AccountImportSchema,
  IARC0300AccountImportWithPrivateKeyQuery,
  IARC0300ModalContentProps,
  IAppThunkDispatch,
} from '@extension/types';

// utils
import convertPrivateKeyToAVMAddress from '@extension/utils/convertPrivateKeyToAVMAddress';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';
import decodePrivateKeyFromAccountImportSchema from '@extension/utils/decodePrivateKeyFromImportKeySchema';

const ARC0300AccountImportWithPrivateKeyModalContent: FC<
  IARC0300ModalContentProps<
    IARC0300AccountImportSchema<IARC0300AccountImportWithPrivateKeyQuery>
  >
> = ({ cancelButtonIcon, cancelButtonLabel, onComplete, onCancel, schema }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate = useNavigate();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const activeAccountDetails = useSelectActiveAccountDetails();
  const logger = useSelectLogger();
  const network = useSelectSelectedNetwork();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    assets,
    loading,
    reset: resetUpdateAssets,
  } = useUpdateARC0200Assets(schema.query[ARC0300QueryEnum.Asset]);
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // states
  const [address, setAddress] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  // misc
  const reset = () => {
    resetUpdateAssets();
    setSaving(false);
  };
  // handlers
  const handleCancelClick = () => {
    reset();
    onCancel();
  };
  const handleImportClick = () => onAuthenticationModalOpen();
  const handleOnAuthenticationModalConfirm = async (
    result: TOnConfirmResult
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    const privateKey: Uint8Array | null =
      decodePrivateKeyFromAccountImportSchema(schema);
    let account: IAccount | null;
    let questsService: QuestsService;
    let updateAssetHoldingsResult: IUpdateAssetHoldingsResult;

    if (!privateKey) {
      logger.debug(
        `${ARC0300AccountImportWithPrivateKeyModalContent.name}#${_functionName}: failed to decode the private key`
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
          keyPair: Ed21559KeyPair.generateFromPrivateKey(privateKey),
          name: null,
          ...result,
        })
      ).unwrap();

      // if there are assets, add them to the new account
      if (assets.length > 0 && network) {
        updateAssetHoldingsResult = await dispatch(
          addARC0200AssetHoldingsThunk({
            accountId: account.id,
            assets,
            genesisHash: network.genesisHash,
          })
        ).unwrap();

        account = updateAssetHoldingsResult.account;
      }
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.PrivateKeyAlreadyExistsError:
          logger.debug(
            `${ARC0300AccountImportWithPrivateKeyModalContent.name}#${_functionName}: account already exists, carry on`
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
              convertPublicKeyToAVMAddress(
                PrivateKeyService.decode(account.publicKey)
              )
            ),
          }),
          title: t<string>('headings.addedAccount'),
          type: 'success',
        })
      );

      questsService = new QuestsService({
        logger,
      });

      // track the action
      await questsService.importAccountViaQRCodeQuest(
        convertPublicKeyToAVMAddress(
          PrivateKeyService.decode(account.publicKey)
        )
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
  const handleOnComplete = () => {
    reset();
    onComplete();
  };

  useEffect(() => {
    const privateKey: Uint8Array | null =
      decodePrivateKeyFromAccountImportSchema(schema);

    if (privateKey) {
      setAddress(convertPrivateKeyToAVMAddress(privateKey));
    }
  }, []);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnAuthenticationError}
        passwordHint={t<string>('captions.mustEnterPasswordToImportAccount')}
      />

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
          <VStack
            alignItems="center"
            flexGrow={1}
            spacing={DEFAULT_GAP}
            w="full"
          >
            <Text color={defaultTextColor} fontSize="sm" textAlign="center">
              {t<string>('captions.importAccount')}
            </Text>

            <VStack spacing={DEFAULT_GAP / 3} w="full">
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
              <VStack spacing={DEFAULT_GAP / 3} w="full">
                <ModalSkeletonItem />
                <ModalSkeletonItem />
                <ModalSkeletonItem />
              </VStack>
            )}
            {assets.length > 0 && !loading && (
              <VStack spacing={DEFAULT_GAP / 3} w="full">
                <ModalSubHeading text={t<string>('labels.assets')} />

                {assets.map((value, index) => (
                  <ModalItem
                    key={`account-import-add-asset-${index}`}
                    label={`${value.name}:`}
                    value={
                      <HStack spacing={DEFAULT_GAP / 3}>
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
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {/*cancel button*/}
            <Button
              leftIcon={cancelButtonIcon}
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {cancelButtonLabel || t<string>('buttons.cancel')}
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
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default ARC0300AccountImportWithPrivateKeyModalContent;
