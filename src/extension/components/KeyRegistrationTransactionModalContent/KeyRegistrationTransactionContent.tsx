import { Text, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import { encodeAddress } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import ChainBadge from '@extension/components/ChainBadge';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useMinimumBalanceRequirementsForTransactions from '@extension/hooks/useMinimumBalanceRequirementsForTransactions';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';

const KeyRegistrationTransactionContent: FC<IProps> = ({
  account,
  condensed,
  network,
  showHeader = false,
  transaction,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    accountBalanceInAtomicUnits,
    minimumBalanceRequirementInAtomicUnits,
    totalCostInAtomicUnits,
  } = useMinimumBalanceRequirementsForTransactions({
    account,
    network,
    transactions: [transaction],
  });
  const subTextColor = useSubTextColor();
  // misc
  const feeAsAtomicUnit = new BigNumber(
    transaction.fee ? String(transaction.fee) : network.minFee
  );
  const isBelowMinimumBalance = accountBalanceInAtomicUnits
    .minus(totalCostInAtomicUnits)
    .lt(minimumBalanceRequirementInAtomicUnits);
  const transactionType: TransactionTypeEnum = parseTransactionType(
    transaction.get_obj_for_encoding(),
    {
      network,
      sender: account,
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
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      {/*heading*/}
      {showHeader && (
        <Text color={defaultTextColor} fontSize="md" textAlign="left" w="full">
          {t<string>('headings.transaction', {
            context: transactionType,
          })}
        </Text>
      )}

      {/*account*/}
      <ModalItem
        label={`${t<string>('labels.account')}:`}
        tooltipLabel={encodeAddress(transaction.from.publicKey)}
        value={
          <AddressDisplay
            address={encodeAddress(transaction.from.publicKey)}
            network={network}
          />
        }
      />

      {/*network*/}
      <ModalItem
        label={`${t<string>('labels.network')}:`}
        value={<ChainBadge network={network} />}
      />

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
        {...(isBelowMinimumBalance && {
          warningLabel: t<string>('captions.minimumBalanceTooLow', {
            balance: formatCurrencyUnit(
              convertToStandardUnit(
                accountBalanceInAtomicUnits,
                network.nativeCurrency.decimals
              ),
              {
                decimals: network.nativeCurrency.decimals,
              }
            ),
            cost: formatCurrencyUnit(
              convertToStandardUnit(
                minimumBalanceRequirementInAtomicUnits.plus(
                  totalCostInAtomicUnits
                ),
                network.nativeCurrency.decimals
              ),
              {
                decimals: network.nativeCurrency.decimals,
              }
            ),
            symbol: network.nativeCurrency.symbol,
          }),
        })}
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
