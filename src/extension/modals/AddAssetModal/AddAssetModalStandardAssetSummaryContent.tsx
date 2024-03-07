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
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetDisplay from '@extension/components/AssetDisplay';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import InfoIconTooltip from '@extension/components/InfoIconTooltip';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageItem, { ITEM_HEIGHT } from '@extension/components/PageItem';
import Warning from '@extension/components/Warning';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useAddAssetStandardAssetSummaryContent from './hooks/useAddAssetStandardAssetSummaryContent';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAddAssetModalStandardAssetSummaryContentProps } from './types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import isAccountKnown from '@extension/utils/isAccountKnown';

const AddAssetModalStandardAssetSummaryContent: FC<
  IAddAssetModalStandardAssetSummaryContentProps
> = ({ account, accounts, asset, blockExplorer, network }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // hooks
  const {
    accountBalanceInAtomicUnits,
    minimumBalanceRequirementInAtomicUnits,
    minimumTransactionFeesInAtomicUnits,
  } = useAddAssetStandardAssetSummaryContent({
    account,
    network,
  });
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const accountAddress: string =
    AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);
  const totalSupplyInStandardUnits: BigNumber = convertToStandardUnit(
    new BigNumber(asset.total),
    asset.decimals
  );
  const isEnoughMinimumBalance: boolean = accountBalanceInAtomicUnits.gte(
    minimumBalanceRequirementInAtomicUnits.plus(
      minimumTransactionFeesInAtomicUnits
    )
  );
  // handlers
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onOpen() : onClose();

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      px={DEFAULT_GAP}
      spacing={DEFAULT_GAP - 2}
      w="full"
    >
      <VStack
        alignItems="center"
        justifyContent="flex-start"
        spacing={1}
        w="full"
      >
        {/*asset icon*/}
        <AssetAvatar
          asset={asset}
          fallbackIcon={
            <AssetIcon
              color={primaryButtonTextColor}
              networkTheme={network.chakraTheme}
              h={6}
              w={6}
            />
          }
          size="md"
        />

        {/*unit*/}
        {asset.unitName && (
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {asset.unitName}
          </Text>
        )}

        <VStack
          alignItems="flex-start"
          justifyContent="flex-start"
          spacing={DEFAULT_GAP - 2}
          w="full"
        >
          {/*not enough funds warning*/}
          {!isEnoughMinimumBalance && (
            <Warning
              message={t<string>('captions.minimumBalanceTooLow', {
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
                      minimumTransactionFeesInAtomicUnits
                    ),
                    network.nativeCurrency.decimals
                  ),
                  {
                    decimals: network.nativeCurrency.decimals,
                  }
                ),
                symbol: network.nativeCurrency.symbol,
              })}
              size="sm"
            />
          )}

          {/*asset id*/}
          <PageItem fontSize="sm" label={t<string>('labels.assetId')}>
            <HStack spacing={0}>
              <Text color={subTextColor} fontSize="sm">
                {asset.id}
              </Text>

              <CopyIconButton
                ariaLabel={t<string>('labels.copyAssetId')}
                tooltipLabel={t<string>('labels.copyAssetId')}
                size="sm"
                value={asset.id}
              />

              {blockExplorer && (
                <OpenTabIconButton
                  size="sm"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: blockExplorer.canonicalName,
                  })}
                  url={`${blockExplorer.baseUrl}${blockExplorer.assetPath}/${asset.id}`}
                />
              )}
            </HStack>
          </PageItem>

          {/*account*/}
          <PageItem fontSize="sm" label={t<string>('labels.account')}>
            <HStack spacing={0}>
              <AddressDisplay
                address={accountAddress}
                ariaLabel="Accoun to add the standard asset to"
                color={subTextColor}
                fontSize="sm"
                network={network}
              />

              {/*open in explorer button*/}
              {blockExplorer && (
                <OpenTabIconButton
                  size="sm"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: blockExplorer.canonicalName,
                  })}
                  url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${accountAddress}`}
                />
              )}
            </HStack>
          </PageItem>

          {/*name*/}
          {asset.name && (
            <PageItem fontSize="sm" label={t<string>('labels.name')}>
              <Tooltip aria-label="Asset full name" label={asset.name}>
                <Text
                  color={subTextColor}
                  fontSize="sm"
                  maxW={150}
                  noOfLines={1}
                >
                  {asset.name}
                </Text>
              </Tooltip>
            </PageItem>
          )}

          {/*url*/}
          {asset.url && (
            <PageItem fontSize="sm" label={t<string>('labels.url')}>
              <HStack spacing={0}>
                <Code
                  borderRadius="md"
                  color={defaultTextColor}
                  fontSize="sm"
                  wordBreak="break-word"
                >
                  {asset.url}
                </Code>

                <OpenTabIconButton
                  size="sm"
                  tooltipLabel={t<string>('captions.openUrl')}
                  url={asset.url}
                />
              </HStack>
            </PageItem>
          )}

          {/*type*/}
          <PageItem fontSize="sm" label={t<string>('labels.type')}>
            <AssetBadge type={AssetTypeEnum.Standard} />
          </PageItem>

          {/*fee*/}
          <PageItem fontSize="sm" label={t<string>('labels.fee')}>
            <HStack spacing={1}>
              {/*fee display*/}
              <AssetDisplay
                atomicUnitAmount={minimumTransactionFeesInAtomicUnits}
                amountColor={subTextColor}
                decimals={network.nativeCurrency.decimals}
                fontSize="sm"
                icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
                  color: subTextColor,
                  h: 3,
                  w: 3,
                })}
                unit={network.nativeCurrency.symbol}
              />

              {/*info*/}
              <InfoIconTooltip
                color={subTextColor}
                label={t<string>('captions.optInFee')}
              />
            </HStack>
          </PageItem>

          <MoreInformationAccordion
            color={defaultTextColor}
            fontSize="sm"
            isOpen={isOpen}
            minButtonHeight={ITEM_HEIGHT}
            onChange={handleMoreInformationToggle}
          >
            <VStack spacing={DEFAULT_GAP - 2} w="full">
              {/*decimals*/}
              <PageItem fontSize="sm" label={t<string>('labels.decimals')}>
                <Text color={subTextColor} fontSize="sm">
                  {asset.decimals.toString()}
                </Text>
              </PageItem>

              {/*total supply*/}
              <PageItem fontSize="sm" label={t<string>('labels.totalSupply')}>
                <Tooltip
                  aria-label="Asset amount with unrestricted decimals"
                  label={formatCurrencyUnit(totalSupplyInStandardUnits, {
                    decimals: asset.decimals,
                    thousandSeparatedOnly: true,
                  })}
                >
                  <Text color={subTextColor} fontSize="sm">
                    {formatCurrencyUnit(totalSupplyInStandardUnits, {
                      decimals: asset.decimals,
                    })}
                  </Text>
                </Tooltip>
              </PageItem>

              {/*creator account*/}
              <PageItem
                fontSize="sm"
                label={t<string>('labels.creatorAccount')}
              >
                <HStack spacing={0}>
                  <AddressDisplay
                    address={asset.creator}
                    ariaLabel="Creator address"
                    color={subTextColor}
                    fontSize="sm"
                    network={network}
                  />

                  {/*open in explorer button*/}
                  {!isAccountKnown(accounts, asset.creator) &&
                    blockExplorer && (
                      <OpenTabIconButton
                        size="sm"
                        tooltipLabel={t<string>('captions.openOn', {
                          name: blockExplorer.canonicalName,
                        })}
                        url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${asset.creator}`}
                      />
                    )}
                </HStack>
              </PageItem>

              {/*default frozen*/}
              <PageItem fontSize="sm" label={t<string>('labels.defaultFrozen')}>
                <Text color={subTextColor} fontSize="sm">
                  {asset.defaultFrozen
                    ? t<string>('labels.yes')
                    : t<string>('labels.no')}
                </Text>
              </PageItem>

              {/*clawback address*/}
              {asset.clawbackAddress && (
                <PageItem
                  fontSize="sm"
                  label={t<string>('labels.clawbackAccount')}
                >
                  <HStack spacing={0}>
                    <AddressDisplay
                      address={asset.clawbackAddress}
                      ariaLabel="Clawback address"
                      color={subTextColor}
                      fontSize="sm"
                      network={network}
                    />

                    {/*open in explorer button*/}
                    {!isAccountKnown(accounts, asset.clawbackAddress) &&
                      blockExplorer && (
                        <OpenTabIconButton
                          size="sm"
                          tooltipLabel={t<string>('captions.openOn', {
                            name: blockExplorer.canonicalName,
                          })}
                          url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${asset.clawbackAddress}`}
                        />
                      )}
                  </HStack>
                </PageItem>
              )}

              {/*freeze address*/}
              {asset.freezeAddress && (
                <PageItem
                  fontSize="sm"
                  label={t<string>('labels.freezeAccount')}
                >
                  <HStack spacing={0}>
                    <AddressDisplay
                      address={asset.freezeAddress}
                      ariaLabel="Freeze address"
                      color={subTextColor}
                      fontSize="sm"
                      network={network}
                    />

                    {/*open in explorer button*/}
                    {!isAccountKnown(accounts, asset.freezeAddress) &&
                      blockExplorer && (
                        <OpenTabIconButton
                          size="sm"
                          tooltipLabel={t<string>('captions.openOn', {
                            name: blockExplorer.canonicalName,
                          })}
                          url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${asset.freezeAddress}`}
                        />
                      )}
                  </HStack>
                </PageItem>
              )}

              {/*manager address*/}
              {asset.managerAddress && (
                <PageItem
                  fontSize="sm"
                  label={t<string>('labels.managerAccount')}
                >
                  <HStack spacing={0}>
                    <AddressDisplay
                      address={asset.managerAddress}
                      ariaLabel="Manager address"
                      color={subTextColor}
                      fontSize="sm"
                      network={network}
                    />

                    {/*open in explorer button*/}
                    {!isAccountKnown(accounts, asset.managerAddress) &&
                      blockExplorer && (
                        <OpenTabIconButton
                          size="sm"
                          tooltipLabel={t<string>('captions.openOn', {
                            name: blockExplorer.canonicalName,
                          })}
                          url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${asset.managerAddress}`}
                        />
                      )}
                  </HStack>
                </PageItem>
              )}

              {/*reserve address*/}
              {asset.reserveAddress && (
                <PageItem
                  fontSize="sm"
                  label={t<string>('labels.reserveAccount')}
                >
                  <HStack spacing={0}>
                    <AddressDisplay
                      address={asset.reserveAddress}
                      ariaLabel="Reserve address"
                      color={subTextColor}
                      fontSize="sm"
                      network={network}
                    />

                    {/*open in explorer button*/}
                    {!isAccountKnown(accounts, asset.reserveAddress) &&
                      blockExplorer && (
                        <OpenTabIconButton
                          size="sm"
                          tooltipLabel={t<string>('captions.openOn', {
                            name: blockExplorer.canonicalName,
                          })}
                          url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${asset.reserveAddress}`}
                        />
                      )}
                  </HStack>
                </PageItem>
              )}
            </VStack>
          </MoreInformationAccordion>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default AddAssetModalStandardAssetSummaryContent;
