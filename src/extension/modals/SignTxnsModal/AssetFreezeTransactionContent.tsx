import { HStack, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWarningOutline } from 'react-icons/io5';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import SignTxnsAddressItem from './SignTxnsAddressItem';
import SignTxnsAssetItem from './SignTxnsAssetItem';
import SignTxnsLoadingItem from './SignTxnsLoadingItem';
import SignTxnsTextItem from './SignTxnsTextItem';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// features
import { updateAccountInformation } from '@extension/features/accounts';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectAccounts, useSelectLogger } from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAccountInformation,
  IStandardAsset,
  IStandardAssetHolding,
  IExplorer,
  INetwork,
} from '@extension/types';
import { ICondensedProps } from './types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';

interface IProps {
  asset: IStandardAsset | null;
  condensed?: ICondensedProps;
  explorer: IExplorer;
  fromAccount: IAccount | null;
  loading?: boolean;
  network: INetwork;
  transaction: Transaction;
}

const AssetFreezeTransactionContent: FC<IProps> = ({
  asset,
  condensed,
  explorer,
  fromAccount,
  loading = false,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const logger: ILogger = useSelectLogger();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  // state
  const [
    fetchingFreezeAccountInformation,
    setFetchingFreezeAccountInformation,
  ] = useState<boolean>(false);
  const [freezeAccount, setFreezeAccount] = useState<IAccount | null>(null);
  const [atomicUnitFreezeAccountBalance, setAtomicUnitFreezeAccountBalance] =
    useState<BigNumber>(new BigNumber('0'));
  // misc
  const freezeAddress: string | null = transaction.freezeAccount
    ? encodeAddress(transaction.freezeAccount.publicKey)
    : null;
  const fromAddress: string = encodeAddress(transaction.from.publicKey);
  const transactionType: TransactionTypeEnum = parseTransactionType(
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
        {/* freeze account balance */}
        <SignTxnsAssetItem
          atomicUnitAmount={atomicUnitFreezeAccountBalance}
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
        <SignTxnsAssetItem
          atomicUnitAmount={new BigNumber(String(transaction.fee))}
          decimals={network.nativeCurrency.decimals}
          icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          label={`${t<string>('labels.fee')}:`}
          unit={network.nativeCurrency.symbol}
        />

        {/*note*/}
        {transaction.note && transaction.note.length > 0 && (
          <SignTxnsTextItem
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
      let account: IAccount | null;
      let accountInformation: IAccountInformation;
      let encodedGenesisHash: string;

      if (!freezeAddress) {
        return;
      }

      account =
        accounts.find(
          (value) =>
            AccountService.convertPublicKeyToAlgorandAddress(
              value.publicKey
            ) === freezeAddress
        ) || null;

      // if we have this account, just use ut
      if (account) {
        setFreezeAccount(account);

        return;
      }

      setFetchingFreezeAccountInformation(true);

      encodedGenesisHash = convertGenesisHashToHex(
        network.genesisHash
      ).toUpperCase();
      account = AccountService.initializeDefaultAccount({
        publicKey:
          AccountService.convertAlgorandAddressToPublicKey(freezeAddress),
      });
      accountInformation = await updateAccountInformation({
        address: freezeAddress,
        currentAccountInformation:
          account.networkInformation[encodedGenesisHash] ||
          AccountService.initializeDefaultAccountInformation(),
        logger,
        network,
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
        AccountService.extractAccountInformationForNetwork(
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
        spacing={2}
        w="full"
      >
        <SignTxnsLoadingItem />
        <SignTxnsLoadingItem />
        <SignTxnsLoadingItem />
      </VStack>
    );
  }

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={condensed ? 2 : 4}
      w="full"
    >
      {/* heading */}
      <Text color={defaultTextColor} fontSize="md" textAlign="left" w="full">
        {t<string>('headings.transaction', {
          context: transactionType,
        })}
      </Text>

      {/* asset id */}
      <HStack spacing={0} w="full">
        <SignTxnsTextItem
          flexGrow={1}
          isCode={true}
          label={`${t<string>('labels.id')}:`}
          value={asset.id}
        />
        <CopyIconButton
          ariaLabel={`Copy ${asset.id}`}
          size="xs"
          value={asset.id}
        />
        {explorer && (
          <OpenTabIconButton
            size="xs"
            tooltipLabel={t<string>('captions.openOn', {
              name: explorer.canonicalName,
            })}
            url={`${explorer.baseUrl}${explorer.assetPath}/${asset.id}`}
          />
        )}
      </HStack>

      {/* freeze manager */}
      {fromAddress !== asset.freezeAddress ? (
        <HStack
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
          w="full"
        >
          <SignTxnsAddressItem
            address={fromAddress}
            ariaLabel="Freeze manager address (from)"
            label={`${t<string>('labels.freezeManagerAccount')}:`}
            network={network}
          />
          <Tooltip
            aria-label="Freeze manager address does not match the asset's freeze manager address"
            label={t<string>('captions.freezeManagerAddressDoesNotMatch')}
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
        <SignTxnsAddressItem
          address={fromAddress}
          ariaLabel="Freeze manager address (from)"
          label={`${t<string>('labels.freezeManagerAccount')}:`}
          network={network}
        />
      )}

      {/* freeze/unfreeze account */}
      {freezeAddress && (
        <SignTxnsAddressItem
          address={freezeAddress}
          ariaLabel="Asset freeze address"
          label={`${t<string>(
            transactionType === TransactionTypeEnum.AssetFreeze
              ? 'labels.accountToFreeze'
              : 'labels.accountToUnfreeze'
          )}:`}
          network={network}
        />
      )}

      {condensed ? (
        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="xs"
          isOpen={condensed.expanded}
          onChange={condensed.onChange}
        >
          <VStack spacing={2} w="full">
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
