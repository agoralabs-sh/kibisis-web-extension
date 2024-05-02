import { Text, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// components
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
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
import ModalItem from '@extension/components/ModalItem';
import ChainBadge from '@extension/components/ChainBadge';
import { DEFAULT_GAP } from '@extension/constants';

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
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const feeAsAtomicUnit: BigNumber = new BigNumber(
    transaction.fee ? String(transaction.fee) : '0'
  );
  const icon: ReactNode = createIconFromDataUri(
    network.nativeCurrency.iconUrl,
    {
      color: subTextColor,
      h: 3,
      w: 3,
    }
  );
  const transactionType: TransactionTypeEnum = parseTransactionType(
    transaction.get_obj_for_encoding(),
    {
      network,
      sender: fromAccount,
    }
  );
  // renders
  const renderExtraInformation = () => (
    <>
      {transactionType === TransactionTypeEnum.KeyRegistrationOnline && (
        <>
          {/*selection key*/}
          {transaction.selectionKey && (
            <ModalTextItem
              isCode={true}
              label={`${t<string>('labels.selectionKey')}:`}
              value={encodeBase64(transaction.selectionKey)}
            />
          )}

          {/*state proof key*/}
          {transaction.stateProofKey && (
            <ModalTextItem
              isCode={true}
              label={`${t<string>('labels.stateProofKey')}:`}
              value={encodeBase64(transaction.stateProofKey)}
            />
          )}

          {/*vote key dilution*/}
          {transaction.voteKeyDilution && (
            <ModalTextItem
              label={`${t<string>('labels.voteKeyDilution')}:`}
              value={String(transaction.voteKeyDilution)}
            />
          )}

          {/*first round*/}
          {transaction.voteFirst && (
            <ModalTextItem
              label={`${t<string>('labels.firstRound')}:`}
              value={String(transaction.voteFirst)}
            />
          )}

          {/*last round*/}
          {transaction.voteLast && (
            <ModalTextItem
              label={`${t<string>('labels.lastRound')}:`}
              value={String(transaction.voteLast)}
            />
          )}
        </>
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

      {/*account*/}
      <SignTxnsAddressItem
        address={encodeAddress(transaction.from.publicKey)}
        ariaLabel="Account"
        label={`${t<string>('labels.account')}:`}
        network={network}
      />

      {/*network*/}
      <ModalItem
        label={`${t<string>('labels.network')}:`}
        value={<ChainBadge network={network} />}
      />

      {/*fee*/}
      <SignTxnsAssetItem
        atomicUnitAmount={feeAsAtomicUnit}
        decimals={network.nativeCurrency.decimals}
        icon={icon}
        label={`${t<string>('labels.fee')}:`}
        unit={network.nativeCurrency.symbol}
      />

      {/*vote key*/}
      {transaction.voteKey && (
        <ModalTextItem
          isCode={true}
          label={`${t<string>('labels.voteKey')}:`}
          value={encodeBase64(transaction.voteKey)}
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

export default KeyRegistrationTransactionContent;
