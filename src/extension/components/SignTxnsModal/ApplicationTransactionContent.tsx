import { Heading, HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress, OnApplicationComplete, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import CopyIconButton from '@extension/components/CopyIconButton';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// Hooks
import useAccount from '@extension/hooks/useAccount';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import { useSelectPreferredBlockExplorer } from '@extension/selectors';

// Types
import { IExplorer, INativeCurrency, INetwork } from '@extension/types';

// Utils
import {
  computeApplicationOnComplete,
  createIconFromDataUri,
} from '@extension/utils';
import { formatCurrencyUnit } from '@common/utils';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface IProps {
  nativeCurrency: INativeCurrency;
  network: INetwork;
  transaction: Transaction;
}

const ApplicationTransactionContent: FC<IProps> = ({
  nativeCurrency,
  network,
  transaction,
}: IProps) => {
  const fromAddress: string = encodeAddress(transaction.from.publicKey);
  const { t } = useTranslation();
  const { account: fromAccount, fetching: fetchingAccountInformation } =
    useAccount({
      address: fromAddress,
      network,
    });
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const preferredExplorer: IExplorer | null = useSelectPreferredBlockExplorer();
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  const icon: ReactNode = createIconFromDataUri(nativeCurrency.iconUri, {
    color: subTextColor,
    h: 3,
    w: 3,
  });
  const appOnComplete: OnApplicationComplete | null =
    computeApplicationOnComplete(transaction);
  const getHeadingContext = () => {
    switch (appOnComplete) {
      case OnApplicationComplete.ClearStateOC:
      case OnApplicationComplete.CloseOutOC:
      case OnApplicationComplete.NoOpOC:
      case OnApplicationComplete.OptInOC:
        return transaction.type;
      case OnApplicationComplete.DeleteApplicationOC:
        return 'appDelete';
      case OnApplicationComplete.UpdateApplicationOC:
        return 'appUpdate';
      default:
        return 'appCreate';
    }
  };

  return (
    <VStack spacing={4} w="full">
      {/*Transaction heading*/}
      <Heading color={defaultTextColor} size="md" textAlign="center" w="full">
        {t<string>('headings.transaction', { context: getHeadingContext() })}
      </Heading>

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

      {/* Fee */}
      <SignTxnsAssetItem
        atomicUnitsAmount={new BigNumber(String(transaction.fee))}
        decimals={nativeCurrency.decimals}
        icon={icon}
        label={`${t<string>('labels.fee')}:`}
        unit={nativeCurrency.code}
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
          value={t<string>('values.appOnComplete', { context: appOnComplete })}
        />
        <Tooltip
          aria-label="Application description"
          label={t<string>('captions.appOnComplete', {
            context: appOnComplete,
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
    </VStack>
  );
};

export default ApplicationTransactionContent;
