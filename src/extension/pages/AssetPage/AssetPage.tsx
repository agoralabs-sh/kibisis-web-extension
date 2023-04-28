import { Box, Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowDownOutline, IoArrowUpOutline } from 'react-icons/io5';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

// Components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import Button from '@extension/components/Button';
import CopyIconButton from '@extension/components/CopyIconButton';
import LoadingPage from '@extension/components/LoadingPage';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageHeader from '@extension/components/PageHeader';

// Constants
import { ACCOUNTS_ROUTE } from '@extension/constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';
import useAssetPage from './hooks/useAssetPage';

// Selectors
import {
  useSelectAccounts,
  useSelectFetchingAssets,
  useSelectPreferredBlockExplorer,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// Services
import { AccountService } from '@extension/services';

// Theme
import { theme } from '@extension/theme';

// Types
import { IAccount, IExplorer, INetwork } from '@extension/types';

// Utils
import { formatCurrencyUnit } from '@common/utils';
import { ellipseAddress } from '@extension/utils';

const AssetPage: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const { address, assetId } = useParams();
  // selectors
  const fetchingAssets: boolean = useSelectFetchingAssets();
  const explorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  // hooks
  const {
    account,
    accountInformation,
    asset,
    assetHolding,
    standardUnitAmount,
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
      <PageHeader
        subTitle={
          accountInformation.name
            ? ellipseAddress(accountAddress, { end: 10, start: 10 })
            : undefined
        }
        title={
          accountInformation.name ||
          ellipseAddress(accountAddress, { end: 10, start: 10 })
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
          {/*asset icon*/}
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

          {/*asset name*/}
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
            {/*asset unit name*/}
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

            {/*asset id*/}
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

              {/*copy asset*/}
              <CopyIconButton
                ariaLabel="Copy asset ID"
                copiedTooltipLabel={t<string>('captions.assetIdCopied')}
                value={account.id}
              />

              {/*open asset on explorer*/}
              {explorer && (
                <OpenTabIconButton
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.assetPath}/${asset.id}`}
                />
              )}
            </HStack>
          </HStack>

          {/*amount*/}
          <Tooltip
            aria-label="Asset amount with unrestricted decimals"
            label={standardUnitAmount.toString()}
          >
            <Heading color={defaultTextColor} size="lg" textAlign="center">
              {formatCurrencyUnit(standardUnitAmount)}
            </Heading>
          </Tooltip>
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
