import {
  Code,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AssetDisplay from '@extension/components/AssetDisplay';
import CopyIconButton from '@extension/components/CopyIconButton';
import InnerTransactionAccordion from '@extension/components/InnerTransactionAccordion';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageHeader from '@extension/components/PageHeader';
import PageItem from '@extension/components/PageItem';

// constants
import { DEFAULT_GAP, PAGE_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectSettingsPreferredBlockExplorer } from '@extension/selectors';

// types
import type { IApplicationTransaction } from '@extension/types';
import type { IProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import ellipseAddress from '@extension/utils/ellipseAddress';

const ApplicationTransactionPage: FC<IProps<IApplicationTransaction>> = ({
  account,
  network,
  transaction,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // selectors
  const explorer = useSelectSettingsPreferredBlockExplorer();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // state
  const [openInnerTransactionAccordions, setOpenInnerTransactionAccordions] =
    useState<boolean[]>(
      Array.from(
        { length: transaction.innerTransactions?.length || 0 },
        () => false
      )
    );
  // handlers
  const handleInnerTransactionsAccordionToggle =
    (accordionIndex: number) => (open: boolean) => {
      setOpenInnerTransactionAccordions(
        openInnerTransactionAccordions.map((value, index) =>
          index === accordionIndex ? open : value
        )
      );
    };
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onOpen() : onClose();

  return (
    <>
      <PageHeader
        title={t<string>('headings.transaction', { context: transaction.type })}
      />

      <VStack
        alignItems="flex-start"
        justifyContent="flex-start"
        px={DEFAULT_GAP}
        spacing={4}
        w="full"
      >
        {/*app id*/}
        {transaction.applicationId && (
          <PageItem fontSize="sm" label={t<string>('labels.applicationId')}>
            <HStack spacing={0}>
              <Text color={subTextColor} fontSize="sm">
                {transaction.applicationId}
              </Text>
              <CopyIconButton
                ariaLabel={t<string>('labels.copyApplicationId')}
                tooltipLabel={t<string>('labels.copyApplicationId')}
                size="sm"
                value={transaction.applicationId}
              />
              {explorer && (
                <OpenTabIconButton
                  size="sm"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.applicationPath}/${transaction.applicationId}`}
                />
              )}
            </HStack>
          </PageItem>
        )}

        {/*fee*/}
        <PageItem fontSize="sm" label={t<string>('labels.fee')}>
          <AssetDisplay
            atomicUnitAmount={new BigNumber(transaction.fee)}
            amountColor="red.500"
            decimals={network.nativeCurrency.decimals}
            fontSize="sm"
            icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
              color: subTextColor,
              h: 3,
              w: 3,
            })}
            prefix="-"
            unit={network.nativeCurrency.symbol}
          />
        </PageItem>

        {/*completed date*/}
        {transaction.completedAt && (
          <PageItem fontSize="sm" label={t<string>('labels.date')}>
            <Text color={subTextColor} fontSize="sm">
              {new Date(transaction.completedAt).toLocaleString()}
            </Text>
          </PageItem>
        )}

        {/*note*/}
        {transaction.note && (
          <PageItem fontSize="sm" label={t<string>('labels.note')}>
            <Code
              borderRadius="md"
              color={defaultTextColor}
              fontSize="sm"
              wordBreak="break-word"
            >
              {transaction.note}
            </Code>
          </PageItem>
        )}

        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="sm"
          isOpen={isOpen}
          minButtonHeight={PAGE_ITEM_HEIGHT}
          onChange={handleMoreInformationToggle}
        >
          <VStack spacing={4} w="full">
            {/*id*/}
            <PageItem fontSize="sm" label={t<string>('labels.id')}>
              {transaction.id ? (
                <HStack spacing={0}>
                  <Tooltip
                    aria-label="The ID of the transaction"
                    label={transaction.id}
                  >
                    <Text color={subTextColor} fontSize="sm">
                      {ellipseAddress(transaction.id, {
                        end: 10,
                        start: 10,
                      })}
                    </Text>
                  </Tooltip>
                  <CopyIconButton
                    ariaLabel={t<string>('labels.copyTransactionId')}
                    tooltipLabel={t<string>('labels.copyTransactionId')}
                    size="sm"
                    value={transaction.id}
                  />
                  {explorer && (
                    <OpenTabIconButton
                      size="sm"
                      tooltipLabel={t<string>('captions.openOn', {
                        name: explorer.canonicalName,
                      })}
                      url={`${explorer.baseUrl}${explorer.transactionPath}/${transaction.id}`}
                    />
                  )}
                </HStack>
              ) : (
                <Text color={subTextColor} fontSize="sm">
                  {'-'}
                </Text>
              )}
            </PageItem>

            {/*group id*/}
            {transaction.groupId && (
              <PageItem fontSize="sm" label={t<string>('labels.groupId')}>
                <HStack spacing={0}>
                  <Tooltip
                    aria-label="The group ID of the transaction"
                    label={transaction.groupId}
                  >
                    <Text color={subTextColor} fontSize="sm">
                      {ellipseAddress(transaction.groupId, {
                        end: 10,
                        start: 10,
                      })}
                    </Text>
                  </Tooltip>
                  <CopyIconButton
                    ariaLabel={t<string>('labels.copyGroupId')}
                    tooltipLabel={t<string>('labels.copyGroupId')}
                    size="sm"
                    value={transaction.groupId}
                  />
                  {explorer && explorer.groupPath && (
                    <OpenTabIconButton
                      size="sm"
                      tooltipLabel={t<string>('captions.openOn', {
                        name: explorer.canonicalName,
                      })}
                      url={`${explorer.baseUrl}${
                        explorer.groupPath
                      }/${encodeURIComponent(transaction.groupId)}`}
                    />
                  )}
                </HStack>
              </PageItem>
            )}
          </VStack>
        </MoreInformationAccordion>
      </VStack>

      {/*inner transactions*/}
      {transaction.innerTransactions && (
        <Tabs
          colorScheme={primaryColorScheme}
          m={0}
          sx={{ display: 'flex', flexDirection: 'column' }}
          w="full"
        >
          <TabList>
            <Tab>{t<string>('labels.innerTransactions')}</Tab>
          </TabList>
          <TabPanels
            flexGrow={1}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <TabPanel
              m={0}
              p={0}
              sx={{ display: 'flex', flexDirection: 'column' }}
              w="full"
            >
              <VStack pb={DEFAULT_GAP} pt={0} px={0} spacing={0} w="full">
                {transaction.innerTransactions.map((value, index) => (
                  <InnerTransactionAccordion
                    account={account}
                    color={defaultTextColor}
                    fontSize="sm"
                    isOpen={openInnerTransactionAccordions[index]}
                    key={`transaction-page-application-inner-transaction-item-${index}`}
                    minButtonHeight={PAGE_ITEM_HEIGHT}
                    network={network}
                    onChange={handleInnerTransactionsAccordionToggle(index)}
                    transaction={value}
                  />
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </>
  );
};

export default ApplicationTransactionPage;
