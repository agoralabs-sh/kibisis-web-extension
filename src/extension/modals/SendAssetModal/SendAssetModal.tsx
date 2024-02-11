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
import { Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import SendAssetModalConfirmingContent from './SendAssetModalConfirmingContent';
import SendAssetModalContentSkeleton from './SendAssetModalContentSkeleton';
import SendAssetModalSummaryContent from './SendAssetModalSummaryContent';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';

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

// selectors
import {
  useSelectAccounts,
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectLogger,
  useSelectPasswordLockPassword,
  useSelectSelectedNetwork,
  useSelectSendAssetAmountInStandardUnits,
  useSelectSendAssetConfirming,
  useSelectSendAssetCreating,
  useSelectSendAssetFromAccount,
  useSelectSendAssetNote,
  useSelectSendAssetSelectedAsset,
  useSelectStandardAssetsBySelectedNetwork,
  useSelectSettings,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAppThunkDispatch,
  IARC0200Asset,
  IAssetTypes,
  INativeCurrency,
  INetworkWithTransactionParams,
  ISettings,
  IStandardAsset,
} from '@extension/types';

// utils
import calculateMaxTransactionAmount from '@extension/utils/calculateMaxTransactionAmount';
import ellipseAddress from '@extension/utils/ellipseAddress';

interface IProps {
  onClose: () => void;
}

const SendAssetModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const passwordInputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const arc200Assets: IARC0200Asset[] =
    useSelectARC0200AssetsBySelectedNetwork();
  const amountInStandardUnits: string =
    useSelectSendAssetAmountInStandardUnits();
  const standardAssets: IStandardAsset[] =
    useSelectStandardAssetsBySelectedNetwork();
  const confirming: boolean = useSelectSendAssetConfirming();
  const creating: boolean = useSelectSendAssetCreating();
  const fromAccount: IAccount | null = useSelectSendAssetFromAccount();
  const logger: ILogger = useSelectLogger();
  const network: INetworkWithTransactionParams | null =
    useSelectSelectedNetwork();
  const note: string | null = useSelectSendAssetNote();
  const passwordLockPassword: string | null = useSelectPasswordLockPassword();
  const selectedAsset: IAssetTypes | INativeCurrency | null =
    useSelectSendAssetSelectedAsset();
  const settings: ISettings = useSelectSettings();
  // hooks
  const {
    error: toAddressError,
    onBlur: onToAddressBlur,
    onChange: onToAddressChange,
    reset: resetToAddress,
    validate: validateToAddress,
    value: toAddress,
  } = useAddressInput();
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
    resetToAddress();
    resetPassword();

    onClose();
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
    const _functionName: string = 'handleNextClick';
    let _transactions: Transaction[];

    if (validateToAddress()) {
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
    }
  };
  const handleNoteChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    dispatch(
      setNote(event.target.value.length > 0 ? event.target.value : null)
    );
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleSendClick();
    }
  };
  const handlePreviousClick = () => {
    resetPassword();
    setTransactions(null);
  };
  const handleSendClick = async () => {
    const _functionName: string = 'handleSendClick';
    let _password: string | null;
    let transactionIds: string[];
    let toAccount: IAccount | null;

    if (!fromAccount || !network || !transactions || transactions.length <= 0) {
      return;
    }

    // if there is no password lock
    if (!settings.security.enablePasswordLock && !passwordLockPassword) {
      // validate the password input
      if (validatePassword()) {
        logger.debug(
          `${SendAssetModal.name}#${_functionName}: password not valid`
        );

        return;
      }
    }

    _password = settings.security.enablePasswordLock
      ? passwordLockPassword
      : password;

    if (!_password) {
      logger.debug(
        `${SendAssetModal.name}#${_functionName}: unable to use password from password lock, value is "null"`
      );

      return;
    }

    try {
      transactionIds = await dispatch(
        submitTransactionThunk({
          password: _password,
          transactions,
        })
      ).unwrap();
      toAccount =
        accounts.find(
          (value) =>
            AccountService.convertPublicKeyToAlgorandAddress(
              value.publicKey
            ) === toAddress
        ) || null;

      logger.debug(
        `${
          SendAssetModal.name
        }#${_functionName}: sent transactions [${transactionIds
          .map((value) => `"${value}"`)
          .join(',')}] to the network`
      );

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
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

          break;
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
  };
  const handleToAddressChange = (value: string) => {
    dispatch(setToAddress(value.length > 0 ? value : null));
    onToAddressChange(value);
  };
  // renders
  const renderContent = () => {
    if (confirming) {
      return <SendAssetModalConfirmingContent />;
    }

    if (fromAccount && network && selectedAsset) {
      if (transactions && transactions.length > 0) {
        return (
          <SendAssetModalSummaryContent
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
          <SendAmountInput
            account={fromAccount}
            disabled={creating}
            network={network}
            maximumTransactionAmount={maximumTransactionAmount}
            onValueChange={handleAmountChange}
            selectedAsset={selectedAsset}
            value={amountInStandardUnits}
          />

          {/*select asset*/}
          <VStack w="full">
            {/*label*/}
            <Text
              color={defaultTextColor}
              fontSize="md"
              textAlign="left"
              w="full"
            >
              {t<string>('labels.asset')}
            </Text>

            <AssetSelect
              account={fromAccount}
              assets={[
                network.nativeCurrency, // add the native currency to the front
                ...allAssets,
              ]}
              disabled={creating}
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
              fontSize="md"
              textAlign="left"
              w="full"
            >
              {t<string>('labels.from')}
            </Text>

            <AccountSelect
              accounts={accounts}
              disabled={creating}
              onSelect={handleFromAccountChange}
              value={fromAccount}
            />
          </VStack>

          {/*to address*/}
          <AddressInput
            accounts={accounts}
            disabled={creating}
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
              fontSize="md"
              textAlign="left"
              w="full"
            >
              {t<string>('labels.noteOptional')}
            </Text>

            <Textarea
              focusBorderColor={primaryColor}
              isDisabled={creating}
              onChange={handleNoteChange}
              placeholder={t<string>('placeholders.enterNote')}
              resize="vertical"
              size="md"
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

    if (transactions && transactions.length > 0) {
      return (
        <VStack alignItems="flex-start" spacing={4} w="full">
          {!settings.security.enablePasswordLock && !passwordLockPassword && (
            <PasswordInput
              error={passwordError}
              hint={t<string>('captions.mustEnterPasswordToSendTransaction')}
              onChange={onPasswordChange}
              onKeyUp={handleKeyUpPasswordInput}
              inputRef={passwordInputRef}
              value={password}
            />
          )}

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

        <Button
          isLoading={creating}
          onClick={handleNextClick}
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
    if (transactions && transactions.length > 0 && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [transactions]);
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
          {renderHeader()}
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
