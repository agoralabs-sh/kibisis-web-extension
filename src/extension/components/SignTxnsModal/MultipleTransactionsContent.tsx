import { Box, Text, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import { Algodv2, encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import { nanoid } from 'nanoid';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// Constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// Hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Features
import { fetchAccountInformationWithDelay } from '@extension/features/accounts';
import { updateAssetInformationThunk } from '@extension/features/assets';

// Selectors
import {
  useSelectAccounts,
  useSelectAssetsByGenesisHash,
} from '@extension/selectors';

// Types
import {
  IAccount,
  IAlgorandAccountInformation,
  IAppThunkDispatch,
  IAsset,
  IAssetHolding,
  INativeCurrency,
  INetwork,
  INode,
} from '@extension/types';

// Utils
import { computeGroupId } from '@common/utils';
import {
  createIconFromDataUri,
  initializeDefaultAccount,
  mapAlgorandAccountInformationToAccount,
  randomNode,
} from '@extension/utils';

interface IProps {
  nativeCurrency: INativeCurrency;
  network: INetwork;
  transactions: Transaction[];
}

const MultipleTransactionsContent: FC<IProps> = ({
  nativeCurrency,
  network,
  transactions,
}: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const borderColor: string = useBorderColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const accounts: IAccount[] = useSelectAccounts();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(network.genesisHash);
  const [fetchingAccountInformation, setFetchingAccountInformation] =
    useState<boolean>(false);
  const [fromAccounts, setFromAccounts] = useState<IAccount[]>([]);
  const [openAccordions, setOpenAccordions] = useState<boolean[]>(
    Array.from({ length: transactions.length }, () => false)
  );
  const computedGroupId: string = encodeBase64(computeGroupId(transactions));
  const handleToggleAccordion = (accordionIndex: number) => (open: boolean) => {
    setOpenAccordions(
      openAccordions.map((value, index) =>
        index === accordionIndex ? open : value
      )
    );
  };
  const renderContent = (
    transaction: Transaction,
    transactionIndex: number
  ) => {
    const fromAccount: IAccount | null =
      fromAccounts.find((_, index) => index === transactionIndex) || null;
    const nativeCurrencyIcon: ReactNode = createIconFromDataUri(
      nativeCurrency.iconUri,
      {
        color: subTextColor,
        h: 3,
        w: 3,
      }
    );
    let asset: IAsset | null;
    let assetHolding: IAssetHolding | null = null;
    let assetIcon: ReactNode;

    switch (transaction.type) {
      case 'axfer':
        asset =
          assets.find((value) => value.id === String(transaction.assetIndex)) ||
          null;

        if (asset) {
          assetHolding =
            fromAccount?.assets.find((value) => value.id === asset?.id) || null;
          assetIcon = (
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
          );

          return (
            <VStack spacing={2} w="full">
              {/*Amount*/}
              <SignTxnsAssetItem
                atomicUnitsAmount={new BigNumber(String(transaction.amount))}
                decimals={asset.decimals}
                displayUnit={true}
                icon={assetIcon}
                label={`${t<string>('labels.amount')}:`}
                unit={asset.unitName || undefined}
              />

              {/*From*/}
              <SignTxnsAddressItem
                address={encodeAddress(transaction.from.publicKey)}
                ariaLabel="From address"
                label={`${t<string>('labels.from')}:`}
              />

              {/*To*/}
              <SignTxnsAddressItem
                address={encodeAddress(transaction.to.publicKey)}
                ariaLabel="To address"
                label={`${t<string>('labels.to')}:`}
              />

              {/*More information*/}
              <MoreInformationAccordion
                color={defaultTextColor}
                fontSize="xs"
                isOpen={openAccordions[transactionIndex]}
                onChange={handleToggleAccordion(transactionIndex)}
              >
                <VStack spacing={2} w="full">
                  {/* Balance */}
                  <SignTxnsAssetItem
                    atomicUnitsAmount={
                      new BigNumber(assetHolding ? assetHolding.amount : '0')
                    }
                    decimals={asset.decimals}
                    icon={assetIcon}
                    isLoading={fetchingAccountInformation}
                    label={`${t<string>('labels.balance')}:`}
                    unit={asset.unitName || undefined}
                  />

                  {/*Fee*/}
                  <SignTxnsAssetItem
                    atomicUnitsAmount={new BigNumber(String(transaction.fee))}
                    decimals={nativeCurrency.decimals}
                    icon={nativeCurrencyIcon}
                    label={`${t<string>('labels.fee')}:`}
                    unit={nativeCurrency.code}
                  />

                  {/* Note */}
                  {transaction.note && transaction.note.length > 0 && (
                    <SignTxnsTextItem
                      label={`${t<string>('labels.note')}:`}
                      value={new TextDecoder().decode(transaction.note)}
                    />
                  )}
                </VStack>
              </MoreInformationAccordion>
            </VStack>
          );
        }

        break;
      case 'pay':
        return (
          <VStack spacing={2} w="full">
            {/*Amount*/}
            <SignTxnsAssetItem
              atomicUnitsAmount={new BigNumber(String(transaction.amount))}
              decimals={nativeCurrency.decimals}
              icon={nativeCurrencyIcon}
              label={`${t<string>('labels.amount')}:`}
              unit={nativeCurrency.code}
            />

            {/*From*/}
            <SignTxnsAddressItem
              address={encodeAddress(transaction.from.publicKey)}
              ariaLabel="From address"
              label={`${t<string>('labels.from')}:`}
            />

            {/*To*/}
            <SignTxnsAddressItem
              address={encodeAddress(transaction.to.publicKey)}
              ariaLabel="To address"
              label={`${t<string>('labels.to')}:`}
            />

            {/*More information*/}
            <MoreInformationAccordion
              color={defaultTextColor}
              fontSize="xs"
              isOpen={openAccordions[transactionIndex]}
              onChange={handleToggleAccordion(transactionIndex)}
            >
              <VStack spacing={2} w="full">
                {/* Balance */}
                <SignTxnsAssetItem
                  atomicUnitsAmount={
                    new BigNumber(fromAccount ? fromAccount.atomicBalance : '0')
                  }
                  decimals={nativeCurrency.decimals}
                  icon={nativeCurrencyIcon}
                  isLoading={fetchingAccountInformation}
                  label={`${t<string>('labels.balance')}:`}
                  unit={nativeCurrency.code}
                />

                {/*Fee*/}
                <SignTxnsAssetItem
                  atomicUnitsAmount={new BigNumber(String(transaction.fee))}
                  decimals={nativeCurrency.decimals}
                  icon={nativeCurrencyIcon}
                  label={`${t<string>('labels.fee')}:`}
                  unit={nativeCurrency.code}
                />

                {/* Note */}
                {transaction.note && transaction.note.length > 0 && (
                  <SignTxnsTextItem
                    label={`${t<string>('labels.note')}:`}
                    value={new TextDecoder().decode(transaction.note)}
                  />
                )}
              </VStack>
            </MoreInformationAccordion>
          </VStack>
        );
      default:
        break;
    }

    return null;
  };

  useEffect(() => {
    const unknownAssetIds: string[] = transactions
      .filter((value) => value.type === 'axfer')
      .filter(
        (transaction) =>
          !assets.some((value) => value.id === String(transaction.assetIndex))
      )
      .map((value) => String(value.assetIndex));

    // if we have some unknown assets, update the asset storage
    if (unknownAssetIds.length > 0) {
      dispatch(
        updateAssetInformationThunk({
          ids: unknownAssetIds,
          genesisHash: network.genesisHash,
        })
      );
    }
  }, []);
  useEffect(() => {
    (async () => {
      let updatedFromAccounts: IAccount[];

      setFetchingAccountInformation(true);

      updatedFromAccounts = await Promise.all(
        transactions.map(async (transaction, index) => {
          let address: string = encodeAddress(transaction.from.publicKey);
          let account: IAccount | null =
            accounts.find((value) => value.address === address) || null;
          let accountInformation: IAlgorandAccountInformation;
          let node: INode;

          // if we have this account, just return it
          if (account) {
            return account;
          }

          node = randomNode(network);
          accountInformation = await fetchAccountInformationWithDelay({
            address,
            delay: index * NODE_REQUEST_DELAY,
            client: new Algodv2('', node.url, node.port),
          });
          account = initializeDefaultAccount({
            address,
            authAddress: accountInformation['auth-addr'],
            genesisHash: network.genesisHash,
          });

          return mapAlgorandAccountInformationToAccount(
            accountInformation,
            account
          );
        })
      );

      setFromAccounts(updatedFromAccounts);
      setFetchingAccountInformation(false);
    })();
  }, []);

  return (
    <VStack spacing={4} w="full">
      {/*Group ID*/}
      <SignTxnsTextItem
        label={`${t<string>('labels.groupId')}:`}
        value={computedGroupId}
      />

      {/*Transactions*/}
      {transactions.map((transaction, index) => (
        <Box
          borderColor={borderColor}
          borderRadius="md"
          borderStyle="solid"
          borderWidth={1}
          key={nanoid()}
          px={4}
          py={2}
          w="full"
        >
          <VStack
            alignItems="center"
            justifyContent="flex-start"
            spacing={2}
            w="full"
          >
            <Text
              color={defaultTextColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              {t<string>('headings.transaction', {
                context: transaction.type,
              })}
            </Text>
            {renderContent(transaction, index)}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};

export default MultipleTransactionsContent;
