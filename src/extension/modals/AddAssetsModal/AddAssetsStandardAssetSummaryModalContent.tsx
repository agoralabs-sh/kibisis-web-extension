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
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import InfoIconTooltip from '@extension/components/InfoIconTooltip';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import Warning from '@extension/components/Warning';

// constants
import { DEFAULT_GAP, MODAL_ITEM_HEIGHT } from '@extension/constants';

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
import type { IAddAssetsModalStandardAssetSummaryContentProps } from './types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import isAccountKnown from '@extension/utils/isAccountKnown';

const AddAssetsStandardAssetSummaryModalContent: FC<
  IAddAssetsModalStandardAssetSummaryContentProps
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
    new BigNumber(asset.totalSupply),
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

        <VStack
          alignItems="flex-start"
          justifyContent="flex-start"
          spacing={0}
          w="full"
        >
          {/*asset id*/}
          <HStack spacing={1} w="full">
            <ModalTextItem
              flexGrow={1}
              label={`${t<string>('labels.assetId')}:`}
              value={asset.id}
            />

            <CopyIconButton
              ariaLabel={t<string>('labels.copyAssetId')}
              tooltipLabel={t<string>('labels.copyAssetId')}
              value={asset.id}
            />

            {blockExplorer && (
              <OpenTabIconButton
                tooltipLabel={t<string>('captions.openOn', {
                  name: blockExplorer.canonicalName,
                })}
                url={`${blockExplorer.baseUrl}${blockExplorer.assetPath}/${asset.id}`}
              />
            )}
          </HStack>

          {/*account*/}
          <HStack spacing={1} w="full">
            <ModalItem
              flexGrow={1}
              label={`${t<string>('labels.account')}:`}
              value={
                <AddressDisplay
                  address={accountAddress}
                  ariaLabel="Accoun to add the standard asset to"
                  color={subTextColor}
                  fontSize="sm"
                  network={network}
                />
              }
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

          {/*name*/}
          {asset.name && (
            <ModalTextItem
              label={`${t<string>('labels.name')}:`}
              tooltipLabel={asset.name}
              value={asset.name}
            />
          )}

          {/*url*/}
          {asset.url && (
            <HStack spacing={1} w="full">
              <ModalTextItem
                flexGrow={1}
                isCode={true}
                label={`${t<string>('labels.url')}:`}
                value={asset.url}
              />

              <OpenTabIconButton
                size="sm"
                tooltipLabel={t<string>('captions.openUrl')}
                url={asset.url}
              />
            </HStack>
          )}

          {/*type*/}
          <ModalItem
            label={`${t<string>('labels.type')}:`}
            value={<AssetBadge type={AssetTypeEnum.Standard} />}
          />

          {/*fee*/}
          <HStack spacing={1} w="full">
            <ModalAssetItem
              amountInAtomicUnits={minimumTransactionFeesInAtomicUnits}
              decimals={network.nativeCurrency.decimals}
              icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
                color: subTextColor,
                h: 3,
                w: 3,
              })}
              label={`${t<string>('labels.fee')}:`}
            />

            {/*info*/}
            <InfoIconTooltip
              color={subTextColor}
              label={t<string>('captions.optInFee')}
            />
          </HStack>

          <MoreInformationAccordion
            color={defaultTextColor}
            fontSize="xs"
            isOpen={isOpen}
            minButtonHeight={MODAL_ITEM_HEIGHT}
            onChange={handleMoreInformationToggle}
          >
            <VStack spacing={0} w="full">
              {/*decimals*/}
              <ModalTextItem
                label={`${t<string>('labels.decimals')}:`}
                value={asset.decimals.toString()}
              />

              {/*total supply*/}
              <ModalTextItem
                label={`${t<string>('labels.totalSupply')}:`}
                tooltipLabel={formatCurrencyUnit(totalSupplyInStandardUnits, {
                  decimals: asset.decimals,
                  thousandSeparatedOnly: true,
                })}
                value={formatCurrencyUnit(totalSupplyInStandardUnits, {
                  decimals: asset.decimals,
                })}
              />

              {/*default frozen*/}
              <ModalTextItem
                label={`${t<string>('labels.defaultFrozen')}:`}
                value={
                  asset.defaultFrozen
                    ? t<string>('labels.yes')
                    : t<string>('labels.no')
                }
              />

              {/*creator account*/}
              <HStack spacing={1} w="full">
                <ModalItem
                  flexGrow={1}
                  label={`${t<string>('labels.creatorAccount')}:`}
                  value={
                    <AddressDisplay
                      address={asset.creator}
                      ariaLabel="Creator address"
                      color={subTextColor}
                      fontSize="sm"
                      network={network}
                    />
                  }
                />

                {/*open in explorer button*/}
                {!isAccountKnown(accounts, asset.creator) && blockExplorer && (
                  <OpenTabIconButton
                    tooltipLabel={t<string>('captions.openOn', {
                      name: blockExplorer.canonicalName,
                    })}
                    url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${asset.creator}`}
                  />
                )}
              </HStack>

              {/*clawback address*/}
              {asset.clawbackAddress && (
                <HStack spacing={1} w="full">
                  <ModalItem
                    flexGrow={1}
                    label={`${t<string>('labels.clawbackAccount')}:`}
                    value={
                      <AddressDisplay
                        address={asset.clawbackAddress}
                        ariaLabel="Clawback address"
                        color={subTextColor}
                        fontSize="sm"
                        network={network}
                      />
                    }
                  />

                  {/*open in explorer button*/}
                  {!isAccountKnown(accounts, asset.clawbackAddress) &&
                    blockExplorer && (
                      <OpenTabIconButton
                        tooltipLabel={t<string>('captions.openOn', {
                          name: blockExplorer.canonicalName,
                        })}
                        url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${asset.clawbackAddress}`}
                      />
                    )}
                </HStack>
              )}

              {/*freeze address*/}
              {asset.freezeAddress && (
                <HStack spacing={1} w="full">
                  <ModalItem
                    flexGrow={1}
                    label={`${t<string>('labels.freezeAccount')}:`}
                    value={
                      <AddressDisplay
                        address={asset.freezeAddress}
                        ariaLabel="Freeze address"
                        color={subTextColor}
                        fontSize="sm"
                        network={network}
                      />
                    }
                  />

                  {/*open in explorer button*/}
                  {!isAccountKnown(accounts, asset.freezeAddress) &&
                    blockExplorer && (
                      <OpenTabIconButton
                        tooltipLabel={t<string>('captions.openOn', {
                          name: blockExplorer.canonicalName,
                        })}
                        url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${asset.freezeAddress}`}
                      />
                    )}
                </HStack>
              )}

              {/*manager address*/}
              {asset.managerAddress && (
                <HStack spacing={1} w="full">
                  <ModalItem
                    flexGrow={1}
                    label={`${t<string>('labels.managerAccount')}:`}
                    value={
                      <AddressDisplay
                        address={asset.managerAddress}
                        ariaLabel="Manager address"
                        color={subTextColor}
                        fontSize="sm"
                        network={network}
                      />
                    }
                  />

                  {/*open in explorer button*/}
                  {!isAccountKnown(accounts, asset.managerAddress) &&
                    blockExplorer && (
                      <OpenTabIconButton
                        tooltipLabel={t<string>('captions.openOn', {
                          name: blockExplorer.canonicalName,
                        })}
                        url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${asset.managerAddress}`}
                      />
                    )}
                </HStack>
              )}

              {/*reserve address*/}
              {asset.reserveAddress && (
                <HStack spacing={1} w="full">
                  <ModalItem
                    flexGrow={1}
                    label={`${t<string>('labels.reserveAccount')}:`}
                    value={
                      <AddressDisplay
                        address={asset.reserveAddress}
                        ariaLabel="Reserve address"
                        color={subTextColor}
                        fontSize="sm"
                        network={network}
                      />
                    }
                  />

                  {/*open in explorer button*/}
                  {!isAccountKnown(accounts, asset.reserveAddress) &&
                    blockExplorer && (
                      <OpenTabIconButton
                        tooltipLabel={t<string>('captions.openOn', {
                          name: blockExplorer.canonicalName,
                        })}
                        url={`${blockExplorer.baseUrl}${blockExplorer.accountPath}/${asset.reserveAddress}`}
                      />
                    )}
                </HStack>
              )}
            </VStack>
          </MoreInformationAccordion>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default AddAssetsStandardAssetSummaryModalContent;
