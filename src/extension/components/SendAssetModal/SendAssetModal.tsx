import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import AddressInput from '@extension/components/AddressInput';
import AssetSelect from '@extension/components/AssetSelect';
import Button from '@extension/components/Button';
import SendAmountInput from './SendAmountInput';
import SendAssetModalContentSkeleton from './SendAssetModalContentSkeleton';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// features
import {
  setAmount,
  setFromAddress,
  setNote,
  setSelectedAsset,
  setToAddress,
} from '@extension/features/send-assets';

// hooks
import useAssets from '@extension/hooks/useAssets';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// selectors
import {
  useSelectAccounts,
  useSelectSelectedNetwork,
  useSelectSendingAssetAmount,
  useSelectSendingAssetFromAccount,
  useSelectSendingAssetNote,
  useSelectSendingAssetSelectedAsset,
  useSelectSendingAssetToAddress,
} from '@extension/selectors';

// services
import { AccountService } from '@extension/services';

// theme
import { theme } from '@extension/theme';

// types
import {
  IAccount,
  IAppThunkDispatch,
  IAsset,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import { calculateMaxTransactionAmount } from '@extension/utils';

interface IProps {
  onClose: () => void;
}

const SendAssetModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const amount: string | null = useSelectSendingAssetAmount();
  const fromAccount: IAccount | null = useSelectSendingAssetFromAccount();
  const network: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();
  const note: string | null = useSelectSendingAssetNote();
  const selectedAsset: IAsset | null = useSelectSendingAssetSelectedAsset();
  const toAddress: string | null = useSelectSendingAssetToAddress();
  // hooks
  const assets: IAsset[] = useAssets();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  // state
  const [maximumTransactionAmount, setMaximumTransactionAmount] =
    useState<string>('0');
  // misc
  const isOpen: boolean = !!selectedAsset;
  // handlers
  const handleAmountChange = (value: string | null) =>
    dispatch(setAmount(value));
  const handleAssetChange = (value: IAsset) =>
    dispatch(setSelectedAsset(value));
  const handleCancelClick = () => handleClose();
  const handleClose = () => onClose();
  const handleFromAccountChange = (account: IAccount) =>
    dispatch(
      setFromAddress(
        AccountService.convertPublicKeyToAlgorandAddress(
          account.publicKey
        ).toUpperCase()
      )
    );
  const handleNoteChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    dispatch(
      setNote(event.target.value.length > 0 ? event.target.value : null)
    );
  const handleSendClick = async () => {
    console.log('send!!');
  };
  const handleToAddressChange = (value: string) =>
    dispatch(setToAddress(value.length > 0 ? value : null));

  useEffect(() => {
    let newMaximumTransactionAmount: BigNumber;

    if (fromAccount && network && selectedAsset) {
      newMaximumTransactionAmount = calculateMaxTransactionAmount({
        account: fromAccount,
        assetId: selectedAsset.id, // native currency should have an asset id of 0
        network,
      });

      setMaximumTransactionAmount(newMaximumTransactionAmount.toString());

      // if the amount exceeds the new maximum transaction amount, set the amount to the maximum transaction amount
      if (amount && new BigNumber(amount).gt(newMaximumTransactionAmount)) {
        dispatch(setAmount(newMaximumTransactionAmount.toString()));
      }

      return;
    }

    setMaximumTransactionAmount('0');
  }, [fromAccount, network, selectedAsset]);

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor="var(--chakra-colors-chakra-body-bg)"
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.sendAsset', {
              asset: selectedAsset?.unitName || 'Asset',
            })}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={DEFAULT_GAP}>
          {fromAccount && network && selectedAsset ? (
            <VStack spacing={DEFAULT_GAP - 2} w="full">
              {/*amount*/}
              <SendAmountInput
                account={fromAccount}
                network={network}
                maximumTransactionAmount={maximumTransactionAmount}
                onValueChange={handleAmountChange}
                selectedAsset={selectedAsset}
                value={amount}
              />

              {/*select asset*/}
              <VStack w="full">
                {/*label*/}
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  {t<string>('labels.asset')}
                </Text>

                <AssetSelect
                  account={fromAccount}
                  assets={assets}
                  includeNativeCurrency={true}
                  network={network}
                  onAssetChange={handleAssetChange}
                  value={selectedAsset}
                />
              </VStack>

              {/*select from account*/}
              <VStack alignItems="flex-start" w="full">
                {/*label*/}
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  {t<string>('labels.from')}
                </Text>

                <AccountSelect
                  accounts={accounts}
                  onSelect={handleFromAccountChange}
                  value={fromAccount}
                />
              </VStack>

              {/*to address*/}
              <AddressInput
                label={t<string>('labels.to')}
                onChange={handleToAddressChange}
                value={toAddress || ''}
              />

              {/*note*/}
              <VStack alignItems="flex-start" w="full">
                {/*label*/}
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  textAlign="left"
                  w="full"
                >
                  {t<string>('labels.noteOptional')}
                </Text>

                <Textarea
                  focusBorderColor={primaryColor}
                  onChange={handleNoteChange}
                  placeholder={t<string>('placeholders.enterNote')}
                  resize="vertical"
                  size="lg"
                  value={note || ''}
                />
              </VStack>
            </VStack>
          ) : (
            <SendAssetModalContentSkeleton />
          )}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            <Button
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>

            <Button
              onClick={handleSendClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.send')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendAssetModal;
