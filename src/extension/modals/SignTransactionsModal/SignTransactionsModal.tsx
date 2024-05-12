import {
  ARC0027ErrorCodeEnum,
  ARC0027MethodCanceledError,
  ARC0027MethodEnum,
} from '@agoralabs-sh/avm-web-provider';
import {
  Avatar,
  Box,
  Heading,
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
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import AtomicTransactionsContent from './AtomicTransactionsContent';
import MultipleTransactionsContent from './MultipleTransactionsContent';
import SignTxnsHeaderSkeleton from './SignTxnsHeaderSkeleton';
import SingleTransactionContent from './SingleTransactionContent';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// contexts
import { MultipleTransactionsContext } from './contexts';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// features
import { sendSignTransactionsResponseThunk } from '@extension/features/messages';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';
import useAuthorizedAccounts from './hooks/useAuthorizedAccounts';
import useUpdateStandardAssetInformation from './hooks/useUpdateStandardAssetInformation';

// selectors
import {
  useSelectLogger,
  useSelectSignTransactionsRequest,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import type { IAppThunkDispatch } from '@extension/types';
import type { ISignTransactionsModalProps } from './types';

// utils
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import groupTransactions from '@extension/utils/groupTransactions';
import signTransactions from '@extension/utils/signTransactions';

const SignTransactionsModal: FC<ISignTransactionsModalProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const logger = useSelectLogger();
  const signTransactionsRequest = useSelectSignTransactionsRequest();
  // hooks
  const authorizedAccounts = useAuthorizedAccounts(signTransactionsRequest);
  const defaultTextColor = useDefaultTextColor();
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const subTextColor = useSubTextColor();
  const textBackgroundColor = useTextBackgroundColor();
  // states
  const [moreDetailsTransactions, setMoreDetailsTransactions] = useState<
    Transaction[] | null
  >(null);
  // handlers
  const handleCancelClick = () => {
    if (signTransactionsRequest) {
      dispatch(
        sendSignTransactionsResponseThunk({
          error: new ARC0027MethodCanceledError({
            message: `user dismissed sign transaction modal`,
            method: ARC0027MethodEnum.SignTransactions,
            providerId: __PROVIDER_ID__,
          }),
          event: signTransactionsRequest,
          stxns: null,
        })
      );
    }

    handleClose();
  };
  const handleClose = () => {
    onClose();
    resetPassword();
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
      !signTransactionsRequest ||
      !signTransactionsRequest.payload.message.params
    ) {
      return;
    }

    try {
      stxns = await signTransactions({
        authorizedSigners: authorizedAccounts.map((value) =>
          AccountService.convertPublicKeyToAlgorandAddress(value.publicKey)
        ),
        logger,
        password,
        txns: signTransactionsRequest.payload.message.params.txns,
      });

      dispatch(
        sendSignTransactionsResponseThunk({
          error: null,
          event: signTransactionsRequest,
          stxns,
        })
      );

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
              event: signTransactionsRequest,
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

    if (
      !signTransactionsRequest ||
      !signTransactionsRequest.payload.message.params
    ) {
      return <VStack spacing={DEFAULT_GAP - 2} w="full"></VStack>;
    }

    decodedTransactions =
      signTransactionsRequest.payload.message.params.txns.map((value) =>
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
  const renderHeader = () => {
    if (
      !signTransactionsRequest ||
      !signTransactionsRequest.payload.message.params
    ) {
      return <SignTxnsHeaderSkeleton />;
    }

    return (
      <>
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={DEFAULT_GAP - 2}
          w="full"
        >
          {/*app icon*/}
          <Avatar
            name={signTransactionsRequest.payload.message.clientInfo.appName}
            size="md"
            src={
              signTransactionsRequest.payload.message.clientInfo.iconUrl ||
              undefined
            }
          />

          <VStack
            alignItems="flex-start"
            justifyContent="space-evenly"
            spacing={1}
            w="full"
          >
            {/*app name*/}
            <Heading color={defaultTextColor} size="md" textAlign="center">
              {signTransactionsRequest.payload.message.clientInfo.appName}
            </Heading>

            {/*host*/}
            <Box
              backgroundColor={textBackgroundColor}
              borderRadius={theme.radii['3xl']}
              px={DEFAULT_GAP / 3}
              py={1}
            >
              <Text color={defaultTextColor} fontSize="xs" textAlign="center">
                {signTransactionsRequest.payload.message.clientInfo.host}
              </Text>
            </Box>
          </VStack>
        </HStack>

        {/*caption*/}
        <Text color={subTextColor} fontSize="md" textAlign="center">
          {t<string>(
            signTransactionsRequest.payload.message.params.txns.length > 1
              ? 'captions.signTransactionsRequest'
              : 'captions.signTransactionRequest'
          )}
        </Text>
      </>
    );
  };

  useUpdateStandardAssetInformation(signTransactionsRequest);

  return (
    <Modal
      initialFocusRef={passwordInputRef}
      isOpen={!!signTransactionsRequest}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor="var(--chakra-colors-chakra-body-bg)"
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <VStack alignItems="center" spacing={DEFAULT_GAP - 2} w="full">
            {renderHeader()}
          </VStack>
        </ModalHeader>

        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
            {/*password input*/}
            <PasswordInput
              error={passwordError}
              hint={
                signTransactionsRequest &&
                signTransactionsRequest.payload.message.params
                  ? t<string>(
                      signTransactionsRequest.payload.message.params.txns
                        .length > 1
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
