import {
  Code,
  HStack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageHeader from '@extension/components/PageHeader';
import PageItem from '@extension/components/PageItem';

// constants
import { DEFAULT_GAP, PAGE_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectSettingsPreferredBlockExplorer,
} from '@extension/selectors';

// types
import type { IAssetCreateTransaction } from '@extension/types';
import type { IContentProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import ellipseAddress from '@extension/utils/ellipseAddress';
import isAccountKnown from '@extension/utils/isAccountKnown';

const AssetCreateTransactionPage: FC<
  IContentProps<IAssetCreateTransaction>
> = ({ network, transaction }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  const explorer = useSelectSettingsPreferredBlockExplorer();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // handlers
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
        {/*asset name*/}
        {transaction.name && (
          <PageItem fontSize="sm" label={t<string>('labels.name')}>
            <Text color={subTextColor} fontSize="sm">
              {transaction.name}
            </Text>
          </PageItem>
        )}

        {/*creator address*/}
        <PageItem fontSize="sm" label={t<string>('labels.creatorAccount')}>
          <HStack spacing={0}>
            <AddressDisplay
              address={transaction.creator}
              ariaLabel="Creator address"
              color={subTextColor}
              fontSize="sm"
              network={network}
            />

            {/*open in explorer button*/}
            {!isAccountKnown(accounts, transaction.creator) && explorer && (
              <OpenTabIconButton
                size="sm"
                tooltipLabel={t<string>('captions.openOn', {
                  name: explorer.canonicalName,
                })}
                url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.creator}`}
              />
            )}
          </HStack>
        </PageItem>

        {/*total supply*/}
        <PageItem fontSize="sm" label={t<string>('labels.totalSupply')}>
          <AssetDisplay
            amountColor={subTextColor}
            atomicUnitAmount={new BigNumber(transaction.total)}
            decimals={transaction.decimals}
            displayUnit={true}
            displayUnitColor={subTextColor}
            fontSize="sm"
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
        <PageItem fontSize="sm" label={t<string>('labels.decimals')}>
          <Text color={subTextColor} fontSize="sm">
            {transaction.decimals.toString()}
          </Text>
        </PageItem>

        {/*default frozen*/}
        <PageItem fontSize="sm" label={t<string>('labels.defaultFrozen')}>
          <Text color={subTextColor} fontSize="sm">
            {transaction.defaultFrozen
              ? t<string>('labels.yes')
              : t<string>('labels.no')}
          </Text>
        </PageItem>

        {/*url*/}
        {transaction.url && (
          <PageItem fontSize="sm" label={t<string>('labels.url')}>
            <HStack spacing={0}>
              <Code
                borderRadius="md"
                color={defaultTextColor}
                fontSize="sm"
                wordBreak="break-word"
              >
                {transaction.url}
              </Code>
              <OpenTabIconButton
                size="sm"
                tooltipLabel={t<string>('captions.openUrl')}
                url={transaction.url}
              />
            </HStack>
          </PageItem>
        )}

        {/*unit name*/}
        {transaction.unitName && (
          <PageItem fontSize="sm" label={t<string>('labels.unitName')}>
            <Text color={subTextColor} fontSize="sm">
              {transaction.unitName}
            </Text>
          </PageItem>
        )}

        {/*clawback address*/}
        {transaction.clawback && (
          <PageItem fontSize="sm" label={t<string>('labels.clawbackAccount')}>
            <HStack spacing={0}>
              <AddressDisplay
                address={transaction.clawback}
                ariaLabel="Clawback address"
                color={subTextColor}
                fontSize="sm"
                network={network}
              />

              {/*open in explorer button*/}
              {!isAccountKnown(accounts, transaction.clawback) && explorer && (
                <OpenTabIconButton
                  size="sm"
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
          <PageItem fontSize="sm" label={t<string>('labels.freezeAccount')}>
            <HStack spacing={0}>
              <AddressDisplay
                address={transaction.freeze}
                ariaLabel="Freeze address"
                color={subTextColor}
                fontSize="sm"
                network={network}
              />

              {/*open in explorer button*/}
              {!isAccountKnown(accounts, transaction.freeze) && explorer && (
                <OpenTabIconButton
                  size="sm"
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
          <PageItem fontSize="sm" label={t<string>('labels.managerAccount')}>
            <HStack spacing={0}>
              <AddressDisplay
                address={transaction.manager}
                ariaLabel="Manager address"
                color={subTextColor}
                fontSize="sm"
                network={network}
              />

              {/*open in explorer button*/}
              {!isAccountKnown(accounts, transaction.manager) && explorer && (
                <OpenTabIconButton
                  size="sm"
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
          <PageItem fontSize="sm" label={t<string>('labels.reserveAccount')}>
            <HStack spacing={0}>
              <AddressDisplay
                address={transaction.reserve}
                ariaLabel="Reserve address"
                color={subTextColor}
                fontSize="sm"
                network={network}
              />

              {/*open in explorer button*/}
              {!isAccountKnown(accounts, transaction.reserve) && explorer && (
                <OpenTabIconButton
                  size="sm"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.reserve}`}
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
    </>
  );
};

export default AssetCreateTransactionPage;
