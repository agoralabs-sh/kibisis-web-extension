import {
  ARC0027ErrorCodeEnum,
  ARC0027MethodCanceledError,
  ARC0027MethodEnum,
} from '@agoralabs-sh/avm-web-provider';
import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import { decode as decodeBase64 } from '@stablelib/base64';
import { Transaction } from 'algosdk';
import React, { FC, KeyboardEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import ClientHeader, {
  ClientHeaderSkeleton,
} from '@extension/components/ClientHeader';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import AtomicTransactionsContent from './AtomicTransactionsContent';
import MultipleTransactionsContent from './MultipleTransactionsContent';
import SingleTransactionContent from './SingleTransactionContent';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// contexts
import { MultipleTransactionsContext } from './contexts';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// features
import { removeEventByIdThunk } from '@extension/features/events';
import { sendSignTransactionsResponseThunk } from '@extension/features/messages';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useSignTransactionsModal from './hooks/useSignTransactionsModal';

// selectors
import { useSelectLogger, useSelectNetworks } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppThunkDispatch, IModalProps } from '@extension/types';

// utils
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import groupTransactions from '@extension/utils/groupTransactions';
import signTransactions from './utils/signTransactions';

const SignTransactionsModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const logger = useSelectLogger();
  const networks = useSelectNetworks();
  // hooks
  const { authorizedAccounts, event, setAuthorizedAccounts } =
    useSignTransactionsModal();
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const subTextColor = useSubTextColor();
  // states
  const [moreDetailsTransactions, setMoreDetailsTransactions] = useState<
    Transaction[] | null
  >(null);
  // handlers
  const handleCancelClick = async () => {
    if (event) {
      await dispatch(
        sendSignTransactionsResponseThunk({
          error: new ARC0027MethodCanceledError({
            message: `user dismissed sign transaction modal`,
            method: ARC0027MethodEnum.SignTransactions,
            providerId: __PROVIDER_ID__,
          }),
          event,
          stxns: null,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    handleClose();
  };
  const handleClose = () => {
    resetPassword();
    setAuthorizedAccounts(null);

    if (onClose) {
      onClose();
    }
  };
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleSignClick();
    }
  };
  const handlePreviousClick = () => setMoreDetailsTransactions(null);
  const handleSignClick = async () => {
    let stxns: (string | null)[];

    if (
      validatePassword() ||
      !event ||
      !event.payload.message.params ||
      !authorizedAccounts
    ) {
      return;
    }

    try {
      stxns = await signTransactions({
        arc001Transactions: event.payload.message.params.txns,
        authorizedAccounts,
        logger,
        networks,
        password,
      });

      // send a response
      await dispatch(
        sendSignTransactionsResponseThunk({
          error: null,
          event,
          stxns,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();

      handleClose();
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

          break;
        case ARC0027ErrorCodeEnum.UnauthorizedSignerError:
          dispatch(
            sendSignTransactionsResponseThunk({
              error,
              event,
              stxns: null,
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
  const renderContent = () => {
    let decodedTransactions: Transaction[];
    let groupsOfTransactions: Transaction[][];

    if (!event || !event.payload.message.params) {
      return <VStack spacing={DEFAULT_GAP - 2} w="full"></VStack>;
    }

    decodedTransactions = event.payload.message.params.txns.map((value) =>
      decodeUnsignedTransaction(decodeBase64(value.txn))
    );
    groupsOfTransactions = groupTransactions(decodedTransactions);

    // if we have multiple groups/single transactions
    if (groupsOfTransactions.length > 1) {
      return (
        <MultipleTransactionsContext.Provider
          value={{
            moreDetailsTransactions,
            setMoreDetailsTransactions,
          }}
        >
          <MultipleTransactionsContent
            groupsOfTransactions={groupsOfTransactions}
          />
        </MultipleTransactionsContext.Provider>
      );
    }

    // if the group of transactions is a greater that one, it will be atomic transactions
    if (groupsOfTransactions[0].length > 1) {
      return (
        <AtomicTransactionsContent transactions={groupsOfTransactions[0]} />
      );
    }

    // otherwise it is a single transaction
    return (
      <SingleTransactionContent transaction={groupsOfTransactions[0][0]} />
    );
  };

  return (
    <Modal
      initialFocusRef={passwordInputRef}
      isOpen={!!event}
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
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          {event && event.payload.message.params ? (
            <VStack alignItems="center" spacing={DEFAULT_GAP - 2} w="full">
              <ClientHeader
                description={
                  event.payload.message.clientInfo.description || undefined
                }
                iconUrl={event.payload.message.clientInfo.iconUrl || undefined}
                host={event.payload.message.clientInfo.host || 'unknown host'}
                name={event.payload.message.clientInfo.appName || 'Unknown'}
              />

              {/*caption*/}
              <Text color={subTextColor} fontSize="sm" textAlign="center">
                {t<string>(
                  event.payload.message.params.txns.length > 1
                    ? 'captions.signTransactionsRequest'
                    : 'captions.signTransactionRequest'
                )}
              </Text>
            </VStack>
          ) : (
            <ClientHeaderSkeleton />
          )}
        </ModalHeader>

        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
            {/*password input*/}
            <PasswordInput
              error={passwordError}
              hint={
                event && event.payload.message.params
                  ? t<string>(
                      event.payload.message.params.txns.length > 1
                        ? 'captions.mustEnterPasswordToSignTransactions'
                        : 'captions.mustEnterPasswordToSignTransaction'
                    )
                  : null
              }
              inputRef={passwordInputRef}
              onChange={onPasswordChange}
              onKeyUp={handleKeyUpPasswordInput}
              value={password}
            />

            {/*buttons*/}
            <HStack spacing={DEFAULT_GAP - 2} w="full">
              {moreDetailsTransactions && moreDetailsTransactions.length > 0 ? (
                // previous button
                <Button
                  leftIcon={<IoArrowBackOutline />}
                  onClick={handlePreviousClick}
                  size="lg"
                  variant="outline"
                  w="full"
                >
                  {t<string>('buttons.previous')}
                </Button>
              ) : (
                // cancel button
                <Button
                  onClick={handleCancelClick}
                  size="lg"
                  variant="outline"
                  w="full"
                >
                  {t<string>('buttons.cancel')}
                </Button>
              )}

              {/*sign button*/}
              <Button
                onClick={handleSignClick}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.sign')}
              </Button>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignTransactionsModal;
