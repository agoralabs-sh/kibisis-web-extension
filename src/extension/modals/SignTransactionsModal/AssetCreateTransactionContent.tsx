import { HStack, Text, VStack } from '@chakra-ui/react';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AssetIcon from '@extension/components/AssetIcon';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IAccount, INetwork } from '@extension/types';
import type { ICondensedProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';

interface IProps {
  condensed?: ICondensedProps;
  fromAccount: IAccount | null;
  loading?: boolean;
  network: INetwork;
  transaction: Transaction;
}

const AssetCreateTransactionContent: FC<IProps> = ({
  condensed,
  fromAccount,
  loading = false,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const feeAsAtomicUnit: BigNumber = new BigNumber(
    transaction.fee ? String(transaction.fee) : '0'
  );
  const fromAddress: string = encodeAddress(transaction.from.publicKey);
  const transactionType: TransactionTypeEnum = parseTransactionType(
    transaction.get_obj_for_encoding(),
    {
      network,
      sender: fromAccount,
    }
  );
  // renders
  const renderExtraInformation = () => {
    return (
      <>
        {/*fee*/}
        <SignTxnsAssetItem
          atomicUnitAmount={feeAsAtomicUnit}
          decimals={network.nativeCurrency.decimals}
          icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          label={`${t<string>('labels.fee')}:`}
          unit={network.nativeCurrency.symbol}
        />

        {/*total supply*/}
        <SignTxnsAssetItem
          atomicUnitAmount={new BigNumber(String(transaction.assetTotal))}
          decimals={transaction.assetDecimals}
          icon={
            <AssetIcon
              color={subTextColor}
              networkTheme={network.chakraTheme}
              h={3}
              w={3}
            />
          }
          label={`${t<string>('labels.totalSupply')}:`}
        />

        {/*decimals*/}
        <ModalTextItem
          label={`${t<string>('labels.decimals')}:`}
          value={String(transaction.assetDecimals)}
        />

        {/*unit name*/}
        {transaction.assetUnitName && (
          <ModalTextItem
            label={`${t<string>('labels.unitName')}:`}
            value={transaction.assetUnitName}
          />
        )}

        {/*clawback address*/}
        {transaction.assetClawback && (
          <SignTxnsAddressItem
            address={encodeAddress(transaction.assetClawback.publicKey)}
            ariaLabel="The clawback account for the new asset"
            label={`${t<string>('labels.clawbackAccount')}:`}
            network={network}
          />
        )}

        {/*freeze address*/}
        {transaction.assetFreeze && (
          <SignTxnsAddressItem
            address={encodeAddress(transaction.assetFreeze.publicKey)}
            ariaLabel="The freeze account for the new asset"
            label={`${t<string>('labels.freezeAccount')}:`}
            network={network}
          />
        )}

        {/*manager address*/}
        {transaction.assetManager && (
          <SignTxnsAddressItem
            address={encodeAddress(transaction.assetManager.publicKey)}
            ariaLabel="The manager account for the new asset"
            label={`${t<string>('labels.managerAccount')}:`}
            network={network}
          />
        )}

        {/*reserve address*/}
        {transaction.assetReserve && (
          <SignTxnsAddressItem
            address={encodeAddress(transaction.assetReserve.publicKey)}
            ariaLabel="The reserve account for the new asset"
            label={`${t<string>('labels.reserveAccount')}:`}
            network={network}
          />
        )}

        {/*url*/}
        {transaction.assetURL && (
          <HStack spacing={0} w="full">
            <ModalTextItem
              isCode={true}
              label={`${t<string>('labels.url')}:`}
              value={transaction.assetURL}
            />
            <OpenTabIconButton
              size="xs"
              tooltipLabel={t<string>('captions.openUrl')}
              url={transaction.assetURL}
            />
          </HStack>
        )}

        {/*note*/}
        {transaction.note && transaction.note.length > 0 && (
          <ModalTextItem
            isCode={true}
            label={`${t<string>('labels.note')}:`}
            value={new TextDecoder().decode(transaction.note)}
          />
        )}
      </>
    );
  };

  if (loading || !fromAccount) {
    return (
      <VStack
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={2}
        w="full"
      >
        <ModalSkeletonItem />
        <ModalSkeletonItem />
        <ModalSkeletonItem />
      </VStack>
    );
  }

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={condensed ? 2 : 4}
      w="full"
    >
      {/*heading*/}
      <Text color={defaultTextColor} fontSize="md" textAlign="left" w="full">
        {t<string>('headings.transaction', {
          context: transactionType,
        })}
      </Text>

      {/*asset name*/}
      {transaction.assetName && (
        <ModalTextItem
          label={`${t<string>('labels.name')}:`}
          value={transaction.assetName}
        />
      )}

      {/*creator*/}
      <SignTxnsAddressItem
        address={fromAddress}
        ariaLabel="Creator address (from)"
        label={`${t<string>('labels.creatorAccount')}:`}
        network={network}
      />

      {condensed ? (
        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="xs"
          isOpen={condensed.expanded}
          onChange={condensed.onChange}
        >
          <VStack spacing={2} w="full">
            {renderExtraInformation()}
          </VStack>
        </MoreInformationAccordion>
      ) : (
        renderExtraInformation()
      )}
    </VStack>
  );
};

export default AssetCreateTransactionContent;
