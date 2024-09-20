import { HStack, Text, VStack } from '@chakra-ui/react';
import { encodeAddress } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectLogger, useSelectSettings } from '@extension/selectors';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccountWithExtendedProps,
  IAccountInformation,
  IStandardAssetHolding,
} from '@extension/types';
import type { IAssetTransactionBodyProps } from './types';

// utils
import convertAVMAddressToPublicKey from '@extension/utils/convertAVMAddressToPublicKey';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';
import updateAccountInformation from '@extension/utils/updateAccountInformation';

const AssetFreezeTransactionContent: FC<IAssetTransactionBodyProps> = ({
  accounts,
  asset,
  blockExplorer,
  condensed,
  fromAccount,
  hideNetwork = false,
  loading = false,
  network,
  transaction,
}) => {
  const { t } = useTranslation();
  // selectors
  const logger = useSelectLogger();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const subTextColor = useSubTextColor();
  // state
  const [
    fetchingFreezeAccountInformation,
    setFetchingFreezeAccountInformation,
  ] = useState<boolean>(false);
  const [freezeAccount, setFreezeAccount] =
    useState<IAccountWithExtendedProps | null>(null);
  const [atomicUnitFreezeAccountBalance, setAtomicUnitFreezeAccountBalance] =
    useState<BigNumber>(new BigNumber('0'));
  // misc
  const freezeAddress = transaction.freezeAccount
    ? encodeAddress(transaction.freezeAccount.publicKey)
    : null;
  const fromAddress = encodeAddress(transaction.from.publicKey);
  const feeAsAtomicUnit = new BigNumber(
    transaction.fee ? String(transaction.fee) : '0'
  );
  const transactionType = parseTransactionType(
    transaction.get_obj_for_encoding(),
    {
      network,
      sender: fromAccount,
    }
  );
  // renders
  const renderExtraInformation = () => {
    if (!asset) {
      return null;
    }

    return (
      <>
        {/*freeze account balance*/}
        <ModalAssetItem
          amountInAtomicUnits={atomicUnitFreezeAccountBalance}
          decimals={asset.decimals}
          displayUnit={true}
          icon={
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
          }
          isLoading={loading || fetchingFreezeAccountInformation}
          label={`${t<string>(
            transactionType === TransactionTypeEnum.AssetFreeze
              ? 'labels.freezeAccountBalance'
              : 'labels.frozenAccountBalance'
          )}:`}
          unit={asset.unitName || undefined}
        />

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
            value={<NetworkBadge network={network} size="xs" />}
          />
        )}

        {/*note*/}
        {transaction.note && transaction.note.length > 0 && (
          <ModalTextItem
            label={`${t<string>('labels.note')}:`}
            value={new TextDecoder().decode(transaction.note)}
          />
        )}
      </>
    );
  };

  // fetch the account information for the freeze account
  useEffect(() => {
    (async () => {
      let account: IAccountWithExtendedProps | null;
      let accountInformation: IAccountInformation;
      let encodedGenesisHash: string;

      if (!freezeAddress) {
        return;
      }

      account =
        accounts.find(
          (value) =>
            convertPublicKeyToAVMAddress(value.publicKey) === freezeAddress
        ) || null;

      // if we have this account, just use ut
      if (account) {
        setFreezeAccount(account);

        return;
      }

      setFetchingFreezeAccountInformation(true);

      encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);
      account = {
        ...AccountRepository.initializeDefaultAccount({
          publicKey: PrivateKeyService.encode(
            convertAVMAddressToPublicKey(freezeAddress)
          ),
        }),
        watchAccount: false,
      };
      accountInformation = await updateAccountInformation({
        address: freezeAddress,
        currentAccountInformation:
          account.networkInformation[encodedGenesisHash] ||
          AccountRepository.initializeDefaultAccountInformation(),
        logger,
        network,
        nodeID: selectNodeIDByGenesisHashFromSettings({
          genesisHash: network.genesisHash,
          settings,
        }),
      });

      setFreezeAccount({
        ...account,
        networkInformation: {
          ...account.networkInformation,
          [encodedGenesisHash]: accountInformation,
        },
      });
      setFetchingFreezeAccountInformation(false);
    })();
  }, []);
  // once we have the freeze account information, check the asset balance
  useEffect(() => {
    let assetHolding: IStandardAssetHolding | null;
    let freezeAccountInformation: IAccountInformation | null;

    if (asset && freezeAccount) {
      freezeAccountInformation =
        AccountRepository.extractAccountInformationForNetwork(
          freezeAccount,
          network
        );
      assetHolding =
        freezeAccountInformation?.standardAssetHoldings.find(
          (value) => value.id === asset.id
        ) || null;

      if (assetHolding) {
        setAtomicUnitFreezeAccountBalance(new BigNumber(assetHolding.amount));
      }
    }
  }, [asset, freezeAccount]);

  if (!asset || !fromAccount || loading) {
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

      {/*freeze manager*/}
      <ModalItem
        label={`${t<string>('labels.freezeManagerAccount')}:`}
        value={
          <AddressDisplay
            accounts={accounts}
            address={fromAddress}
            ariaLabel="Freeze manager address (from)"
            size="sm"
            network={network}
          />
        }
        warningLabel={
          fromAddress !== asset.freezeAddress
            ? t<string>('captions.freezeManagerAddressDoesNotMatch')
            : undefined
        }
      />

      {/*freeze/unfreeze account*/}
      {freezeAddress && (
        <ModalItem
          label={`${t<string>(
            transactionType === TransactionTypeEnum.AssetFreeze
              ? 'labels.accountToFreeze'
              : 'labels.accountToUnfreeze'
          )}:`}
          value={
            <AddressDisplay
              accounts={accounts}
              address={freezeAddress}
              ariaLabel="Asset freeze address"
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
            {renderExtraInformation()}
          </VStack>
        </MoreInformationAccordion>
      ) : (
        renderExtraInformation()
      )}
    </VStack>
  );
};

export default AssetFreezeTransactionContent;
