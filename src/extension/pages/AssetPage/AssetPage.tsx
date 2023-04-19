import { Box, Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowDownOutline, IoArrowUpOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

// Components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import Button from '@extension/components/Button';
import CopyIconButton from '@extension/components/CopyIconButton';
import LoadingPage from '@extension/components/LoadingPage';
import PageHeader from '@extension/components/PageHeader';

// Constants
import { ACCOUNTS_ROUTE } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccount,
  useSelectAssets,
  useSelectFetchingAssets,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import {
  IAccount,
  IAppThunkDispatch,
  IAsset,
  IAssetHolding,
  INetwork,
} from '@extension/types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import { convertGenesisHashToHex, ellipseAddress } from '@extension/utils';

const AssetPage: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { address, assetId } = useParams();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const account: IAccount | null = useSelectAccount(address);
  const assets: Record<string, IAsset[]> | null = useSelectAssets();
  const fetchingAssets: boolean = useSelectFetchingAssets();
  const network: INetwork | null = useSelectSelectedNetwork();
  const [asset, setAsset] = useState<IAsset | null>(null);
  const [assetHolding, setAssetHolding] = useState<IAssetHolding | null>(null);
  let standardUnitAmount: BigNumber = new BigNumber('0');
  const handleReceiveClick = () => {
    console.log('open receive modal');
  };
  const handleSendClick = () => {
    console.log('open send asset!');
  };
  const reset = () =>
    navigate(ACCOUNTS_ROUTE, {
      replace: true,
    });

  useEffect(() => {
    // if no account can be found, go back to the accounts page
    if (!account) {
      return reset();
    }

    setAssetHolding(
      account.assets.find((value) => value.id === assetId) || null
    );
  }, [account]);
  useEffect(() => {
    let networkAsset: IAsset | null;

    // if we have both the network and asset list, extract the asset
    if (network && assets) {
      networkAsset =
        assets[convertGenesisHashToHex(network.genesisHash)]?.find(
          (value) => value.id === assetId
        ) || null;

      // if no asset exists, go back to the network page
      if (!networkAsset) {
        return reset();
      }

      setAsset(networkAsset);
    }
  }, [assets, network]);

  if (!account || !asset || !assets || !network || fetchingAssets) {
    return <LoadingPage />;
  }

  if (assetHolding) {
    standardUnitAmount = convertToStandardUnit(
      new BigNumber(assetHolding.amount),
      asset.decimals
    );
  }

  return (
    <>
      <PageHeader
        subTitle={
          account.name
            ? ellipseAddress(account.address, { end: 10, start: 10 })
            : undefined
        }
        title={
          account.name ||
          ellipseAddress(account.address, { end: 10, start: 10 })
        }
      />
      <VStack
        alignItems="center"
        justifyContent="flex-start"
        px={4}
        spacing={4}
        w="full"
      >
        <VStack
          alignItems="center"
          justifyContent="flex-start"
          spacing={1}
          w="full"
        >
          <AssetAvatar
            asset={asset}
            fallbackIcon={
              <AssetIcon
                color={primaryButtonTextColor}
                networkTheme={network?.chakraTheme}
                h={6}
                w={6}
              />
            }
            size="md"
          />
          {/* Asset name */}
          {asset.name && (
            <Tooltip aria-label="Asset name" label={asset.name}>
              <Text
                color={defaultTextColor}
                fontSize="md"
                maxW={200}
                noOfLines={1}
                textAlign="center"
              >
                {asset.name}
              </Text>
            </Tooltip>
          )}
          <HStack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            w="full"
          >
            {/* Asset unit name */}
            {asset.unitName && (
              <>
                <Text color={subTextColor} fontSize="sm" textAlign="center">
                  {asset.unitName}
                </Text>
                <Text color={subTextColor} fontSize="sm" textAlign="center">
                  |
                </Text>
              </>
            )}
            {/* Asset ID */}
            <HStack alignItems="center" justifyContent="center" spacing={0}>
              <Box
                backgroundColor={textBackgroundColor}
                borderRadius={theme.radii['3xl']}
                px={2}
                py={1}
              >
                <Text color={subTextColor} fontSize="sm">
                  {asset.id}
                </Text>
              </Box>
              <CopyIconButton
                ariaLabel="Copy asset ID"
                copiedTooltipLabel={t<string>('captions.assetIdCopied')}
                value={account.id}
              />
            </HStack>
          </HStack>
          {/* Amount */}
          <Tooltip
            aria-label="Asset amount with unrestricted decimals"
            label={standardUnitAmount.toString()}
          >
            <Heading color={defaultTextColor} size="lg" textAlign="center">
              {formatCurrencyUnit(standardUnitAmount)}
            </Heading>
          </Tooltip>
        </VStack>

        {/* Send/receive buttons */}
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
