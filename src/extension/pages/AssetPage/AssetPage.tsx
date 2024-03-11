import {
  Code,
  Heading,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import AssetBadge from '@extension/components/AssetBadge';
import Button from '@extension/components/Button';
import CopyIconButton from '@extension/components/CopyIconButton';
import LoadingPage from '@extension/components/LoadingPage';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageHeader from '@extension/components/PageHeader';
import PageItem from '@extension/components/PageItem';

// constants
import {
  ACCOUNTS_ROUTE,
  DEFAULT_GAP,
  PAGE_ITEM_HEIGHT,
} from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// features
import { initializeRemoveAssets } from '@extension/features/remove-assets';
import { initializeSendAsset } from '@extension/features/send-assets';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useAssetPage from './hooks/useAssetPage';

// modals
import ShareAddressModal from '@extension/modals//ShareAddressModal';

// selectors
import {
  useSelectFetchingStandardAssets,
  useSelectSelectedNetwork,
  useSelectSettingsPreferredBlockExplorer,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAppThunkDispatch,
  IBlockExplorer,
  INetwork,
} from '@extension/types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import ellipseAddress from '@extension/utils/ellipseAddress';

const AssetPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const { assetId } = useParams();
  const {
    isOpen: isShareAddressModalOpen,
    onClose: onShareAddressModalClose,
    onOpen: onShareAddressModalOpen,
  } = useDisclosure();
  const {
    isOpen: isMoreInformationToggleOpen,
    onOpen: onMoreInformationOpen,
    onClose: onMoreInformationClose,
  } = useDisclosure();
  // selectors
  const fetchingAssets: boolean = useSelectFetchingStandardAssets();
  const explorer: IBlockExplorer | null =
    useSelectSettingsPreferredBlockExplorer();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  // hooks
  const {
    account,
    accountInformation,
    asset,
    assetHolding,
    amountInStandardUnits,
  } = useAssetPage({
    assetId: assetId || null,
  });
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // handlers
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onMoreInformationOpen() : onMoreInformationClose();
  const handleReceiveClick = () => onShareAddressModalOpen();
  const handleSendClick = () => {
    if (asset && account) {
      dispatch(
        initializeSendAsset({
          fromAddress: AccountService.convertPublicKeyToAlgorandAddress(
            account.publicKey
          ),
          selectedAsset: asset,
        })
      );
    }
  };
  const handleRemoveAssetClick = () => {
    if (!account || !asset || !selectedNetwork) {
      return;
    }

    dispatch(
      initializeRemoveAssets({
        accountId: account.id,
        selectedAsset: asset,
      })
    );
  };
  const reset = () =>
    navigate(ACCOUNTS_ROUTE, {
      replace: true,
    });
  let accountAddress: string;

  // if we don't have the params, return to accounts page
  useEffect(() => {
    if (!assetId) {
      return reset();
    }
  }, []);

  if (
    !account ||
    !accountInformation ||
    !asset ||
    !assetHolding ||
    fetchingAssets
  ) {
    return <LoadingPage />;
  }

  accountAddress = AccountService.convertPublicKeyToAlgorandAddress(
    account.publicKey
  );

  return (
    <>
      {account && (
        <ShareAddressModal
          address={AccountService.convertPublicKeyToAlgorandAddress(
            account.publicKey
          )}
          isOpen={isShareAddressModalOpen}
          onClose={onShareAddressModalClose}
        />
      )}

      <PageHeader
        subTitle={
          account.name
            ? ellipseAddress(accountAddress, { end: 10, start: 10 })
            : undefined
        }
        title={
          account.name || ellipseAddress(accountAddress, { end: 10, start: 10 })
        }
      />

      <VStack
        alignItems="center"
        justifyContent="flex-start"
        px={DEFAULT_GAP - 2}
        spacing={DEFAULT_GAP - 2}
        w="full"
      >
        <VStack
          alignItems="center"
          justifyContent="flex-start"
          spacing={1}
          w="full"
        >
          {/*icon*/}
          <AssetAvatar
            asset={asset}
            fallbackIcon={
              <AssetIcon
                color={primaryButtonTextColor}
                networkTheme={selectedNetwork?.chakraTheme}
                h={6}
                w={6}
              />
            }
            size="md"
          />

          <HStack
            alignItems="center"
            justifyContent="center"
            spacing={DEFAULT_GAP / 3}
            w="full"
          >
            {/*amount*/}
            <Tooltip
              aria-label="Asset amount with unrestricted decimals"
              label={formatCurrencyUnit(amountInStandardUnits, {
                decimals: asset.decimals,
                thousandSeparatedOnly: true,
              })}
            >
              <Heading color={defaultTextColor} size="lg" textAlign="center">
                {formatCurrencyUnit(amountInStandardUnits, {
                  decimals: asset.decimals,
                })}
              </Heading>
            </Tooltip>

            {/*symbol/unit*/}
            {asset.type === AssetTypeEnum.ARC0200 && (
              <Text color={subTextColor} fontSize="md" textAlign="center">
                {asset.symbol}
              </Text>
            )}
            {asset.type === AssetTypeEnum.Standard && asset.unitName && (
              <Text color={subTextColor} fontSize="md" textAlign="center">
                {asset.unitName}
              </Text>
            )}

            {/*remove asset*/}
            <Tooltip
              label={t<string>('labels.removeAsset', { context: asset.type })}
            >
              <IconButton
                aria-label="Remove Asset"
                icon={<IoTrashOutline />}
                onClick={handleRemoveAssetClick}
                size="sm"
                variant="ghost"
              />
            </Tooltip>
          </HStack>

          {/*name*/}
          {asset.name && (
            <PageItem fontSize="sm" label={t<string>('labels.name')}>
              <Tooltip aria-label="Asset name" label={asset.name}>
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  maxW={200}
                  noOfLines={1}
                  textAlign="center"
                >
                  {asset.name}
                </Text>
              </Tooltip>
            </PageItem>
          )}

          {/*asset id*/}
          <PageItem
            fontSize="sm"
            label={
              asset.type === AssetTypeEnum.Standard
                ? t<string>('labels.assetId')
                : t<string>('labels.applicationId')
            }
          >
            <HStack spacing={1}>
              <Code
                borderRadius="md"
                color={defaultTextColor}
                fontSize="sm"
                wordBreak="break-word"
              >
                {asset.id}
              </Code>

              {/*copy asset*/}
              <CopyIconButton
                ariaLabel={
                  asset.type === AssetTypeEnum.Standard
                    ? t<string>('labels.copyAssetId')
                    : t<string>('labels.copyApplicationId')
                }
                tooltipLabel={
                  asset.type === AssetTypeEnum.Standard
                    ? t<string>('labels.copyAssetId')
                    : t<string>('labels.copyApplicationId')
                }
                value={asset.id}
              />

              {/*open asset on explorer*/}
              {explorer && (
                <OpenTabIconButton
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${
                    asset.type === AssetTypeEnum.Standard
                      ? explorer.assetPath
                      : explorer.applicationPath
                  }/${asset.id}`}
                />
              )}
            </HStack>
          </PageItem>

          {/*type*/}
          <PageItem fontSize="sm" label={t<string>('labels.type')}>
            <AssetBadge type={asset.type} />
          </PageItem>

          <MoreInformationAccordion
            color={defaultTextColor}
            fontSize="sm"
            isOpen={isMoreInformationToggleOpen}
            minButtonHeight={PAGE_ITEM_HEIGHT}
            onChange={handleMoreInformationToggle}
          >
            <VStack spacing={DEFAULT_GAP - 2} w="full">
              {/*decimals*/}
              <PageItem fontSize="sm" label={t<string>('labels.decimals')}>
                <Text color={subTextColor} fontSize="sm">
                  {asset.decimals.toString()}
                </Text>
              </PageItem>

              {/*total supply*/}
              {asset.type === AssetTypeEnum.ARC0200 && (
                <PageItem fontSize="sm" label={t<string>('labels.totalSupply')}>
                  <Tooltip
                    aria-label="Asset amount with unrestricted decimals"
                    label={formatCurrencyUnit(
                      convertToStandardUnit(
                        new BigNumber(asset.totalSupply),
                        asset.decimals
                      ),
                      {
                        decimals: asset.decimals,
                        thousandSeparatedOnly: true,
                      }
                    )}
                  >
                    <Text color={subTextColor} fontSize="sm">
                      {formatCurrencyUnit(
                        convertToStandardUnit(
                          new BigNumber(asset.totalSupply),
                          asset.decimals
                        ),
                        { decimals: asset.decimals }
                      )}
                    </Text>
                  </Tooltip>
                </PageItem>
              )}
            </VStack>
          </MoreInformationAccordion>
        </VStack>

        {/*send/receive buttons*/}
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={DEFAULT_GAP / 3}
          w="full"
        >
          <Button
            leftIcon={<IoArrowUpOutline />}
            onClick={handleSendClick}
            size="md"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.send')}
          </Button>
          <Button
            leftIcon={<IoArrowDownOutline />}
            onClick={handleReceiveClick}
            size="md"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.receive')}
          </Button>
        </HStack>
      </VStack>
    </>
  );
};

export default AssetPage;
