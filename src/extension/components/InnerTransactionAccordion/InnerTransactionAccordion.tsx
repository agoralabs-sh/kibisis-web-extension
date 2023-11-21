import { Accordion, ResponsiveValue } from '@chakra-ui/react';
import * as CSS from 'csstype';
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
import { IAccount, INetwork, ITransactions } from '@extension/types';

interface IProps {
  account: IAccount;
  color?: ResponsiveValue<CSS.Property.Color>;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  isOpen: boolean;
  minButtonHeight?: ResponsiveValue<number | CSS.Property.MinHeight>;
  network: INetwork;
  onChange: (open: boolean) => void;
  transaction: ITransactions;
}

const InnerTransactionAccordion: FC<IProps> = ({
  account,
  color,
  fontSize,
  isOpen,
  minButtonHeight,
  network,
  onChange,
  transaction,
}: IProps) => {
  // handlers
  const handleOnChange = (value: number) => onChange(value > -1);
  const renderAccordionItem = () => {
    switch (transaction.type) {
      case TransactionTypeEnum.AssetConfig:
        return (
          <AssetConfigInnerTransactionAccordionItem
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
