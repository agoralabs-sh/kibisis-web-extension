import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { type Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoArrowUpOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AccountSelect from '@extension/components/AccountSelect';
import AddressInput from '@extension/components/AddressInput';
import AmountInput from '@extension/components/AmountInput';
import AssetSelect from '@extension/components/AssetSelect';
import Button from '@extension/components/Button';
import GenericTextarea from '@extension/components/GenericTextarea';
import SendAssetModalConfirmingContent from './SendAssetModalConfirmingContent';
import SendAssetModalContentSkeleton from './SendAssetModalContentSkeleton';
import SendAssetModalSummaryContent from './SendAssetModalSummaryContent';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  TRANSACTION_NOTE_BYTE_LIMIT,
} from '@extension/constants';

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
  setAsset,
  setSender,
  submitTransactionThunk,
} from '@extension/features/send-assets';

// hooks
import useAddressInput from '@extension/hooks/useAddressInput';
import useAmountInput from '@extension/hooks/useAmountInput';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useGenericInput from '@extension/hooks/useGenericInput';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';

// selectors
import {
  useSelectAccounts,
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectAvailableAccountsForSelectedNetwork,
  useSelectLogger,
  useSelectSettingsSelectedNetwork,
  useSelectSendAssetAsset,
  useSelectSendAssetConfirming,
  useSelectSendAssetCreating,
  useSelectSendAssetSender,
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
  const arc200Assets = useSelectARC0200AssetsBySelectedNetwork();
  const asset = useSelectSendAssetAsset();
  const availableAccounts = useSelectAvailableAccountsForSelectedNetwork();
  const standardAssets = useSelectStandardAssetsBySelectedNetwork();
  const confirming = useSelectSendAssetConfirming();
  const creating = useSelectSendAssetCreating();
  const logger = useSelectLogger();
  const network = useSelectSettingsSelectedNetwork();
  const sender = useSelectSendAssetSender();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    label: amountLabel,
    onBlur: amountOnBlur,
    onChange: amountOnChange,
    onFocus: amountOnFocus,
    onMaximumAmountClick: amountOnMaximumClick,
    required: isAmountRequired,
    reset: resetAmount,
    setValue: setAmountValue,
    value: amountValue,
  } = useAmountInput({
    label: t<string>('labels.amount'),
    required: true,
  });
  const {
    charactersRemaining: noteCharactersRemaining,
    error: noteError,
    label: noteLabel,
    onBlur: noteOnBlur,
    onChange: noteOnChange,
    required: isNoteRequired,
    reset: resetNote,
    value: noteValue,
    validate: validateNote,
  } = useGenericInput<HTMLTextAreaElement>({
    characterLimit: TRANSACTION_NOTE_BYTE_LIMIT,
    label: t<string>('labels.note'),
    required: false,
  });
  const {
    error: receiverAddressError,
    label: receiverAddressLabel,
    onBlur: receiverAddressOnBlur,
    onChange: receiverAddressOnChange,
    onSelect: receiverAddressOnSelect,
    required: isReceiverAddressRequired,
    reset: resetReceiverAddress,
    value: receiverAddressValue,
    validate: validateReceiverAddress,
  } = useAddressInput({
    label: t<string>('labels.to'),
    required: true,
  });
  // state
  const [maximumAmountInAtomicUnits, setMaximumAmountInAtomicUnits] =
    useState<string>('0');
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  // misc
  const _context = 'send-asset-modal';
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
  const isOpen = !!asset && !!sender;
  // handlers
  const handleOnAssetSelect = (value: IAssetTypes | INativeCurrency) =>
    dispatch(setAsset(value));
  const handleOnSenderAccountSelect = (value: IAccountWithExtendedProps) =>
    dispatch(setSender(value));
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    // reset modal store - should close modal
    dispatch(resetSendAssets());

    // reset modal input and transactions
    setTransactions(null);
    resetAmount();
    resetNote();
    resetReceiverAddress();

    onClose && onClose();
  };
  const handleNextClick = async () => {
    const _functionName = 'handleNextClick';
    let _transactions: Transaction[];

    if (
      !!noteError ||
      !!receiverAddressError ||
      [
        validateNote(noteValue),
        validateReceiverAddress(receiverAddressValue),
      ].some((value) => !!value)
    ) {
      return;
    }

    logger.debug(
      `${SendAssetModal.name}#${_functionName}: creating unsigned transactions`
    );

    try {
      _transactions = await dispatch(
        createUnsignedTransactionsThunk({
          amountInStandardUnits: amountValue,
          receiverAddress: receiverAddressValue,
          ...(noteValue.length > 0 && {
            note: noteValue,
          }),
        })
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
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    let hasQuestBeenCompletedToday: boolean = false;
    let questsService: QuestsService;
    let questsSent: boolean = false;
    let receiverAccount: IAccount | null;
    let senderAddress: string;
    let transactionIds: string[];

    if (
      !asset ||
      !network ||
      receiverAddressValue.length <= 0 ||
      !sender ||
      !transactions ||
      transactions.length <= 0
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

      receiverAccount =
        accounts.find(
          (value) =>
            convertPublicKeyToAVMAddress(value.publicKey) ===
            receiverAddressValue
        ) || null;
      senderAddress = convertPublicKeyToAVMAddress(sender.publicKey);
      questsService = new QuestsService({
        logger,
      });

      // track the action
      switch (asset?.type) {
        case AssetTypeEnum.ARC0200:
          hasQuestBeenCompletedToday =
            await questsService.hasQuestBeenCompletedTodayByName(
              QuestNameEnum.SendARC0200AssetAction
            );
          questsSent = await questsService.sendARC0200AssetQuest(
            senderAddress,
            receiverAddressValue,
            amountValue,
            {
              appID: asset.id,
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
            senderAddress,
            receiverAddressValue,
            amountValue,
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
            senderAddress,
            receiverAddressValue,
            amountValue,
            {
              assetID: asset.id,
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
          accountIds: receiverAccount
            ? [sender.id, receiverAccount.id]
            : [sender.id],
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
  const handlePreviousClick = () => setTransactions(null);
  const handleSendClick = () => onAuthenticationModalOpen();

  // renders
  const renderContent = () => {
    if (!asset || !network || !sender) {
      return <SendAssetModalContentSkeleton />;
    }

    if (confirming) {
      return (
        <SendAssetModalConfirmingContent
          numberOfTransactions={transactions?.length}
        />
      );
    }

    if (receiverAddressValue && transactions && transactions.length > 0) {
      return (
        <SendAssetModalSummaryContent
          accounts={accounts}
          amountInStandardUnits={amountValue}
          asset={asset}
          fromAccount={sender}
          network={network}
          note={noteValue}
          toAddress={receiverAddressValue}
          transactions={transactions}
        />
      );
    }

    return (
      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*amount*/}
        <AmountInput
          account={sender}
          asset={asset}
          isDisabled={creating}
          label={amountLabel}
          network={network}
          maximumAmountInAtomicUnits={maximumAmountInAtomicUnits}
          onBlur={amountOnBlur({ asset, maximumAmountInAtomicUnits })}
          onChange={amountOnChange}
          onFocus={amountOnFocus}
          onMaximumAmountClick={amountOnMaximumClick}
          required={isAmountRequired}
          value={amountValue}
        />

        {/*select asset*/}
        <AssetSelect
          _context={_context}
          assets={[
            network.nativeCurrency, // add the native currency to the front
            ...allAssets,
          ]}
          disabled={creating}
          label={t<string>('labels.asset')}
          network={network}
          onSelect={handleOnAssetSelect}
          required={true}
          value={asset}
        />

        {/*from account*/}
        <AccountSelect
          _context={_context}
          accounts={availableAccounts}
          disabled={creating}
          label={t<string>('labels.from')}
          onSelect={handleOnSenderAccountSelect}
          required={true}
          selectModalTitle={t<string>('headings.selectSenderAccount')}
          value={sender}
        />

        {/*to address*/}
        <AddressInput
          _context={_context}
          accounts={accounts}
          error={receiverAddressError}
          isDisabled={creating}
          label={receiverAddressLabel}
          onBlur={receiverAddressOnBlur}
          onChange={receiverAddressOnChange}
          onSelect={receiverAddressOnSelect}
          required={isReceiverAddressRequired}
          selectButtonLabel={t<string>('buttons.selectReceiverAccount')}
          selectModalTitle={t<string>('headings.selectReceiverAccount')}
          validate={validateReceiverAddress}
          value={receiverAddressValue}
        />

        {/*note*/}
        <GenericTextarea
          charactersRemaining={noteCharactersRemaining}
          error={noteError}
          label={noteLabel}
          isDisabled={creating}
          onBlur={noteOnBlur}
          onChange={noteOnChange}
          placeholder={t<string>('placeholders.enterNote')}
          required={isNoteRequired}
          resize="vertical"
          validate={validateNote}
          value={noteValue}
        />
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

          <Button
            onClick={handleSendClick}
            rightIcon={<IoArrowUpOutline />}
            size="lg"
            variant="solid"
            w="full"
          >
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
    switch (asset?.type) {
      case AssetTypeEnum.ARC0200:
      case AssetTypeEnum.Native:
        return (
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.sendAsset', {
              asset: asset.symbol,
            })}
          </Heading>
        );
      case AssetTypeEnum.Standard:
        return (
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.sendAsset', {
              asset: asset?.unitName || 'Asset',
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
    let _maximumAmountInAtomicUnits: BigNumber;

    if (!asset || !network || !sender) {
      setMaximumAmountInAtomicUnits('0');

      return;
    }

    _maximumAmountInAtomicUnits = calculateMaxTransactionAmount({
      account: sender,
      asset,
      network,
    });

    setMaximumAmountInAtomicUnits(_maximumAmountInAtomicUnits.toString());

    // if the amount exceeds the new maximum transaction amount, set the amount to the maximum transaction amount
    if (new BigNumber(amountValue).gt(_maximumAmountInAtomicUnits)) {
      setAmountValue(_maximumAmountInAtomicUnits.toString());

      return;
    }
  }, [asset, network, sender]);

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
