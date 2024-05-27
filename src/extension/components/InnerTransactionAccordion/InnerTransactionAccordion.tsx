import { Accordion } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import AssetConfigInnerTransactionAccordionItem from './AssetConfigInnerTransactionAccordionItem';
import AssetCreateInnerTransactionAccordionItem from './AssetCreateInnerTransactionAccordionItem';
import AssetDeleteInnerTransactionAccordionItem from './AssetDeleteInnerTransactionAccordionItem';
import AssetFreezeInnerTransactionAccordionItem from './AssetFreezeInnerTransactionAccordionItem';
import AssetTransferInnerTransactionAccordionItem from './AssetTransferInnerTransactionAccordionItem';
import DefaultInnerTransactionAccordionItem from './DefaultInnerTransactionAccordionItem';
import PaymentInnerTransactionAccordionItem from './PaymentInnerTransactionAccordionItem';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import type { IProps } from './types';

const InnerTransactionAccordion: FC<IProps> = ({
  account,
  accounts,
  color,
  fontSize,
  isOpen,
  minButtonHeight,
  network,
  onChange,
  transaction,
}) => {
  // handlers
  const handleOnChange = (value: number) => onChange(value > -1);
  const renderAccordionItem = () => {
    switch (transaction.type) {
      case TransactionTypeEnum.AssetConfig:
        return (
          <AssetConfigInnerTransactionAccordionItem
            account={account}
            accounts={accounts}
            color={color}
            fontSize={fontSize}
            minButtonHeight={minButtonHeight}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AssetCreate:
        return (
          <AssetCreateInnerTransactionAccordionItem
            account={account}
            accounts={accounts}
            color={color}
            fontSize={fontSize}
            minButtonHeight={minButtonHeight}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AssetDestroy:
        return (
          <AssetDeleteInnerTransactionAccordionItem
            account={account}
            accounts={accounts}
            color={color}
            fontSize={fontSize}
            minButtonHeight={minButtonHeight}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AssetFreeze:
      case TransactionTypeEnum.AssetUnfreeze:
        return (
          <AssetFreezeInnerTransactionAccordionItem
            account={account}
            accounts={accounts}
            color={color}
            fontSize={fontSize}
            minButtonHeight={minButtonHeight}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.AssetTransfer:
        return (
          <AssetTransferInnerTransactionAccordionItem
            account={account}
            accounts={accounts}
            color={color}
            fontSize={fontSize}
            minButtonHeight={minButtonHeight}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionTypeEnum.Payment:
        return (
          <PaymentInnerTransactionAccordionItem
            account={account}
            accounts={accounts}
            color={color}
            fontSize={fontSize}
            minButtonHeight={minButtonHeight}
            network={network}
            transaction={transaction}
          />
        );
      default:
        return (
          <DefaultInnerTransactionAccordionItem
            account={account}
            accounts={accounts}
            color={color}
            fontSize={fontSize}
            minButtonHeight={minButtonHeight}
            network={network}
            transaction={transaction}
          />
        );
    }
  };

  return (
    <Accordion
      allowToggle={true}
      index={isOpen ? 0 : -1}
      onChange={handleOnChange}
      w="full"
    >
      {renderAccordionItem()}
    </Accordion>
  );
};

export default InnerTransactionAccordion;
