import { HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoInformationCircleOutline } from 'react-icons/io5';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import ChainBadge from '@extension/components/ChainBadge';
import CopyIconButton from '@extension/components/CopyIconButton';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import Warning from '@extension/components/Warning';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { ITransactionBodyProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';

const ApplicationTransactionContent: FC<ITransactionBodyProps> = ({
  accounts,
  blockExplorer,
  condensed,
  hideNetwork = false,
  loading,
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
  const transactionType = parseTransactionType(
    transaction.get_obj_for_encoding()
  );
  const renderExtraInformation = () => (
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
        isLoading={loading}
        label={`${t<string>('labels.fee')}:`}
        unit={network.nativeCurrency.symbol}
      />

      {/*type*/}
      <HStack
        alignItems="center"
        justifyContent="flex-end"
        spacing={1}
        w="full"
      >
        <ModalTextItem
          isCode={true}
          label={`${t<string>('labels.type')}:`}
          value={t<string>('values.appOnComplete', {
            context: transactionType,
          })}
        />

        <Tooltip
          aria-label="Application description"
          label={t<string>('captions.appOnComplete', {
            context: transactionType,
          })}
        >
          <span
            style={{
              height: '1em',
              lineHeight: '1em',
            }}
          >
            <Icon as={IoInformationCircleOutline} color={defaultTextColor} />
          </span>
        </Tooltip>
      </HStack>

      {/*network*/}
      {!hideNetwork && (
        <ModalItem
          label={`${t<string>('labels.network')}:`}
          value={<ChainBadge network={network} size="sm" />}
        />
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

      {transactionType === TransactionTypeEnum.ApplicationDelete && (
        <Warning message={t<string>('captions.deleteApplication')} size="xs" />
      )}

      {/*app id*/}
      {transaction.appIndex && (
        <HStack spacing={0} w="full">
          <ModalTextItem
            flexGrow={1}
            isCode={true}
            label={`${t<string>('labels.id')}:`}
            value={transaction.appIndex.toString()}
          />

          <CopyIconButton
            ariaLabel={t<string>('labels.copyValue', {
              value: transaction.appIndex,
            })}
            tooltipLabel={t<string>('labels.copyValue', {
              value: transaction.appIndex,
            })}
            size="xs"
            value={transaction.appIndex.toString()}
          />

          {blockExplorer && (
            <OpenTabIconButton
              size="xs"
              tooltipLabel={t<string>('captions.openOn', {
                name: blockExplorer.canonicalName,
              })}
              url={blockExplorer.applicationURL(String(transaction.appIndex))}
            />
          )}
        </HStack>
      )}

      {/*from*/}
      <ModalItem
        label={`${t<string>('labels.from')}:`}
        value={
          <AddressDisplay
            accounts={accounts}
            address={encodeAddress(transaction.from.publicKey)}
            ariaLabel="From address"
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

export default ApplicationTransactionContent;
