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
import React, { FC, useState } from 'react';
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
import { AccountTabEnum, ARC0300QueryEnum } from '@extension/enums';

// features
import {
  addARC0200AssetHoldingsThunk,
  IUpdateAssetHoldingsResult,
  saveActiveAccountDetails,
  saveNewWatchAccountThunk,
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
  useSelectSelectedNetwork,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';
import QuestsService from '@extension/services/QuestsService';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccount,
  IAppThunkDispatch,
  IARC0300ModalContentProps,
  IARC0300AccountImportSchema,
  IARC0300AccountImportWithAddressQuery,
} from '@extension/types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';
import WatchAccountBadge from '@extension/components/WatchAccountBadge';

const ARC0300AccountImportWithAddressModalContent: FC<
  IARC0300ModalContentProps<
    IARC0300AccountImportSchema<IARC0300AccountImportWithAddressQuery>
  >
> = ({ cancelButtonIcon, cancelButtonLabel, onComplete, onCancel, schema }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const navigate = useNavigate();
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
  const [saving, setSaving] = useState<boolean>(false);
  // handlers
  const handleCancelClick = () => {
    reset();
    onCancel();
  };
  const handleImportClick = async () => {
    let account: IAccount | null;
    let questsService: QuestsService;
    let result: IUpdateAssetHoldingsResult;

    setSaving(true);

    try {
      account = await dispatch(
        saveNewWatchAccountThunk({
          address: schema.query[ARC0300QueryEnum.Address],
          name: null,
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

      questsService = new QuestsService({
        logger,
      });

      // track the action
      await questsService.importAccountViaQRCodeQuest(
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
  const handleOnComplete = () => {
    reset();
    onComplete();
  };
  const reset = () => {
    resetUpdateAssets();
    setSaving(false);
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
          <Text color={defaultTextColor} fontSize="sm" textAlign="center">
            {t<string>('captions.importAccount')}
          </Text>

          <VStack spacing={DEFAULT_GAP / 3} w="full">
            <ModalSubHeading text={t<string>('labels.account')} />

            {/*address*/}
            <ModalTextItem
              label={`${t<string>('labels.address')}:`}
              tooltipLabel={schema.query[ARC0300QueryEnum.Address]}
              value={ellipseAddress(schema.query[ARC0300QueryEnum.Address], {
                end: 10,
                start: 10,
              })}
            />

            {/*type*/}
            <ModalItem label={t('labels.type')} value={<WatchAccountBadge />} />
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
        <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
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
        </VStack>
      </ModalFooter>
    </ModalContent>
  );
};

export default ARC0300AccountImportWithAddressModalContent;
