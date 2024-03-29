import {
  Code,
  Heading,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {
  decodeURLSafe as decodeBase63URLSafe,
  encode as encodeBase64,
} from '@stablelib/base64';
import BigNumber from 'bignumber.js';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// components
import AccountSelect from '@extension/components/AccountSelect';
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetBadge from '@extension/components/AssetBadge';
import AssetIcon from '@extension/components/AssetIcon';
import Button from '@extension/components/Button';
import ChainBadge from '@extension/components/ChainBadge';
import CopyIconButton from '@extension/components/CopyIconButton';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import ModalItem from '@extension/components/ModalItem';
import ModalSubHeading from '@extension/components/ModalSubHeading';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';

// constants
import {
  ACCOUNTS_ROUTE,
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  MODAL_ITEM_HEIGHT,
} from '@extension/constants';

// enums
import {
  AccountTabEnum,
  ARC0300QueryEnum,
  ErrorCodeEnum,
} from '@extension/enums';

// features
import {
  addARC0200AssetHoldingsThunk,
  IUpdateAssetHoldingsResult,
  saveActiveAccountDetails,
} from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useUpdateARC0200Assets from '@extension/hooks/useUpdateARC0200Assets';

// selectors
import {
  useSelectAccounts,
  useSelectActiveAccount,
  useSelectActiveAccountDetails,
  useSelectLogger,
  useSelectNetworks,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IActiveAccountDetails,
  IAppThunkDispatch,
  IARC0200Asset,
  IARC0300AssetAddSchema,
  INetwork,
} from '@extension/types';

// utils
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import isAssetInAccountHoldings from '@extension/utils/isAssetInAccountHoldings';

interface IProps {
  onComplete: () => void;
  onPreviousClick: () => void;
  schema: IARC0300AssetAddSchema;
}

const AssetAddModalContent: FC<IProps> = ({
  onComplete,
  onPreviousClick,
  schema,
}: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const activeAccount: IAccount | null = useSelectActiveAccount();
  const activeAccountDetails: IActiveAccountDetails | null =
    useSelectActiveAccountDetails();
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
  // hooks
  const {
    assets,
    loading,
    reset: resetUpdateAssets,
  } = useUpdateARC0200Assets([schema.paths[1]]);
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  // states
  const [account, setAccount] = useState<IAccount | null>(activeAccount);
  const [saving, setSaving] = useState<boolean>(false);
  // misc
  const asset: IARC0200Asset | null = assets[0] || null;
  const network: INetwork | null =
    networks.find(
      (value) =>
        value.genesisHash ===
        encodeBase64(
          decodeBase63URLSafe(schema.query[ARC0300QueryEnum.GenesisHash])
        )
    ) || null;
  const totalSupplyInStandardUnits: BigNumber = asset
    ? convertToStandardUnit(new BigNumber(asset.totalSupply), asset.decimals)
    : new BigNumber('0');
  // handlers
  const handleAddClick = async () => {
    const _functionName: string = 'handleAddClick';
    let result: IUpdateAssetHoldingsResult;

    if (!account || !asset || !network) {
      return;
    }

    // if the asset is already in the account, just clean up and close
    if (isAssetInAccountHoldings({ account, asset, network })) {
      logger.debug(
        `${AssetAddModalContent.name}#${_functionName}: asset "${asset.id}" already added`
      );

      handleOnComplete();

      return;
    }

    setSaving(true);

    try {
      result = await dispatch(
        addARC0200AssetHoldingsThunk({
          accountId: account.id,
          assets: [asset],
          genesisHash: network.genesisHash,
        })
      ).unwrap();

      dispatch(
        createNotification({
          title: t<string>('headings.addedAsset', {
            symbol: asset.symbol,
          }),
          type: 'success',
        })
      );

      // go to the updated account and the assets tab
      dispatch(
        saveActiveAccountDetails({
          accountId: result.account.id,
          tabIndex: AccountTabEnum.Assets,
        })
      );
      navigate(ACCOUNTS_ROUTE);

      // clean up and close
      handleOnComplete();
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.OfflineError:
          dispatch(
            createNotification({
              ephemeral: true,
              title: t<string>('headings.offline'),
              type: 'error',
            })
          );
          break;
        default:
          dispatch(
            createNotification({
              description: t<string>('errors.descriptions.code', {
                code: error.code,
                context: error.code,
              }),
              ephemeral: true,
              title: t<string>('errors.titles.code', { context: error.code }),
              type: 'error',
            })
          );
          break;
      }
    }

    setSaving(false);
  };
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onOpen() : onClose();
  const handleOnComplete = () => {
    reset();
    onComplete();
  };
  const handleOnAccountSelect = (value: IAccount) => setAccount(value);
  const handlePreviousClick = () => {
    reset();
    onPreviousClick();
  };
  const reset = () => {
    resetUpdateAssets();
    setSaving(false);
  };

  return (
    <ModalContent
      backgroundColor={BODY_BACKGROUND_COLOR}
      borderTopRadius={theme.radii['3xl']}
      borderBottomRadius={0}
    >
      {/*header*/}
      <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {t<string>('headings.addAsset')}
        </Heading>
      </ModalHeader>

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.addAssetURI')}
          </Text>

          {!asset || !network || loading ? (
            <VStack spacing={2} w="full">
              <ModalSkeletonItem />
              <ModalSkeletonItem />
              <ModalSkeletonItem />
            </VStack>
          ) : (
            <VStack spacing={DEFAULT_GAP - 2} w="full">
              {/*select account*/}
              <VStack spacing={DEFAULT_GAP / 3} w="full">
                <ModalSubHeading text={t<string>('headings.selectAccount')} />

                <AccountSelect
                  accounts={accounts}
                  onSelect={handleOnAccountSelect}
                  value={account || accounts[0]}
                />
              </VStack>

              {/*asset details*/}
              <VStack spacing={DEFAULT_GAP / 3} w="full">
                <ModalSubHeading text={t<string>('headings.assetDetails')} />

                <ModalItem
                  label={`${t<string>('labels.symbol')}:`}
                  tooltipLabel={asset.symbol}
                  value={
                    <HStack spacing={1}>
                      {/*symbol*/}
                      <Text
                        color={defaultTextColor}
                        fontSize="xs"
                        maxW={200}
                        noOfLines={1}
                        textAlign="center"
                      >
                        {asset.symbol}
                      </Text>

                      {/*asset icon*/}
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
                        size="xs"
                      />
                    </HStack>
                  }
                />

                {/*name*/}
                <ModalTextItem
                  label={`${t<string>('labels.name')}:`}
                  tooltipLabel={asset.name}
                  value={asset.name}
                />

                {/*id*/}
                <ModalItem
                  label={`${t<string>('labels.applicationId')}:`}
                  tooltipLabel={asset.id}
                  value={
                    <HStack spacing={0}>
                      <Code
                        borderRadius="md"
                        fontSize="xs"
                        wordBreak="break-word"
                      >
                        {asset.id}
                      </Code>

                      <CopyIconButton
                        ariaLabel={t<string>('labels.copyApplicationId')}
                        tooltipLabel={t<string>('labels.copyApplicationId')}
                        size="sm"
                        value={asset.id}
                      />
                    </HStack>
                  }
                />

                {/*type*/}
                <ModalItem
                  label={`${t<string>('labels.chain')}:`}
                  value={<ChainBadge network={network} />}
                />

                {/*type*/}
                <ModalItem
                  label={`${t<string>('labels.type')}:`}
                  value={<AssetBadge type={asset.type} />}
                />

                <MoreInformationAccordion
                  color={defaultTextColor}
                  fontSize="xs"
                  isOpen={isOpen}
                  minButtonHeight={MODAL_ITEM_HEIGHT}
                  onChange={handleMoreInformationToggle}
                >
                  <VStack spacing={2} w="full">
                    {/*decimals*/}
                    <ModalTextItem
                      label={`${t<string>('labels.decimals')}:`}
                      value={asset.decimals.toString()}
                    />

                    {/*total supply*/}
                    <ModalTextItem
                      label={`${t<string>('labels.totalSupply')}:`}
                      tooltipLabel={formatCurrencyUnit(
                        totalSupplyInStandardUnits,
                        {
                          decimals: asset.decimals,
                          thousandSeparatedOnly: true,
                        }
                      )}
                      value={formatCurrencyUnit(
                        convertToStandardUnit(
                          new BigNumber(asset.totalSupply),
                          asset.decimals
                        ),
                        { decimals: asset.decimals }
                      )}
                    />
                  </VStack>
                </MoreInformationAccordion>
              </VStack>
            </VStack>
          )}
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>
        <VStack alignItems="flex-start" spacing={4} w="full">
          <HStack spacing={4} w="full">
            {/*previous button*/}
            <Button
              leftIcon={<IoArrowBackOutline />}
              onClick={handlePreviousClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.previous')}
            </Button>

            {/*add button*/}
            <Button
              isLoading={loading || saving}
              onClick={handleAddClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.add')}
            </Button>
          </HStack>
        </VStack>
      </ModalFooter>
    </ModalContent>
  );
};

export default AssetAddModalContent;
