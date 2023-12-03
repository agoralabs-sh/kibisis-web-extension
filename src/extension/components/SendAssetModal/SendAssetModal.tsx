import {
  Code,
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
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetDisplay from '@extension/components/AssetDisplay';
import AssetIcon from '@extension/components/AssetIcon';
import AccountSelect from '@extension/components/AccountSelect';
import AddressInput, {
  useAddressInput,
} from '@extension/components/AddressInput';
import AssetSelect from '@extension/components/AssetSelect';
import Button from '@extension/components/Button';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import SendAmountInput from './SendAmountInput';
import SendAssetModalContentSkeleton from './SendAssetModalContentSkeleton';
import SendAssetSummaryItem from './SendAssetSummaryItem';

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
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectSelectedNetwork,
  useSelectSendingAssetAmount,
  useSelectSendingAssetFromAccount,
  useSelectSendingAssetNote,
  useSelectSendingAssetSelectedAsset,
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
import {
  calculateMaxTransactionAmount,
  createIconFromDataUri,
} from '@extension/utils';

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
  // hooks
  const {
    error: toAddressError,
    onBlur: onToAddressBlur,
    onChange: onToAddressChange,
    reset: resetToAddress,
    validate: validateToAddress,
    value: toAddress,
  } = useAddressInput();
  const assets: IAsset[] = useAssets();
  const defaultTextColor: string = useDefaultTextColor();
  const {
    error: passwordError,
    onChange: onPasswordChange,
    password,
    reset: resetPassword,
  } = usePassword();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const primaryColor: string = usePrimaryColor();
  const subTextColor: string = useSubTextColor();
  // state
  const [maximumTransactionAmount, setMaximumTransactionAmount] =
    useState<string>('0');
  const [showSummary, setShowSummary] = useState<boolean>(false);
  // misc
  const isOpen: boolean = !!selectedAsset;
  // handlers
  const handleAmountChange = (value: string | null) =>
    dispatch(setAmount(value));
  const handleAssetChange = (value: IAsset) =>
    dispatch(setSelectedAsset(value));
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    onClose();
    setShowSummary(false);
    resetToAddress();
    resetPassword();
  };
  const handleFromAccountChange = (account: IAccount) =>
    dispatch(
      setFromAddress(
        AccountService.convertPublicKeyToAlgorandAddress(
          account.publicKey
        ).toUpperCase()
      )
    );
  const handleNextClick = async () => {
    if (!validateToAddress()) {
      setShowSummary(true);
    }
  };
  const handleNoteChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    dispatch(
      setNote(event.target.value.length > 0 ? event.target.value : null)
    );
  const handlePreviousClick = () => setShowSummary(false);
  const handleSendClick = async () => {
    console.log('send!!');
  };
  const handleToAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setToAddress(event.target.value.length > 0 ? event.target.value : null)
    );
    onToAddressChange(event);
  };
  // renders
  const renderContent = () => {
    if (fromAccount && network && selectedAsset) {
      if (showSummary) {
        return (
          <VStack
            alignItems="flex-start"
            justifyContent="flex-start"
            spacing={DEFAULT_GAP - 2}
            w="full"
          >
            {/*asset*/}
            <SendAssetSummaryItem
              item={
                <AssetDisplay
                  atomicUnitAmount={new BigNumber(amount || '0')}
                  amountColor={subTextColor}
                  decimals={selectedAsset.decimals}
                  displayUnit={selectedAsset.id !== '0'}
                  fontSize="xs"
                  icon={
                    selectedAsset.id === '0' ? (
                      createIconFromDataUri(network.nativeCurrency.iconUri, {
                        color: subTextColor,
                        h: 3,
                        w: 3,
                      })
                    ) : (
                      <AssetAvatar
                        asset={selectedAsset}
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
                    )
                  }
                  unit={selectedAsset.unitName || undefined}
                />
              }
              label={t<string>('labels.asset')}
            />

            {/*from account*/}
            <SendAssetSummaryItem
              item={
                <AddressDisplay
                  address={AccountService.convertPublicKeyToAlgorandAddress(
                    fromAccount.publicKey
                  )}
                  ariaLabel="From address"
                  color={subTextColor}
                  fontSize="xs"
                  network={network}
                />
              }
              label={t<string>('labels.from')}
            />

            {/*to address*/}
            <SendAssetSummaryItem
              item={
                <AddressDisplay
                  address={toAddress}
                  ariaLabel="To address"
                  color={subTextColor}
                  fontSize="xs"
                  network={network}
                />
              }
              label={t<string>('labels.to')}
            />

            {/*fee*/}
            <SendAssetSummaryItem
              item={
                <AssetDisplay
                  atomicUnitAmount={new BigNumber(network.minFee)}
                  amountColor={subTextColor}
                  decimals={network.nativeCurrency.decimals}
                  fontSize="xs"
                  icon={createIconFromDataUri(network.nativeCurrency.iconUri, {
                    color: subTextColor,
                    h: 3,
                    w: 3,
                  })}
                  unit={network.nativeCurrency.code}
                />
              }
              label={t<string>('labels.fee')}
            />

            {/*note*/}
            {note && note.length > 0 && (
              <SendAssetSummaryItem
                item={
                  <Code borderRadius="md" fontSize="xs" wordBreak="break-word">
                    {note}
                  </Code>
                }
                label={t<string>('labels.note')}
              />
            )}
          </VStack>
        );
      }

      return (
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
            error={toAddressError}
            label={t<string>('labels.to')}
            onBlur={onToAddressBlur}
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
      );
    }

    return <SendAssetModalContentSkeleton />;
  };

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
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          {showSummary ? (
            <VStack alignItems="flex-start" spacing={4} w="full">
              <PasswordInput
                error={passwordError}
                hint={t<string>('captions.mustEnterPasswordToSendTransaction')}
                onChange={onPasswordChange}
                value={password}
              />

              <HStack spacing={4} w="full">
                <Button
                  onClick={handlePreviousClick}
                  size="lg"
                  variant="outline"
                  w="full"
                >
                  {t<string>('buttons.previous')}
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
            </VStack>
          ) : (
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
                onClick={handleNextClick}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.next')}
              </Button>
            </HStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendAssetModal;
