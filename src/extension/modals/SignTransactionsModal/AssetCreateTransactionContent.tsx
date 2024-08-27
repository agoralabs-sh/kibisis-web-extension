import { HStack, Text, VStack } from '@chakra-ui/react';
import { encodeAddress } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import NetworkBadge from '@extension/components/NetworkBadge';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { ITransactionBodyProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';

const AssetCreateTransactionContent: FC<ITransactionBodyProps> = ({
  accounts,
  condensed,
  fromAccount,
  hideNetwork = false,
  loading = false,
  network,
  transaction,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const feeAsAtomicUnit = new BigNumber(
    transaction.fee ? String(transaction.fee) : '0'
  );
  const fromAddress = encodeAddress(transaction.from.publicKey);
  const transactionType = parseTransactionType(
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
        <ModalAssetItem
          amountInAtomicUnits={feeAsAtomicUnit}
          decimals={network.nativeCurrency.decimals}
          icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          label={`${t<string>('labels.fee')}:`}
          unit={network.nativeCurrency.symbol}
        />

        {/*network*/}
        {!hideNetwork && (
          <ModalItem
            label={`${t<string>('labels.network')}:`}
            value={<NetworkBadge network={network} size="xs" />}
          />
        )}

        {/*total supply*/}
        <ModalAssetItem
          amountInAtomicUnits={new BigNumber(String(transaction.assetTotal))}
          decimals={transaction.assetDecimals}
          displayUnit={false}
          icon={null}
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
          <ModalItem
            label={`${t<string>('labels.clawbackAccount')}:`}
            value={
              <AddressDisplay
                accounts={accounts}
                address={encodeAddress(transaction.assetClawback.publicKey)}
                ariaLabel="The clawback account for the new asset"
                size="sm"
                network={network}
              />
            }
          />
        )}

        {/*freeze address*/}
        {transaction.assetFreeze && (
          <ModalItem
            label={`${t<string>('labels.freezeAccount')}:`}
            value={
              <AddressDisplay
                accounts={accounts}
                address={encodeAddress(transaction.assetFreeze.publicKey)}
                ariaLabel="The freeze account for the new asset"
                size="sm"
                network={network}
              />
            }
          />
        )}

        {/*manager address*/}
        {transaction.assetManager && (
          <ModalItem
            label={`${t<string>('labels.managerAccount')}:`}
            value={
              <AddressDisplay
                accounts={accounts}
                address={encodeAddress(transaction.assetManager.publicKey)}
                ariaLabel="The manager account for the new asset"
                size="sm"
                network={network}
              />
            }
          />
        )}

        {/*reserve address*/}
        {transaction.assetReserve && (
          <ModalItem
            label={`${t<string>('labels.reserveAccount')}:`}
            value={
              <AddressDisplay
                accounts={accounts}
                address={encodeAddress(transaction.assetReserve.publicKey)}
                ariaLabel="The reserve account for the new asset"
                size="sm"
                network={network}
              />
            }
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
        spacing={DEFAULT_GAP / 3}
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
      spacing={DEFAULT_GAP / 3}
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
      <ModalItem
        label={`${t<string>('labels.creatorAccount')}:`}
        value={
          <AddressDisplay
            accounts={accounts}
            address={fromAddress}
            ariaLabel="Creator address (from)"
            size="sm"
            network={network}
          />
        }
      />

      {condensed ? (
        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="xs"
          isOpen={condensed.expanded}
          onChange={condensed.onChange}
        >
          <VStack spacing={DEFAULT_GAP / 3} w="full">
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
