import { HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoInformationCircleOutline } from 'react-icons/io5';

// components
import CopyIconButton from '@extension/components/CopyIconButton';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import Warning from '@extension/components/Warning';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import { IExplorer, INetwork } from '@extension/types';
import { ICondensedProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';

interface IProps {
  condensed?: ICondensedProps;
  explorer: IExplorer;
  network: INetwork;
  transaction: Transaction;
}

const ApplicationTransactionContent: FC<IProps> = ({
  condensed,
  explorer,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const icon: ReactNode = createIconFromDataUri(
    network.nativeCurrency.iconUrl,
    {
      color: subTextColor,
      h: 3,
      w: 3,
    }
  );
  const transactionType: TransactionTypeEnum = parseTransactionType(
    transaction.get_obj_for_encoding()
  );
  const renderExtraInformation = () => (
    <>
      {/* Fee */}
      <SignTxnsAssetItem
        atomicUnitAmount={new BigNumber(String(transaction.fee))}
        decimals={network.nativeCurrency.decimals}
        icon={icon}
        label={`${t<string>('labels.fee')}:`}
        unit={network.nativeCurrency.symbol}
      />

      {/* Type */}
      <HStack
        alignItems="center"
        justifyContent="flex-end"
        spacing={1}
        w="full"
      >
        <SignTxnsTextItem
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

      {/*Note*/}
      {transaction.note && transaction.note.length > 0 && (
        <SignTxnsTextItem
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
      spacing={condensed ? 2 : 4}
      w="full"
    >
      {/*Heading*/}
      <Text color={defaultTextColor} fontSize="md" textAlign="left" w="full">
        {t<string>('headings.transaction', {
          context: transactionType,
        })}
      </Text>

      {transactionType === TransactionTypeEnum.ApplicationDelete && (
        <Warning message={t<string>('captions.deleteApplication')} size="xs" />
      )}

      {/*App ID*/}
      {transaction.appIndex && (
        <HStack spacing={0} w="full">
          <SignTxnsTextItem
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

          {explorer && (
            <OpenTabIconButton
              size="xs"
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

export default ApplicationTransactionContent;
