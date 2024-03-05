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
  useSelectSettingsPreferredBlockExplorer,
} from '@extension/selectors';

// types
import {
  IAccount,
  IAssetConfigTransaction,
  IBlockExplorer,
  INetwork,
} from '@extension/types';

// utils
import isAccountKnown from '@extension/utils/isAccountKnown';

interface IProps {
  color?: ResponsiveValue<CSS.Property.Color>;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  minButtonHeight?: ResponsiveValue<number | CSS.Property.MinHeight>;
  network: INetwork;
  transaction: IAssetConfigTransaction;
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
  const preferredExplorer: IBlockExplorer | null =
    useSelectSettingsPreferredBlockExplorer();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const explorer: IBlockExplorer | null =
    network.blockExplorers.find(
      (value) => value.id === preferredExplorer?.id
    ) ||
    network.blockExplorers[0] ||
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
                ariaLabel={t<string>('labels.copyAssetId')}
                tooltipLabel={t<string>('labels.copyAssetId')}
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
