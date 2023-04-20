import {
  Heading,
  HStack,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';

// Features
import { fetchAssetInformationById } from '@extension/features/assets';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import {
  useSelectAssetsByGenesisHash,
  useSelectLogger,
} from '@extension/selectors';

// Types
import { IAsset, INetwork } from '@extension/types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import { ILogger } from '@common/types';

interface IProps {
  network: INetwork;
  transaction: Transaction;
}

const AssetTransferTransactionContent: FC<IProps> = ({
  network,
  transaction,
}: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const logger: ILogger = useSelectLogger();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(network.genesisHash);
  const [asset, setAsset] = useState<IAsset | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [standardUnitAmount, setStandardAmount] = useState<BigNumber>(
    new BigNumber('0')
  );

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
      <HStack alignItems="center" justifyContent="center" spacing={2} w="full">
        <Tooltip
          aria-label="Asset amount with unrestricted decimals"
          label={standardUnitAmount.toString()}
        >
          <Heading color={defaultTextColor} size="lg" textAlign="center">
            {formatCurrencyUnit(standardUnitAmount)}
          </Heading>
        </Tooltip>
        <Text color={defaultTextColor} fontSize="sm" textAlign="center">
          {asset.unitName || asset.id}
        </Text>
      </HStack>
    </VStack>
  );
};

export default AssetTransferTransactionContent;
