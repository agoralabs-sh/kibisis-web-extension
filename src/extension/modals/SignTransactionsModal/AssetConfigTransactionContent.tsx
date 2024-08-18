import { HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWarningOutline } from 'react-icons/io5';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import NetworkBadge from '@extension/components/NetworkBadge';
import CopyIconButton from '@extension/components/CopyIconButton';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import Warning from '@extension/components/Warning';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IAssetTransactionBodyProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';

const AssetConfigTransactionContent: FC<IAssetTransactionBodyProps> = ({
  accounts,
  asset,
  condensed,
  blockExplorer,
  fromAccount,
  hideNetwork = false,
  loading = false,
  network,
  transaction,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const feeAsAtomicUnit = new BigNumber(
    transaction.fee ? String(transaction.fee) : '0'
  );
  const fromAddress = encodeAddress(transaction.from.publicKey);
  const transactionType = parseTransactionType(
    transaction.get_obj_for_encoding(),
    {
      network,
      sender: fromAccount,
    }
  );
  // renders
  const renderExtraInformation = (icon: ReactNode) => {
    if (!asset) {
      return null;
    }

    return (
      <>
        {/*fee*/}
        <ModalAssetItem
          amountInAtomicUnits={feeAsAtomicUnit}
          decimals={network.nativeCurrency.decimals}
          icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          label={`${t<string>('labels.fee')}:`}
          unit={network.nativeCurrency.symbol}
        />

        {/*network*/}
        {!hideNetwork && (
          <ModalItem
            label={`${t<string>('labels.network')}:`}
            value={<NetworkBadge network={network} size="sm" />}
          />
        )}

        {transactionType === TransactionTypeEnum.AssetConfig && (
          <>
            {/*clawback address*/}
            {transaction.assetClawback && asset.clawbackAddress && (
              <ModalItem
                label={`${t<string>('labels.clawbackAccount')}:`}
                value={
                  <HStack spacing={DEFAULT_GAP / 3}>
                    {asset.clawbackAddress !==
                    encodeAddress(transaction.assetClawback.publicKey) ? (
                      <>
                        <AddressDisplay
                          accounts={accounts}
                          address={asset.clawbackAddress}
                          ariaLabel="Current clawback address"
                          size="sm"
                          network={network}
                        />

                        <Text color={subTextColor} fontSize="xs">{`>`}</Text>

                        <AddressDisplay
                          accounts={accounts}
                          address={encodeAddress(
                            transaction.assetClawback.publicKey
                          )}
                          ariaLabel="New clawback address"
                          size="sm"
                          network={network}
                        />
                      </>
                    ) : (
                      <AddressDisplay
                        accounts={accounts}
                        address={asset.clawbackAddress}
                        ariaLabel="Current clawback address"
                        size="sm"
                        network={network}
                      />
                    )}
                  </HStack>
                }
              />
            )}

            {/*freeze address*/}
            {transaction.assetFreeze && asset.freezeAddress && (
              <ModalItem
                label={`${t<string>('labels.freezeAccount')}:`}
                value={
                  <HStack spacing={DEFAULT_GAP / 3}>
                    {asset.freezeAddress !==
                    encodeAddress(transaction.assetFreeze.publicKey) ? (
                      <>
                        <AddressDisplay
                          accounts={accounts}
                          address={asset.freezeAddress}
                          ariaLabel="Current freeze address"
                          size="sm"
                          network={network}
                        />

                        <Text color={subTextColor} fontSize="xs">{`>`}</Text>

                        <AddressDisplay
                          accounts={accounts}
                          address={encodeAddress(
                            transaction.assetFreeze.publicKey
                          )}
                          ariaLabel="New freeze address"
                          size="sm"
                          network={network}
                        />
                      </>
                    ) : (
                      <AddressDisplay
                        accounts={accounts}
                        address={asset.freezeAddress}
                        ariaLabel="Current freeze address"
                        size="sm"
                        network={network}
                      />
                    )}
                  </HStack>
                }
              />
            )}

            {/*manager address*/}
            {transaction.assetManager && asset.managerAddress && (
              <ModalItem
                label={`${t<string>('labels.managerAccount')}:`}
                value={
                  <HStack spacing={DEFAULT_GAP / 3}>
                    {asset.managerAddress !==
                    encodeAddress(transaction.assetManager.publicKey) ? (
                      <>
                        <AddressDisplay
                          accounts={accounts}
                          address={asset.managerAddress}
                          ariaLabel="Current manager address"
                          size="sm"
                          network={network}
                        />

                        <Text color={subTextColor} fontSize="xs">{`>`}</Text>

                        <AddressDisplay
                          accounts={accounts}
                          address={encodeAddress(
                            transaction.assetManager.publicKey
                          )}
                          ariaLabel="New manager address"
                          size="sm"
                          network={network}
                        />
                      </>
                    ) : (
                      <AddressDisplay
                        accounts={accounts}
                        address={asset.managerAddress}
                        ariaLabel="Current manager address"
                        size="sm"
                        network={network}
                      />
                    )}
                  </HStack>
                }
              />
            )}

            {/*reserve address*/}
            {transaction.assetReserve && asset.reserveAddress && (
              <ModalItem
                label={`${t<string>('labels.reserveAccount')}:`}
                value={
                  <HStack spacing={DEFAULT_GAP / 3}>
                    {asset.reserveAddress !==
                    encodeAddress(transaction.assetReserve.publicKey) ? (
                      <>
                        <AddressDisplay
                          accounts={accounts}
                          address={asset.reserveAddress}
                          ariaLabel="Current reserve address"
                          size="sm"
                          network={network}
                        />

                        <Text color={subTextColor} fontSize="xs">{`>`}</Text>

                        <AddressDisplay
                          accounts={accounts}
                          address={encodeAddress(
                            transaction.assetReserve.publicKey
                          )}
                          ariaLabel="New reserve address"
                          size="sm"
                          network={network}
                        />
                      </>
                    ) : (
                      <AddressDisplay
                        accounts={accounts}
                        address={asset.reserveAddress}
                        ariaLabel="Current reserve address"
                        size="sm"
                        network={network}
                      />
                    )}
                  </HStack>
                }
              />
            )}
          </>
        )}

        {transactionType === TransactionTypeEnum.AssetDestroy && (
          <>
            {/*total supply*/}
            <ModalAssetItem
              amountInAtomicUnits={new BigNumber(asset.totalSupply)}
              decimals={asset.decimals}
              displayUnit={true}
              icon={icon}
              isLoading={loading}
              label={`${t<string>('labels.totalSupply')}:`}
              unit={asset.unitName || undefined}
            />
          </>
        )}

        {/*note*/}
        {transaction.note && transaction.note.length > 0 && (
          <ModalTextItem
            isCode={true}
            label={`${t<string>('labels.note')}:`}
            value={new TextDecoder().decode(transaction.note)}
          />
        )}
      </>
    );
  };
  let assetIcon: ReactNode;

  if (loading || !fromAccount || !asset) {
    return (
      <VStack
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        <ModalSkeletonItem />
        <ModalSkeletonItem />
        <ModalSkeletonItem />
      </VStack>
    );
  }

  assetIcon = (
    <AssetAvatar
      asset={asset}
      fallbackIcon={
        <AssetIcon
          color={primaryButtonTextColor}
          networkTheme={network.chakraTheme}
          h={3}
          w={3}
        />
      }
      size="2xs"
    />
  );

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      {/*heading*/}
      <Text color={defaultTextColor} fontSize="md" textAlign="left" w="full">
        {t<string>('headings.transaction', {
          context: transactionType,
        })}
      </Text>

      {transactionType === TransactionTypeEnum.AssetDestroy && (
        <Warning message={t<string>('captions.destroyAsset')} size="xs" />
      )}

      {/*asset name*/}
      {asset.name && (
        <ModalTextItem
          label={`${t<string>('labels.name')}:`}
          value={asset.name}
        />
      )}

      {/*asset id*/}
      <HStack spacing={0} w="full">
        <ModalTextItem
          flexGrow={1}
          isCode={true}
          label={`${t<string>('labels.id')}:`}
          value={asset.id}
        />

        <CopyIconButton
          ariaLabel={t<string>('labels.copyValue', { value: asset.id })}
          tooltipLabel={t<string>('labels.copyValue', { value: asset.id })}
          size="xs"
          value={asset.id}
        />

        {blockExplorer && (
          <OpenTabIconButton
            size="xs"
            tooltipLabel={t<string>('captions.openOn', {
              name: blockExplorer.canonicalName,
            })}
            url={blockExplorer.assetURL(asset.id)}
          />
        )}
      </HStack>

      {/*manager*/}
      {fromAddress !== asset.managerAddress ? (
        <HStack
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
          w="full"
        >
          <ModalItem
            label={`${t<string>('labels.managerAccount')}:`}
            value={
              <AddressDisplay
                accounts={accounts}
                address={fromAddress}
                ariaLabel="Manager address (from)"
                size="sm"
                network={network}
              />
            }
          />

          <Tooltip
            aria-label="Manager address does not match the asset's manager address"
            label={t<string>('captions.managerAddressDoesNotMatch')}
          >
            <span
              style={{
                height: '1em',
                lineHeight: '1em',
              }}
            >
              <Icon as={IoWarningOutline} color="yellow.500" />
            </span>
          </Tooltip>
        </HStack>
      ) : (
        <ModalItem
          label={`${t<string>('labels.managerAccount')}:`}
          value={
            <AddressDisplay
              accounts={accounts}
              address={fromAddress}
              ariaLabel="Manager address (from)"
              size="sm"
              network={network}
            />
          }
        />
      )}

      {condensed ? (
        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="xs"
          isOpen={condensed.expanded}
          onChange={condensed.onChange}
        >
          <VStack spacing={DEFAULT_GAP / 3} w="full">
            {renderExtraInformation(assetIcon)}
          </VStack>
        </MoreInformationAccordion>
      ) : (
        renderExtraInformation(assetIcon)
      )}
    </VStack>
  );
};

export default AssetConfigTransactionContent;
