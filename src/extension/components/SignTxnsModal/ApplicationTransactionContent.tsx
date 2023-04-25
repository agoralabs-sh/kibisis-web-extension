import { HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoInformationCircleOutline } from 'react-icons/io5';

// Components
import CopyIconButton from '@extension/components/CopyIconButton';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import { useSelectPreferredBlockExplorer } from '@extension/selectors';

// Types
import { IExplorer, INetwork } from '@extension/types';
import { ICondensedProps } from './types';

// Utils
import { createIconFromDataUri, parseTransactionType } from '@extension/utils';

interface IProps {
  condensed?: ICondensedProps;
  network: INetwork;
  transaction: Transaction;
}

const ApplicationTransactionContent: FC<IProps> = ({
  condensed,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const preferredExplorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  const icon: ReactNode = createIconFromDataUri(
    network.nativeCurrency.iconUri,
    {
      color: subTextColor,
      h: 3,
      w: 3,
    }
  );
  const transactionType: TransactionTypeEnum =
    parseTransactionType(transaction);
  const renderExtraInformation = () => (
    <>
      {/* Fee */}
      <SignTxnsAssetItem
        atomicUnitsAmount={new BigNumber(String(transaction.fee))}
        decimals={network.nativeCurrency.decimals}
        icon={icon}
        label={`${t<string>('labels.fee')}:`}
        unit={network.nativeCurrency.code}
      />

      {/* Type */}
      <HStack
        alignItems="center"
        justifyContent="flex-end"
        spacing={1}
        w="full"
      >
        <SignTxnsTextItem
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

      {/*Note*/}
      {transaction.note && transaction.note.length > 0 && (
        <SignTxnsTextItem
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
      spacing={condensed ? 2 : 4}
      w="full"
    >
      {/*Heading*/}
      <Text color={defaultTextColor} fontSize="md" textAlign="left" w="full">
        {t<string>('headings.transaction', {
          context: parseTransactionType(transaction),
        })}
      </Text>

      {/*App ID*/}
      {transaction.appIndex && (
        <HStack spacing={0} w="full">
          <SignTxnsTextItem
            flexGrow={1}
            label={`${t<string>('labels.id')}:`}
            value={transaction.appIndex.toString()}
          />
          <CopyIconButton
            ariaLabel={`Copy ${transaction.appIndex}`}
            value={transaction.appIndex.toString()}
          />
          {explorer && (
            <OpenTabIconButton
              tooltipLabel={t<string>('captions.openOn', {
                name: explorer.canonicalName,
              })}
              url={`${explorer.baseUrl}${explorer.applicationPath}/${transaction.appIndex}`}
            />
          )}
        </HStack>
      )}

      {/* From */}
      <SignTxnsAddressItem
        address={encodeAddress(transaction.from.publicKey)}
        ariaLabel="From address"
        label={`${t<string>('labels.from')}:`}
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

export default ApplicationTransactionContent;
