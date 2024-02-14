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
import React, {
  FC,
  KeyboardEvent,
  MutableRefObject,
  useEffect,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import SignTxnsHeaderSkeleton from './SignTxnsHeaderSkeleton';
import SignTxnsModalContent from './SignTxnsModalContent';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { Arc0027ErrorCodeEnum, Arc0027ProviderMethodEnum } from '@common/enums';
import { ErrorCodeEnum } from '@extension/enums';

// errors
import { SerializableArc0027MethodCanceledError } from '@common/errors';

// features
import { sendSignTxnsResponseThunk } from '@extension/features/messages';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';
import useAuthorizedAccounts from './hooks/useAuthorizedAccounts';

// messages
import { Arc0027SignTxnsRequestMessage } from '@common/messages';

// selectors
import {
  useSelectLogger,
  useSelectSignTxnsRequest,
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
  IClientRequest,
} from '@extension/types';

// utils
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import signTxns from '@extension/utils/signTxns';

interface IProps {
  onClose: () => void;
}

const SignTxnsModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const passwordInputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const logger: ILogger = useSelectLogger();
  const signTxnsRequest: IClientRequest<Arc0027SignTxnsRequestMessage> | null =
    useSelectSignTxnsRequest();
  // hooks
  const authorizedAccounts: IAccount[] = useAuthorizedAccounts(signTxnsRequest);
  const defaultTextColor: string = useDefaultTextColor();
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  // handlers
  const handleCancelClick = () => {
    if (signTxnsRequest) {
      dispatch(
        sendSignTxnsResponseThunk({
          error: new SerializableArc0027MethodCanceledError(
            Arc0027ProviderMethodEnum.SignTxns,
            __PROVIDER_ID__,
            `user dismissed sign transaction modal`
          ),
          eventId: signTxnsRequest.eventId,
          originMessage: signTxnsRequest.originMessage,
          originTabId: signTxnsRequest.originTabId,
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
  const handleSignClick = async () => {
    let stxns: (string | null)[];

    if (
      validatePassword() ||
      !signTxnsRequest ||
      !signTxnsRequest.originMessage.params
    ) {
      return;
    }

    try {
      stxns = await signTxns({
        authorizedSigners: authorizedAccounts.map((value) =>
          AccountService.convertPublicKeyToAlgorandAddress(value.publicKey)
        ),
        logger,
        password,
        txns: signTxnsRequest.originMessage.params.txns,
      });

      dispatch(
        sendSignTxnsResponseThunk({
          error: null,
          eventId: signTxnsRequest.eventId,
          originMessage: signTxnsRequest.originMessage,
          originTabId: signTxnsRequest.originTabId,
          stxns,
        })
      );

      handleClose();
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

          break;
        case Arc0027ErrorCodeEnum.UnauthorizedSignerError:
          dispatch(
            sendSignTxnsResponseThunk({
              error,
              eventId: signTxnsRequest.eventId,
              originMessage: signTxnsRequest.originMessage,
              originTabId: signTxnsRequest.originTabId,
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

    if (!signTxnsRequest || !signTxnsRequest.originMessage.params) {
      return <VStack spacing={4} w="full"></VStack>;
    }

    decodedTransactions = signTxnsRequest.originMessage.params.txns.map(
      (value) => decodeUnsignedTransaction(decodeBase64(value.txn))
    );

    return <SignTxnsModalContent transactions={decodedTransactions} />;
  };
  const renderHeader = () => {
    if (!signTxnsRequest || !signTxnsRequest.originMessage.params) {
      return <SignTxnsHeaderSkeleton />;
    }

    return (
      <>
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={4}
          w="full"
        >
          {/*app icon*/}
          <Avatar
            name={signTxnsRequest.clientInfo.appName}
            size="sm"
            src={signTxnsRequest.clientInfo.iconUrl || undefined}
          />

          {/*app name*/}
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {signTxnsRequest.clientInfo.appName}
          </Heading>
        </HStack>

        {/*host*/}
        <Box
          backgroundColor={textBackgroundColor}
          borderRadius={theme.radii['3xl']}
          px={DEFAULT_GAP / 3}
          py={1}
        >
          <Text color={defaultTextColor} fontSize="xs" textAlign="center">
            {signTxnsRequest.clientInfo.host}
          </Text>
        </Box>

        {/*caption*/}
        <Text color={subTextColor} fontSize="md" textAlign="center">
          {t<string>(
            signTxnsRequest.originMessage.params.txns.length > 1
              ? 'captions.signTransactionsRequest'
              : 'captions.signTransactionRequest'
          )}
        </Text>
      </>
    );
  };

  // focus when the modal is opened
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  return (
    <Modal
      isOpen={!!signTxnsRequest}
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
          <VStack alignItems="center" spacing={5} w="full">
            {renderHeader()}
          </VStack>
        </ModalHeader>

        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <VStack alignItems="flex-start" spacing={4} w="full">
            {/*password input*/}
            <PasswordInput
              error={passwordError}
              hint={
                signTxnsRequest && signTxnsRequest.originMessage.params
                  ? t<string>(
                      signTxnsRequest.originMessage.params.txns.length > 1
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
            <HStack spacing={4} w="full">
              <Button
                onClick={handleCancelClick}
                size="lg"
                variant="outline"
                w="full"
              >
                {t<string>('buttons.cancel')}
              </Button>
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

export default SignTxnsModal;
