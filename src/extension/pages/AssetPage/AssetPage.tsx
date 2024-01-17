import {
  Box,
  Heading,
  HStack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
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
import IconButton from '@extension/components/IconButton';
import LoadingPage from '@extension/components/LoadingPage';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageHeader from '@extension/components/PageHeader';

// constants
import { ACCOUNTS_ROUTE, DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// features
import { removeArc200AssetHoldingThunk } from '@extension/features/accounts';
import { initializeSendAsset } from '@extension/features/send-assets';
import { setConfirm } from '@extension/features/system';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';
import useAssetPage from './hooks/useAssetPage';

// modals
import ShareAddressModal from '@extension/modals//ShareAddressModal';

// selectors
import {
  useSelectFetchingStandardAssets,
  useSelectPreferredBlockExplorer,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import { IAppThunkDispatch, IExplorer, INetwork } from '@extension/types';

// utils
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import ellipseAddress from '@extension/utils/ellipseAddress';

const AssetPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const { address, assetId } = useParams();
  const {
    isOpen: isShareAddressModalOpen,
    onClose: onShareAddressModalClose,
    onOpen: onShareAddressModalOpen,
  } = useDisclosure();
  // selectors
  const fetchingAssets: boolean = useSelectFetchingStandardAssets();
  const explorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  // hooks
  const {
    account,
    accountInformation,
    asset,
    assetHolding,
    amountInStandardUnits,
  } = useAssetPage({
    address: address || null,
    assetId: assetId || null,
    onError: () =>
      navigate(ACCOUNTS_ROUTE, {
        replace: true,
      }),
  });
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  // handlers
  const handleReceiveClick = () => onShareAddressModalOpen();
  const handleSendClick = () => {
    if (asset && address) {
      dispatch(
        initializeSendAsset({
          fromAddress: address,
          selectedAsset: asset,
        })
      );
    }
  };
  const handleRemoveAssetClick = () => {
    if (
      !account ||
      !asset ||
      !selectedNetwork ||
      asset.type !== AssetTypeEnum.Arc200
    ) {
      return;
    }

    dispatch(
      setConfirm({
        description: t<string>('captions.removeAssetConfirm', {
          symbol: asset.symbol,
        }),
        onConfirm: () => {
          // remove the asset
          dispatch(
            removeArc200AssetHoldingThunk({
              accountId: account.id,
              appId: asset.id,
              genesisHash: selectedNetwork.genesisHash,
            })
          );

          // navigate to the accounts page
          navigate(ACCOUNTS_ROUTE, {
            replace: true,
          });
        },
        title: t<string>('headings.removeAssetConfirm', {
          symbol: asset.symbol,
        }),
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
    if (!address || !assetId) {
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
        spacing={4}
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
            spacing={2}
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
            {asset.type === AssetTypeEnum.Arc200 && (
              <Text color={subTextColor} fontSize="md" textAlign="center">
                {asset.symbol}
              </Text>
            )}
            {asset.type === AssetTypeEnum.Standard && asset.unitName && (
              <Text color={subTextColor} fontSize="md" textAlign="center">
                {asset.unitName}
              </Text>
            )}
          </HStack>

          <HStack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            w="full"
          >
            {/*name*/}
            {asset.name && (
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
            )}

            {/*type*/}
            <AssetBadge type={asset.type} />
          </HStack>

          <HStack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            w="full"
          >
            <HStack alignItems="center" justifyContent="center" spacing={0}>
              {/*id*/}
              <Box
                backgroundColor={textBackgroundColor}
                borderRadius={theme.radii['3xl']}
                px={DEFAULT_GAP / 3}
                py={1}
              >
                <Text color={subTextColor} fontSize="sm">
                  {asset.id}
                </Text>
              </Box>

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

              {/*remove asset*/}
              {asset.type === AssetTypeEnum.Arc200 && (
                <Tooltip label={t<string>('labels.removeAsset')}>
                  <IconButton
                    aria-label="Remove Asset"
                    icon={IoTrashOutline}
                    onClick={handleRemoveAssetClick}
                    size="sm"
                    variant="ghost"
                  />
                </Tooltip>
              )}
            </HStack>
          </HStack>
        </VStack>

        {/*send/receive buttons*/}
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={2}
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
