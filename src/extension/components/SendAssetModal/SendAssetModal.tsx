import {
  CreateToastFnReturn,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
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
import SendAssetModalSummaryContent from './SendAssetModalSummaryContent';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import {
  setAmount,
  setError,
  setFromAddress,
  setNote,
  setSelectedAsset,
  setToAddress,
  submitTransactionThunk,
} from '@extension/features/send-assets';

// hooks
import useAssets from '@extension/hooks/useAssets';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useToastWithDefaultOptions from '@extension/hooks/useToastWithDefaultOptions';

// selectors
import {
  useSelectAccounts,
  useSelectSelectedNetwork,
  useSelectSendingAssetAmount,
  useSelectSendingAssetConfirming,
  useSelectSendingAssetError,
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
import { calculateMaxTransactionAmount } from '@extension/utils';
import { setPassword } from '@extension/features/registration';

interface IProps {
  onClose: () => void;
}

const SendAssetModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const toast: CreateToastFnReturn = useToastWithDefaultOptions();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const amount: string = useSelectSendingAssetAmount();
  const confirming: boolean = useSelectSendingAssetConfirming();
  const error: BaseExtensionError | null = useSelectSendingAssetError();
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
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const primaryColor: string = usePrimaryColor();
  // state
  const [maximumTransactionAmount, setMaximumTransactionAmount] =
    useState<string>('0');
  const [showSummary, setShowSummary] = useState<boolean>(false);
  // misc
  const isOpen: boolean = !!selectedAsset;
  // handlers
  const handleAmountChange = (value: string) => dispatch(setAmount(value));
  const handleAssetChange = (value: IAsset) =>
    dispatch(setSelectedAsset(value));
  const handleCancelClick = () => onClose();
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
  const handlePreviousClick = () => {
    resetPassword();
    setShowSummary(false);
  };
  const handleSendClick = async () => {
    if (!validatePassword()) {
      dispatch(setError(null));
      dispatch(submitTransactionThunk(password));
    }
  };
  const handleToAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setToAddress(event.target.value.length > 0 ? event.target.value : null)
    );
    onToAddressChange(event);
  };
  // renders
  const renderContent = () => {
    if (confirming) {
      return (
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP / 2}
          w="full"
        >
          <Spinner
            color={primaryColor}
            emptyColor={defaultTextColor}
            size="xl"
            speed="0.65s"
            thickness="4px"
          />
          <Text
            color={defaultTextColor}
            fontSize="md"
            textAlign="center"
            w="full"
          >
            {t<string>('captions.confirmingTransaction')}
          </Text>
        </VStack>
      );
    }

    if (fromAccount && network && selectedAsset) {
      if (showSummary) {
        return (
          <SendAssetModalSummaryContent
            amount={amount || '0'}
            asset={selectedAsset}
            fromAccount={fromAccount}
            network={network}
            note={note}
            toAddress={toAddress}
          />
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
  const renderFooter = () => {
    if (confirming) {
      return null;
    }

    if (showSummary) {
      return (
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
      );
    }

    return (
      <HStack spacing={DEFAULT_GAP - 2} w="full">
        <Button
          onClick={handleCancelClick}
          size="lg"
          variant="outline"
          w="full"
        >
          {t<string>('buttons.cancel')}
        </Button>

        <Button onClick={handleNextClick} size="lg" variant="solid" w="full">
          {t<string>('buttons.next')}
        </Button>
      </HStack>
    );
  };

  useEffect(() => {
    if (!selectedAsset) {
      setShowSummary(false);
      resetToAddress();
      resetPassword();
    }
  }, [selectedAsset]);
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
  useEffect(() => {
    if (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

          break;
        case ErrorCodeEnum.OfflineError:
          toast({
            description: `You appear to be offline.`,
            isClosable: true,
            status: 'error',
            title: 'Offline',
          });
          break;
        default:
          toast({
            description: `Please contact support with code "${error.code}" and describe what happened.`,
            duration: null,
            isClosable: true,
            status: 'error',
            title: 'Something when wrong.',
          });
          break;
      }
    }
  }, [error]);

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

        <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendAssetModal;
