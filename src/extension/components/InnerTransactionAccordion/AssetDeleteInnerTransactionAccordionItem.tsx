import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Code,
  HStack,
  ResponsiveValue,
  Text,
  VStack,
} from '@chakra-ui/react';
import * as CSS from 'csstype';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import CopyIconButton from '@extension/components/CopyIconButton';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageItem from '@extension/components/PageItem';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// types
import {
  IAccount,
  IAssetDestroyTransaction,
  IExplorer,
  INetwork,
} from '@extension/types';

// utils
import isAccountKnown from '@extension/utils/isAccountKnown';

interface IProps {
  color?: ResponsiveValue<CSS.Property.Color>;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  minButtonHeight?: ResponsiveValue<number | CSS.Property.MinHeight>;
  network: INetwork;
  transaction: IAssetDestroyTransaction;
}

const AssetDeleteInnerTransactionAccordionItem: FC<IProps> = ({
  color,
  fontSize,
  minButtonHeight,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const preferredExplorer: IExplorer | null = useSelectPreferredBlockExplorer();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one

  return (
    <AccordionItem border="none" px={3} py={2} w="full">
      <AccordionButton minH={minButtonHeight} p={0}>
        {/*type*/}
        <Text color={color || defaultTextColor} fontSize={fontSize}>
          {t<string>('headings.transaction', { context: transaction.type })}
        </Text>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={0} pt={2} px={0}>
        <VStack spacing={2} w="full">
          {/*asset id*/}
          <PageItem fontSize="xs" label={t<string>('labels.assetId')}>
            <HStack spacing={0}>
              <Text color={subTextColor} fontSize="xs">
                {transaction.assetId}
              </Text>
              <CopyIconButton
                ariaLabel="Copy asset ID"
                copiedTooltipLabel={t<string>('captions.assetIdCopied')}
                size="xs"
                value={transaction.assetId}
              />
              {explorer && (
                <OpenTabIconButton
                  size="xs"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.assetPath}/${transaction.assetId}`}
                />
              )}
            </HStack>
          </PageItem>

          {/*creator address*/}
          <PageItem fontSize="xs" label={t<string>('labels.creatorAccount')}>
            <HStack spacing={0}>
              <AddressDisplay
                address={transaction.creator}
                ariaLabel="Creator address"
                color={subTextColor}
                fontSize="xs"
                network={network}
              />

              {/*open in explorer button*/}
              {!isAccountKnown(accounts, transaction.creator) && explorer && (
                <OpenTabIconButton
                  size="xs"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.creator}`}
                />
              )}
            </HStack>
          </PageItem>

          {/*note*/}
          {transaction.note && (
            <PageItem fontSize="xs" label={t<string>('labels.note')}>
              <Code
                borderRadius="md"
                color={defaultTextColor}
                fontSize="xs"
                wordBreak="break-word"
              >
                {transaction.note}
              </Code>
            </PageItem>
          )}
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default AssetDeleteInnerTransactionAccordionItem;
