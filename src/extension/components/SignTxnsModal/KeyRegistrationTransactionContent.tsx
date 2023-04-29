import { Text, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Types
import { IAccount, INetwork } from '@extension/types';
import { ICondensedProps } from './types';

// Utils
import { createIconFromDataUri, parseTransactionType } from '@extension/utils';

interface IProps {
  condensed?: ICondensedProps;
  fromAccount: IAccount | null;
  network: INetwork;
  transaction: Transaction;
}

const KeyRegistrationTransactionContent: FC<IProps> = ({
  condensed,
  fromAccount,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const icon: ReactNode = createIconFromDataUri(
    network.nativeCurrency.iconUri,
    {
      color: subTextColor,
      h: 3,
      w: 3,
    }
  );
  const transactionType: TransactionTypeEnum = parseTransactionType(
    transaction,
    {
      network,
      sender: fromAccount,
    }
  );
  const renderExtraInformation = () => (
    <>
      {/*fee*/}
      <SignTxnsAssetItem
        atomicUnitAmount={new BigNumber(String(transaction.fee))}
        decimals={network.nativeCurrency.decimals}
        icon={icon}
        label={`${t<string>('labels.fee')}:`}
        unit={network.nativeCurrency.code}
      />

      {transactionType === TransactionTypeEnum.KeyRegistrationOnline && (
        <>
          {/*vote key*/}
          {transaction.voteKey && (
            <SignTxnsTextItem
              isCode={true}
              label={`${t<string>('labels.voteKey')}:`}
              value={encodeBase64(transaction.voteKey)}
            />
          )}

          {/*vote key dilution*/}
          {transaction.voteKeyDilution && (
            <SignTxnsTextItem
              label={`${t<string>('labels.voteKeyDilution')}:`}
              value={String(transaction.voteKeyDilution)}
            />
          )}

          {/*selection key*/}
          {transaction.selectionKey && (
            <SignTxnsTextItem
              isCode={true}
              label={`${t<string>('labels.selectionKey')}:`}
              value={encodeBase64(transaction.selectionKey)}
            />
          )}

          {/*state proof key*/}
          {transaction.stateProofKey && (
            <SignTxnsTextItem
              isCode={true}
              label={`${t<string>('labels.stateProofKey')}:`}
              value={encodeBase64(transaction.stateProofKey)}
            />
          )}

          {/*first round*/}
          {transaction.voteFirst && (
            <SignTxnsTextItem
              label={`${t<string>('labels.firstRound')}:`}
              value={String(transaction.voteFirst)}
            />
          )}

          {/*last round*/}
          {transaction.voteLast && (
            <SignTxnsTextItem
              label={`${t<string>('labels.lastRound')}:`}
              value={String(transaction.voteLast)}
            />
          )}
        </>
      )}

      {/*note*/}
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
      {/*heading*/}
      <Text color={defaultTextColor} fontSize="md" textAlign="left" w="full">
        {t<string>('headings.transaction', {
          context: transactionType,
        })}
      </Text>

      {/*from*/}
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

export default KeyRegistrationTransactionContent;
