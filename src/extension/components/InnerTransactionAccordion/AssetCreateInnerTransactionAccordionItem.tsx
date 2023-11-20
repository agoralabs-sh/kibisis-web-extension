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
import BigNumber from 'bignumber.js';
import * as CSS from 'csstype';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';
import AssetIcon from '@extension/components/AssetIcon';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageItem from '@extension/components/PageItem';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// types
import {
  IAccount,
  IAssetCreateTransaction,
  IExplorer,
  INetwork,
} from '@extension/types';

// utils
import { isAccountKnown } from '@extension/utils';

interface IProps {
  color?: ResponsiveValue<CSS.Property.Color>;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  minButtonHeight?: ResponsiveValue<number | CSS.Property.MinHeight>;
  network: INetwork;
  transaction: IAssetCreateTransaction;
}

const AssetCreateInnerTransactionAccordionItem: FC<IProps> = ({
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
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
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
          {/*asset name*/}
          {transaction.name && (
            <PageItem fontSize="xs" label={t<string>('labels.name')}>
              <Text color={subTextColor} fontSize="xs">
                {transaction.name}
              </Text>
            </PageItem>
          )}

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

          {/*total supply*/}
          <PageItem fontSize="xs" label={t<string>('labels.totalSupply')}>
            <AssetDisplay
              amountColor={subTextColor}
              atomicUnitAmount={new BigNumber(transaction.total)}
              decimals={transaction.decimals}
              displayUnit={true}
              displayUnitColor={subTextColor}
              fontSize="xs"
              icon={
                <AssetIcon
                  color={primaryButtonTextColor}
                  networkTheme={network.chakraTheme}
                  h={3}
                  w={3}
                />
              }
              unit={transaction.unitName || undefined}
            />
          </PageItem>

          {/*decimals*/}
          <PageItem fontSize="xs" label={t<string>('labels.decimals')}>
            <Text color={subTextColor} fontSize="xs">
              {transaction.decimals.toString()}
            </Text>
          </PageItem>

          {/*default frozen*/}
          <PageItem fontSize="xs" label={t<string>('labels.defaultFrozen')}>
            <Text color={subTextColor} fontSize="xs">
              {transaction.defaultFrozen
                ? t<string>('labels.yes')
                : t<string>('labels.no')}
            </Text>
          </PageItem>

          {/*url*/}
          {transaction.url && (
            <PageItem fontSize="xs" label={t<string>('labels.url')}>
              <HStack spacing={0}>
                <Code
                  borderRadius="md"
                  color={defaultTextColor}
                  fontSize="xs"
                  wordBreak="break-word"
                >
                  {transaction.url}
                </Code>
                <OpenTabIconButton
                  size="xs"
                  tooltipLabel={t<string>('captions.openUrl')}
                  url={transaction.url}
                />
              </HStack>
            </PageItem>
          )}

          {/*unit name*/}
          {transaction.unitName && (
            <PageItem fontSize="xs" label={t<string>('labels.unitName')}>
              <Text color={subTextColor} fontSize="xs">
                {transaction.unitName}
              </Text>
            </PageItem>
          )}

          {/*clawback address*/}
          {transaction.clawback && (
            <PageItem fontSize="xs" label={t<string>('labels.clawbackAccount')}>
              <HStack spacing={0}>
                <AddressDisplay
                  address={transaction.clawback}
                  ariaLabel="Clawback address"
                  color={subTextColor}
                  fontSize="xs"
                  network={network}
                />

                {/*open in explorer button*/}
                {!isAccountKnown(accounts, transaction.clawback) &&
                  explorer && (
                    <OpenTabIconButton
                      size="xs"
                      tooltipLabel={t<string>('captions.openOn', {
                        name: explorer.canonicalName,
                      })}
                      url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.clawback}`}
                    />
                  )}
              </HStack>
            </PageItem>
          )}

          {/*freeze address*/}
          {transaction.freeze && (
            <PageItem fontSize="xs" label={t<string>('labels.freezeAccount')}>
              <HStack spacing={0}>
                <AddressDisplay
                  address={transaction.freeze}
                  ariaLabel="Freeze address"
                  color={subTextColor}
                  fontSize="xs"
                  network={network}
                />

                {/*open in explorer button*/}
                {!isAccountKnown(accounts, transaction.freeze) && explorer && (
                  <OpenTabIconButton
                    size="xs"
                    tooltipLabel={t<string>('captions.openOn', {
                      name: explorer.canonicalName,
                    })}
                    url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.freeze}`}
                  />
                )}
              </HStack>
            </PageItem>
          )}

          {/*manager address*/}
          {transaction.manager && (
            <PageItem fontSize="xs" label={t<string>('labels.managerAccount')}>
              <HStack spacing={0}>
                <AddressDisplay
                  address={transaction.manager}
                  ariaLabel="Manager address"
                  color={subTextColor}
                  fontSize="xs"
                  network={network}
                />

                {/*open in explorer button*/}
                {!isAccountKnown(accounts, transaction.manager) && explorer && (
                  <OpenTabIconButton
                    size="xs"
                    tooltipLabel={t<string>('captions.openOn', {
                      name: explorer.canonicalName,
                    })}
                    url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.manager}`}
                  />
                )}
              </HStack>
            </PageItem>
          )}

          {/*reserve address*/}
          {transaction.reserve && (
            <PageItem fontSize="xs" label={t<string>('labels.reserveAccount')}>
              <HStack spacing={0}>
                <AddressDisplay
                  address={transaction.reserve}
                  ariaLabel="Reserve address"
                  color={subTextColor}
                  fontSize="xs"
                  network={network}
                />

                {/*open in explorer button*/}
                {!isAccountKnown(accounts, transaction.reserve) && explorer && (
                  <OpenTabIconButton
                    size="xs"
                    tooltipLabel={t<string>('captions.openOn', {
                      name: explorer.canonicalName,
                    })}
                    url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.reserve}`}
                  />
                )}
              </HStack>
            </PageItem>
          )}

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

export default AssetCreateInnerTransactionAccordionItem;
