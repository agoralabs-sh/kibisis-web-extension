import { Accordion, ResponsiveValue } from '@chakra-ui/react';
import * as CSS from 'csstype';
import React, { FC } from 'react';

// Components
import AssetTransferInnerTransactionAccordionItem from './AssetTransferInnerTransactionAccordionItem';
import DefaultInnerTransactionAccordionItem from './DefaultInnerTransactionAccordionItem';
import PaymentInnerTransactionAccordionItem from './PaymentInnerTransactionAccordionItem';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
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
            account={account}
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
