import {
  Code,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { Algodv2, encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWalletOutline } from 'react-icons/io5';

// Components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';

// Features
import { fetchAccountInformationWithDelay } from '@extension/features/accounts';
import { fetchAssetInformationById } from '@extension/features/assets';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccounts,
  useSelectAssetsByGenesisHash,
  useSelectLogger,
} from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAlgorandAccountInformation,
  IAlgorandAssetHolding,
  IAsset,
  INativeCurrency,
  INetwork,
  INode,
} from '@extension/types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import {
  createIconFromDataUri,
  ellipseAddress,
  randomNode,
} from '@extension/utils';

interface IProps {
  nativeCurrency: INativeCurrency;
  network: INetwork;
  transaction: Transaction;
}

const AssetTransferTransactionContent: FC<IProps> = ({
  nativeCurrency,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const logger: ILogger = useSelectLogger();
  const accounts: IAccount[] = useSelectAccounts();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(network.genesisHash);
  const [asset, setAsset] = useState<IAsset | null>(null);
  const [fromBalance, setFromBalance] = useState<BigNumber>(new BigNumber('0'));
  const [fetching, setFetching] = useState<boolean>(false);
  const [standardUnitAmount, setStandardAmount] = useState<BigNumber>(
    new BigNumber('0')
  );
  const decoder: TextDecoder = new TextDecoder();
  const fromAccount: IAccount | null =
    accounts.find(
      (value) => value.address === encodeAddress(transaction.from.publicKey)
    ) || null;
  const toAccount: IAccount | null =
    accounts.find(
      (value) => value.address === encodeAddress(transaction.to.publicKey)
    ) || null;

  useEffect(() => {
    const amount: BigNumber = new BigNumber(String(transaction.amount));
    const assetId: string = String(transaction.assetIndex);
    let updatedAsset: IAsset | null =
      assets.find((value) => value.id === assetId) || null;

    // if we have the asset information already, use that.
    if (updatedAsset) {
      setAsset(updatedAsset);
      setStandardAmount(convertToStandardUnit(amount, updatedAsset.decimals));

      return;
    }

    (async () => {
      setFetching(true);

      updatedAsset = await fetchAssetInformationById(assetId, {
        logger,
        network,
      });

      if (!updatedAsset) {
        // TODO: handle when asset is unknown
        return;
      }

      setAsset(updatedAsset);
      setStandardAmount(convertToStandardUnit(amount, updatedAsset.decimals));
      setFetching(false);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const node: INode = randomNode(network);
      const accountInformation: IAlgorandAccountInformation =
        await fetchAccountInformationWithDelay({
          address: encodeAddress(transaction.from.publicKey),
          delay: 0,
          client: new Algodv2('', node.url, node.port),
        });
      const assetHolding: IAlgorandAssetHolding | null =
        accountInformation.assets.find(
          (value) =>
            String(value['asset-id']) === String(transaction.assetIndex)
        ) || null;

      if (assetHolding) {
        setFromBalance(new BigNumber(String(assetHolding.amount)));
      }
    })();
  }, []);

  if (fetching || !asset) {
    return (
      <VStack spacing={4} w="full">
        <Skeleton>
          <Heading size="lg" textAlign="center">
            {formatCurrencyUnit(standardUnitAmount)}
          </Heading>
        </Skeleton>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} w="full">
      {/* Amount */}
      <Tooltip
        aria-label="Asset amount with unrestricted decimals"
        label={`${standardUnitAmount.toString()}${
          asset.unitName ? ` ${asset.unitName}` : ''
        }`}
      >
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          w="full"
        >
          <Heading color={defaultTextColor} size="lg" textAlign="center">
            {formatCurrencyUnit(standardUnitAmount)}
          </Heading>
          <AssetAvatar
            asset={asset}
            fallbackIcon={
              <AssetIcon
                color={primaryButtonTextColor}
                networkTheme={network.chakraTheme}
                h={3}
                w={3}
              />
            }
            size="2xs"
          />
          <Text color={defaultTextColor} fontSize="sm" textAlign="center">
            {asset.unitName || asset.id}
          </Text>
        </HStack>
      </Tooltip>

      {/* From */}
      <HStack justifyContent="space-between" spacing={2} w="full">
        <Text color={defaultTextColor} fontSize="xs">{`${t<string>(
          'labels.from'
        )}:`}</Text>
        <Tooltip
          aria-label="From address"
          label={encodeAddress(transaction.from.publicKey)}
        >
          {fromAccount ? (
            <HStack
              backgroundColor={textBackgroundColor}
              borderRadius={theme.radii['3xl']}
              px={2}
              py={1}
              spacing={1}
            >
              <Icon as={IoWalletOutline} color={subTextColor} h={2} w={2} />
              <Text color={subTextColor} fontSize="xs">
                {fromAccount.name ||
                  ellipseAddress(fromAccount.address, {
                    end: 10,
                    start: 10,
                  })}
              </Text>
            </HStack>
          ) : (
            <Text color={subTextColor} fontSize="xs">
              {ellipseAddress(encodeAddress(transaction.from.publicKey), {
                end: 10,
                start: 10,
              })}
            </Text>
          )}
        </Tooltip>
      </HStack>

      {/* To */}
      <HStack justifyContent="space-between" spacing={2} w="full">
        <Text color={defaultTextColor} fontSize="xs">{`${t<string>(
          'labels.to'
        )}:`}</Text>
        <Tooltip
          aria-label="To address"
          label={encodeAddress(transaction.to.publicKey)}
        >
          {toAccount ? (
            <HStack
              backgroundColor={textBackgroundColor}
              borderRadius={theme.radii['3xl']}
              px={2}
              py={1}
              spacing={1}
            >
              <Icon as={IoWalletOutline} color={subTextColor} h={2} w={2} />
              <Text color={subTextColor} fontSize="xs">
                {toAccount.name ||
                  ellipseAddress(toAccount.address, {
                    end: 10,
                    start: 10,
                  })}
              </Text>
            </HStack>
          ) : (
            <Text color={subTextColor} fontSize="xs">
              {ellipseAddress(encodeAddress(transaction.to.publicKey), {
                end: 10,
                start: 10,
              })}
            </Text>
          )}
        </Tooltip>
      </HStack>

      {/* Balance */}
      <HStack justifyContent="space-between" spacing={2} w="full">
        <Text color={defaultTextColor} fontSize="xs">{`${t<string>(
          'labels.balance'
        )}:`}</Text>
        <Tooltip
          aria-label="Balance with unrestricted decimals"
          label={`${convertToStandardUnit(
            fromBalance,
            asset.decimals
          ).toString()}${asset.unitName ? ` ${asset.unitName}` : ''}`}
        >
          <HStack spacing={1}>
            <Text color={subTextColor} fontSize="xs">
              {formatCurrencyUnit(
                convertToStandardUnit(fromBalance, asset.decimals)
              )}
            </Text>
            <AssetAvatar
              asset={asset}
              fallbackIcon={
                <AssetIcon
                  color={primaryButtonTextColor}
                  networkTheme={network.chakraTheme}
                  h={3}
                  w={3}
                />
              }
              size="2xs"
            />
            {asset.unitName && (
              <Text color={subTextColor} fontSize="xs">
                {asset.unitName}
              </Text>
            )}
          </HStack>
        </Tooltip>
      </HStack>

      {/* Fee */}
      <HStack justifyContent="space-between" spacing={2} w="full">
        <Text color={defaultTextColor} fontSize="xs">{`${t<string>(
          'labels.fee'
        )}:`}</Text>
        <HStack spacing={1}>
          <Text color={subTextColor} fontSize="xs">
            {formatCurrencyUnit(
              convertToStandardUnit(
                new BigNumber(String(transaction.fee)),
                nativeCurrency.decimals
              )
            )}
          </Text>
          {createIconFromDataUri(nativeCurrency.iconUri, {
            color: subTextColor,
            h: 2,
            w: 2,
          })}
        </HStack>
      </HStack>

      {/* Note */}
      {transaction.note && (
        <HStack justifyContent="space-between" spacing={2} w="full">
          <Text color={defaultTextColor} fontSize="xs">{`${t<string>(
            'labels.note'
          )}:`}</Text>
          <HStack spacing={1}>
            <Code borderRadius="md" fontSize="xs">
              {decoder.decode(transaction.note)}
            </Code>
          </HStack>
        </HStack>
      )}
    </VStack>
  );
};

export default AssetTransferTransactionContent;
