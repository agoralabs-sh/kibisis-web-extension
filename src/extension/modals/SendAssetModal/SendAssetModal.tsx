import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import AddressInput from '@extension/components/AddressInput';
import AmountInput from '@extension/components/AmountInput';
import AssetSelect from '@extension/components/AssetSelect';
import Button from '@extension/components/Button';
import Label from '@extension/components/Label';
import SendAssetModalConfirmingContent from './SendAssetModalConfirmingContent';
import SendAssetModalContentSkeleton from './SendAssetModalContentSkeleton';
import SendAssetModalSummaryContent from './SendAssetModalSummaryContent';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';
import { QuestNameEnum } from '@extension/services/QuestsService';

// errors
import { BaseExtensionError } from '@extension/errors';

// features
import { updateAccountsThunk } from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';
import {
  createUnsignedTransactionsThunk,
  reset as resetSendAssets,
  setAmount,
  setFromAddress,
  setNote,
  setSelectedAsset,
  setToAddress,
  submitTransactionThunk,
} from '@extension/features/send-assets';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectAccounts,
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectAvailableAccountsForSelectedNetwork,
  useSelectLogger,
  useSelectSelectedNetwork,
  useSelectSendAssetAmountInStandardUnits,
  useSelectSendAssetConfirming,
  useSelectSendAssetCreating,
  useSelectSendAssetFromAccount,
  useSelectSendAssetNote,
  useSelectSendAssetSelectedAsset,
  useSelectSendAssetToAddress,
  useSelectStandardAssetsBySelectedNetwork,
} from '@extension/selectors';

// services
import QuestsService from '@extension/services/QuestsService';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAccount,
  IAccountWithExtendedProps,
  IAppThunkDispatch,
  IAssetTypes,
  IMainRootState,
  IModalProps,
  INativeCurrency,
  TEncryptionCredentials,
} from '@extension/types';

// utils
import calculateMaxTransactionAmount from '@extension/utils/calculateMaxTransactionAmount';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

const SendAssetModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  // selectors
  const accounts = useSelectAccounts();
  const amountInStandardUnits = useSelectSendAssetAmountInStandardUnits();
  const arc200Assets = useSelectARC0200AssetsBySelectedNetwork();
  const availableAccounts = useSelectAvailableAccountsForSelectedNetwork();
  const standardAssets = useSelectStandardAssetsBySelectedNetwork();
  const confirming = useSelectSendAssetConfirming();
  const creating = useSelectSendAssetCreating();
  const fromAccount = useSelectSendAssetFromAccount();
  const logger = useSelectLogger();
  const network = useSelectSelectedNetwork();
  const note = useSelectSendAssetNote();
  const selectedAsset = useSelectSendAssetSelectedAsset();
  const toAddress = useSelectSendAssetToAddress();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  // state
  const [toAddressError, setToAddressError] = useState<string | null>(null);
  const [maximumTransactionAmount, setMaximumTransactionAmount] =
    useState<string>('0');
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  // misc
  const allAssets: (IAssetTypes | INativeCurrency)[] = [
    ...arc200Assets,
    ...standardAssets,
  ]
    .sort((a, b) => {
      const aName: string = a.name?.toUpperCase() || '';
      const bName: string = b.name?.toUpperCase() || '';

      return aName < bName ? -1 : aName > bName ? 1 : 0;
    }) // sort each alphabetically by name
    .sort((a, b) => (a.verified === b.verified ? 0 : a.verified ? -1 : 1)); // then sort to bring the verified to the front
  const isOpen: boolean = !!selectedAsset;
  // handlers
  const handleAmountChange = (value: string) => dispatch(setAmount(value));
  const handleAssetChange = (value: IAssetTypes | INativeCurrency) =>
    dispatch(setSelectedAsset(value));
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    // reset modal store - should close modal
    dispatch(resetSendAssets());

    // reset modal input and transactions
    setTransactions(null);

    onClose && onClose();
  };
  const handleFromAccountChange = (account: IAccountWithExtendedProps) =>
    dispatch(setFromAddress(convertPublicKeyToAVMAddress(account.publicKey)));
  const handleNextClick = async () => {
    const _functionName = 'handleNextClick';
    let _transactions: Transaction[];

    if (toAddressError) {
      return;
    }

    logger.debug(
      `${SendAssetModal.name}#${_functionName}: creating unsigned transactions`
    );

    try {
      _transactions = await dispatch(
        createUnsignedTransactionsThunk()
      ).unwrap();

      logger.debug(
        `${
          SendAssetModal.name
        }#${_functionName}: created unsigned transactions "[${_transactions
          .map((value) => value.type)
          .join(',')}]"`
      );

      setTransactions(_transactions);
    } catch (error) {
      logger.error(`${SendAssetModal.name}#${_functionName}:`, error);

      handleOnError(error);

      return;
    }
  };
  const handleOnError = (error: BaseExtensionError) => {
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
  };
  const handleNoteChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    dispatch(
      setNote(event.target.value.length > 0 ? event.target.value : null)
    );
  const handleOnToAddressError = (error: string | null) =>
    setToAddressError(error);
  const handlePreviousClick = () => setTransactions(null);
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    let fromAddress: string;
    let hasQuestBeenCompletedToday: boolean = false;
    let questsService: QuestsService;
    let questsSent: boolean = false;
    let toAccount: IAccount | null;
    let transactionIds: string[];

    if (
      !fromAccount ||
      !network ||
      !transactions ||
      transactions.length <= 0 ||
      !toAddress
    ) {
      return;
    }

    try {
      transactionIds = await dispatch(
        submitTransactionThunk({
          transactions,
          ...result,
        })
      ).unwrap();

      logger.debug(
        `${
          SendAssetModal.name
        }#${_functionName}: sent transactions [${transactionIds
          .map((value) => `"${value}"`)
          .join(',')}] to the network`
      );

      toAccount =
        accounts.find(
          (value) => convertPublicKeyToAVMAddress(value.publicKey) === toAddress
        ) || null;
      fromAddress = convertPublicKeyToAVMAddress(fromAccount.publicKey);
      questsService = new QuestsService({
        logger,
      });

      // track the action
      switch (selectedAsset?.type) {
        case AssetTypeEnum.ARC0200:
          hasQuestBeenCompletedToday =
            await questsService.hasQuestBeenCompletedTodayByName(
              QuestNameEnum.SendARC0200AssetAction
            );
          questsSent = await questsService.sendARC0200AssetQuest(
            fromAddress,
            toAddress,
            amountInStandardUnits,
            {
              appID: selectedAsset.id,
              genesisHash: network.genesisHash,
            }
          );
          break;
        case AssetTypeEnum.Native:
          hasQuestBeenCompletedToday =
            await questsService.hasQuestBeenCompletedTodayByName(
              QuestNameEnum.SendNativeCurrencyAction
            );
          questsSent = await questsService.sendNativeCurrencyQuest(
            fromAddress,
            toAddress,
            amountInStandardUnits,
            {
              genesisHash: network.genesisHash,
            }
          );
          break;
        case AssetTypeEnum.Standard:
          hasQuestBeenCompletedToday =
            await questsService.hasQuestBeenCompletedTodayByName(
              QuestNameEnum.SendStandardAssetAction
            );
          questsSent = await questsService.sendStandardAssetQuest(
            fromAddress,
            toAddress,
            amountInStandardUnits,
            {
              assetID: selectedAsset.id,
              genesisHash: network.genesisHash,
            }
          );
          break;
        default:
          break;
      }

      // if the quest has not been completed today (since 00:00 UTC), show a quest notification
      if (questsSent && !hasQuestBeenCompletedToday) {
        dispatch(
          createNotification({
            description: t<string>('captions.questComplete'),
            title: t<string>('headings.congratulations'),
            type: 'achievement',
          })
        );
      }

      // send a success transaction
      dispatch(
        createNotification({
          description: t<string>('captions.transactionsSentSuccessfully', {
            amount: transactionIds.length,
          }),
          title: t<string>('headings.transactionsSuccessful'),
          type: 'success',
        })
      );

      // force update the account information as we spent fees and refresh all the new transactions
      dispatch(
        updateAccountsThunk({
          accountIds: toAccount
            ? [fromAccount.id, toAccount.id]
            : [fromAccount.id],
          forceInformationUpdate: true,
          refreshTransactions: true,
        })
      );

      // clean up
      handleClose();
    } catch (error) {
      handleOnError(error);

      return;
    }
  };
  const handleSendClick = () => onAuthenticationModalOpen();
  const handleToAddressChange = (value: string) =>
    dispatch(setToAddress(value.length > 0 ? value : null));
  // renders
  const renderContent = () => {
    if (!fromAccount || !network || !selectedAsset) {
      return <SendAssetModalContentSkeleton />;
    }

    if (confirming) {
      return (
        <SendAssetModalConfirmingContent
          numberOfTransactions={transactions?.length}
        />
      );
    }

    if (toAddress && transactions && transactions.length > 0) {
      return (
        <SendAssetModalSummaryContent
          accounts={accounts}
          amountInStandardUnits={amountInStandardUnits}
          asset={selectedAsset}
          fromAccount={fromAccount}
          network={network}
          note={note}
          toAddress={toAddress}
          transactions={transactions}
        />
      );
    }

    return (
      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*amount*/}
        <AmountInput
          account={fromAccount}
          asset={selectedAsset}
          disabled={creating}
          network={network}
          maximumTransactionAmount={maximumTransactionAmount}
          onChange={handleAmountChange}
          required={true}
          value={amountInStandardUnits}
        />

        {/*select asset*/}
        <AssetSelect
          assets={[
            network.nativeCurrency, // add the native currency to the front
            ...allAssets,
          ]}
          disabled={creating}
          label={t<string>('labels.asset')}
          network={network}
          onSelect={handleAssetChange}
          required={true}
          value={selectedAsset}
        />

        {/*from account*/}
        <AccountSelect
          accounts={availableAccounts}
          disabled={creating}
          label={t<string>('labels.from')}
          onSelect={handleFromAccountChange}
          required={true}
          value={fromAccount}
        />

        {/*to address*/}
        <AddressInput
          accounts={accounts}
          disabled={creating}
          error={toAddressError}
          label={t<string>('labels.to')}
          onChange={handleToAddressChange}
          onError={handleOnToAddressError}
          required={true}
          value={toAddress || ''}
        />

        {/*note*/}
        <VStack alignItems="flex-start" w="full">
          <Label label={t<string>('labels.note')} />

          <Textarea
            focusBorderColor={primaryColor}
            isDisabled={creating}
            onChange={handleNoteChange}
            placeholder={t<string>('placeholders.enterNote')}
            resize="vertical"
            size="sm"
            value={note || ''}
          />
        </VStack>
      </VStack>
    );
  };
  const renderFooter = () => {
    if (confirming) {
      return null;
    }

    if (transactions && transactions.length > 0) {
      return (
        <HStack spacing={DEFAULT_GAP - 2} w="full">
          <Button
            leftIcon={<IoArrowBackOutline />}
            onClick={handlePreviousClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.previous')}
          </Button>

          <Button onClick={handleSendClick} size="lg" variant="solid" w="full">
            {t<string>('buttons.send')}
          </Button>
        </HStack>
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

        <Button
          isLoading={creating}
          onClick={handleNextClick}
          rightIcon={<IoArrowForwardOutline />}
          size="lg"
          variant="solid"
          w="full"
        >
          {t<string>('buttons.next')}
        </Button>
      </HStack>
    );
  };
  const renderHeader = () => {
    switch (selectedAsset?.type) {
      case AssetTypeEnum.ARC0200:
      case AssetTypeEnum.Native:
        return (
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.sendAsset', {
              asset: selectedAsset.symbol,
            })}
          </Heading>
        );
      case AssetTypeEnum.Standard:
        return (
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.sendAsset', {
              asset: selectedAsset?.unitName || 'Asset',
            })}
          </Heading>
        );
      default:
        return (
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.sendAsset', {
              asset: 'Asset',
            })}
          </Heading>
        );
    }
  };

  useEffect(() => {
    let newMaximumTransactionAmount: BigNumber;

    if (fromAccount && network && selectedAsset) {
      newMaximumTransactionAmount = calculateMaxTransactionAmount({
        account: fromAccount,
        asset: selectedAsset,
        network,
      });

      setMaximumTransactionAmount(newMaximumTransactionAmount.toString());

      // if the amount exceeds the new maximum transaction amount, set the amount to the maximum transaction amount
      if (
        amountInStandardUnits &&
        new BigNumber(amountInStandardUnits).gt(newMaximumTransactionAmount)
      ) {
        dispatch(setAmount(newMaximumTransactionAmount.toString()));
      }

      return;
    }

    setMaximumTransactionAmount('0');
  }, [fromAccount, network, selectedAsset]);

  return (
    <>
      {/*authentication modal*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleOnError}
        passwordHint={t<string>('captions.mustEnterPasswordToSendTransaction')}
      />

      <Modal
        isOpen={isOpen}
        motionPreset="slideInBottom"
        onClose={handleClose}
        size="full"
        scrollBehavior="inside"
      >
        <ModalContent
          backgroundColor={BODY_BACKGROUND_COLOR}
          borderTopRadius={theme.radii['3xl']}
          borderBottomRadius={0}
        >
          <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
            {renderHeader()}
          </ModalHeader>

          <ModalBody display="flex" px={DEFAULT_GAP}>
            {renderContent()}
          </ModalBody>

          <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SendAssetModal;
