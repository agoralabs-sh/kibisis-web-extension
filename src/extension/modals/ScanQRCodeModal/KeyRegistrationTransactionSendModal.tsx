import {
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
  decodeURLSafe as decodeBase64URLSafe,
  encode as encodeBase64,
} from '@stablelib/base64';
import { Transaction } from 'algosdk';
import React, { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import KeyRegistrationTransactionModalContent from '@extension/components/KeyRegistrationTransactionModalContent';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import {
  ARC0300QueryEnum,
  ErrorCodeEnum,
  TransactionTypeEnum,
} from '@extension/enums';

// features
import { updateAccountsThunk } from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import {
  useSelectAccountByAddress,
  useSelectLogger,
  useSelectNetworks,
  useSelectPasswordLockPassword,
  useSelectSettings,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
} from '@extension/types';
import type { IModalContentProps } from './types';

// utils
import createUnsignedKeyRegistrationTransactionFromSchema from '@extension/utils/createUnsignedKeyRegistrationTransactionFromSchema';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import signAndSendTransactions from '@extension/utils/signAndSendTransactions';

const KeyRegistrationTransactionSendModal: FC<
  IModalContentProps<
    | IARC0300OfflineKeyRegistrationTransactionSendSchema
    | IARC0300OnlineKeyRegistrationTransactionSendSchema
  >
> = ({ onComplete, onPreviousClick, schema }) => {
  const { t } = useTranslation();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // selectors
  const account = useSelectAccountByAddress(
    schema.query[ARC0300QueryEnum.Sender]
  );
  const logger = useSelectLogger();
  const passwordLockPassword = useSelectPasswordLockPassword();
  const networks = useSelectNetworks();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const {
    error: passwordError,
    onChange: onPasswordChange,
    reset: resetPassword,
    setError: setPasswordError,
    validate: validatePassword,
    value: password,
  } = usePassword();
  // states
  const [sending, setSending] = useState<boolean>(false);
  const [unsignedTransaction, setUnsignedTransaction] =
    useState<Transaction | null>(null);
  // misc
  const genesisHash = schema.query[ARC0300QueryEnum.GenesisHash];
  const isOnlineKeyRegistrationTransaction = (
    _schema:
      | IARC0300OfflineKeyRegistrationTransactionSendSchema
      | IARC0300OnlineKeyRegistrationTransactionSendSchema
  ) =>
    _schema.query[ARC0300QueryEnum.SelectionKey] &&
    _schema.query[ARC0300QueryEnum.StateProofKey] &&
    _schema.query[ARC0300QueryEnum.VoteFirst] &&
    _schema.query[ARC0300QueryEnum.VoteKey] &&
    _schema.query[ARC0300QueryEnum.VoteKeyDilution] &&
    _schema.query[ARC0300QueryEnum.VoteLast];
  const network = genesisHash
    ? networks.find(
        (value) =>
          value.genesisHash === encodeBase64(decodeBase64URLSafe(genesisHash))
      ) || null
    : selectNetworkFromSettings(networks, settings) ||
      selectDefaultNetwork(networks); // if we have the genesis hash get the network, otherwise get the selected network
  const reset = () => {
    resetPassword();
    setSending(false);
    setUnsignedTransaction(null);
  };
  // handlers
  const handleKeyUpPasswordInput = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleSendClick();
    }
  };
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onOpen() : onClose();
  const handleOnComplete = () => {
    reset();
    onComplete();
  };
  const handlePreviousClick = () => {
    reset();
    onPreviousClick();
  };
  const handleSendClick = async () => {
    const _functionName: string = 'handleSendClick';
    let _password: string | null;
    let transactionIds: string[];

    if (!unsignedTransaction) {
      return;
    }

    if (!account) {
      dispatch(
        createNotification({
          ephemeral: true,
          title: t<string>('headings.unknownAccount'),
          type: 'error',
        })
      );

      return;
    }

    if (!network) {
      dispatch(
        createNotification({
          ephemeral: true,
          title: t<string>('headings.unknownNetwork'),
          type: 'error',
        })
      );

      return;
    }

    // if there is no password lock
    if (!settings.security.enablePasswordLock && !passwordLockPassword) {
      // validate the password input
      if (validatePassword()) {
        logger.debug(
          `${KeyRegistrationTransactionSendModal.name}#${_functionName}: password not valid`
        );

        return;
      }
    }

    _password = settings.security.enablePasswordLock
      ? passwordLockPassword
      : password;

    if (!_password) {
      logger.debug(
        `${KeyRegistrationTransactionSendModal.name}#${_functionName}: unable to use password from password lock, value is "null"`
      );

      return;
    }

    setSending(true);

    try {
      transactionIds = await signAndSendTransactions({
        logger,
        network,
        password,
        unsignedTransactions: [unsignedTransaction],
      });

      logger.debug(
        `${
          KeyRegistrationTransactionSendModal.name
        }#${_functionName}: sent transactions [${transactionIds
          .map((value) => `"${value}"`)
          .join(',')}] to the network`
      );

      // send a success transaction notification
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
          accountIds: [account.id],
          forceInformationUpdate: true,
          refreshTransactions: true,
        })
      );

      // clean up and close
      handleOnComplete();
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

    setSending(false);
  };

  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    if (account && network) {
      (async () =>
        setUnsignedTransaction(
          await createUnsignedKeyRegistrationTransactionFromSchema({
            logger,
            network,
            schema,
          })
        ))();
    }
  }, [account, network, schema]);

  return (
    <ModalContent
      backgroundColor={BODY_BACKGROUND_COLOR}
      borderTopRadius={theme.radii['3xl']}
      borderBottomRadius={0}
    >
      {/*header*/}
      <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
        <Heading color={defaultTextColor} size="md" textAlign="center">
          {t<string>(
            isOnlineKeyRegistrationTransaction(schema)
              ? `headings.transaction_${TransactionTypeEnum.KeyRegistrationOnline}`
              : `headings.transaction_${TransactionTypeEnum.KeyRegistrationOffline}`
          )}
        </Heading>
      </ModalHeader>

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP}>
        <VStack alignItems="center" flexGrow={1} spacing={DEFAULT_GAP} w="full">
          <Text color={defaultTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.keyRegistrationURI', {
              status: isOnlineKeyRegistrationTransaction(schema)
                ? 'online'
                : 'offline',
            })}
          </Text>

          {!account || !network || !unsignedTransaction ? (
            <VStack spacing={DEFAULT_GAP / 3} w="full">
              <ModalSkeletonItem />
              <ModalSkeletonItem />
              <ModalSkeletonItem />
            </VStack>
          ) : (
            <KeyRegistrationTransactionModalContent
              account={account}
              condensed={{
                expanded: isOpen,
                onChange: handleMoreInformationToggle,
              }}
              network={network}
              transaction={unsignedTransaction}
            />
          )}
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP}>
        <VStack alignItems="flex-start" spacing={DEFAULT_GAP - 2} w="full">
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

          <HStack spacing={DEFAULT_GAP - 2} w="full">
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

            {/*send button*/}
            <Button
              isLoading={sending}
              onClick={handleSendClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.send')}
            </Button>
          </HStack>
        </VStack>
      </ModalFooter>
    </ModalContent>
  );
};

export default KeyRegistrationTransactionSendModal;
