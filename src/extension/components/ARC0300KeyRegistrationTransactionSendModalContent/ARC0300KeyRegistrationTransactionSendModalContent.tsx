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
import type { Transaction } from 'algosdk';
import React, { type FC, useEffect, useState } from 'react';
import { IoArrowUpOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import KeyRegistrationTransactionModalBody from '@extension/components/KeyRegistrationTransactionModalBody';
import ModalSkeletonItem from '@extension/components/ModalSkeletonItem';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// enums
import {
  ARC0300QueryEnum,
  ErrorCodeEnum,
  TransactionTypeEnum,
} from '@extension/enums';

// errors
import {
  BaseExtensionError,
  NotEnoughMinimumBalanceError,
} from '@extension/errors';

// features
import { updateAccountsThunk } from '@extension/features/accounts';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// modals
import AuthenticationModal from '@extension/modals/AuthenticationModal';
import NetworkClient from '@extension/models/NetworkClient';

// selectors
import {
  useSelectAccountByAddress,
  useSelectAccounts,
  useSelectLogger,
  useSelectNetworks,
  useSelectSettings,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IARC0300ModalContentProps,
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
  IMainRootState,
  INetworkWithTransactionParams,
  TEncryptionCredentials,
} from '@extension/types';

// utils
import createUnsignedKeyRegistrationTransactionFromSchema from '@extension/utils/createUnsignedKeyRegistrationTransactionFromSchema';
import doesAccountFallBelowMinimumBalanceRequirementForTransactions from '@extension/utils/doesAccountFallBelowMinimumBalanceRequirementForTransactions';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';
import signTransaction from '@extension/utils/signTransaction';

const ARC0300KeyRegistrationTransactionSendModalContent: FC<
  IARC0300ModalContentProps<
    | IARC0300OfflineKeyRegistrationTransactionSendSchema
    | IARC0300OnlineKeyRegistrationTransactionSendSchema
  >
> = ({
  cancelButtonIcon,
  cancelButtonLabel,
  onComplete,
  onCancel,
  schemaOrSchemas: schema,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const {
    isOpen: isAuthenticationModalOpen,
    onClose: onAuthenticationModalClose,
    onOpen: onAuthenticationModalOpen,
  } = useDisclosure();
  const {
    isOpen: isMoreInformationToggleOpen,
    onOpen: onMoreInformationOpen,
    onClose: onMoreInformationClose,
  } = useDisclosure();
  // selectors
  const account = useSelectAccountByAddress(
    schema.query[ARC0300QueryEnum.Sender]
  );
  const accounts = useSelectAccounts();
  const logger = useSelectLogger();
  const networks = useSelectNetworks();
  const settings = useSelectSettings();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  // states
  const [network, setNetwork] = useState<INetworkWithTransactionParams | null>(
    null
  );
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
  const reset = () => {
    setSending(false);
    setUnsignedTransaction(null);
  };
  // handlers
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onMoreInformationOpen() : onMoreInformationClose();
  const handleOnComplete = () => {
    reset();
    onComplete();
  };
  const handleCancelClick = () => {
    reset();
    onCancel();
  };
  const handleError = (error: BaseExtensionError) =>
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
  const handleOnAuthenticationModalConfirm = async (
    result: TEncryptionCredentials
  ) => {
    const _functionName = 'handleOnAuthenticationModalConfirm';
    let networkClient: NetworkClient;
    let signedTransaction: Uint8Array;

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

    setSending(true);

    try {
      if (
        doesAccountFallBelowMinimumBalanceRequirementForTransactions({
          account,
          logger,
          network,
          transactions: [unsignedTransaction],
        })
      ) {
        throw new NotEnoughMinimumBalanceError(
          `unable to send key registration transaction because the account will fall below the minimum balance`
        );
      }

      signedTransaction = await signTransaction({
        accounts,
        authAccounts: accounts,
        logger,
        networks,
        unsignedTransaction,
        ...result,
      });

      networkClient = new NetworkClient({ logger, network });

      await networkClient.sendTransactions({
        nodeID: selectNodeIDByGenesisHashFromSettings({
          genesisHash: network.genesisHash,
          settings,
        }),
        signedTransactions: [signedTransaction],
      });

      logger.debug(
        `${
          ARC0300KeyRegistrationTransactionSendModalContent.name
        }#${_functionName}: sent transaction "${unsignedTransaction.txID()}" to the network`
      );

      // send a success transaction notification
      dispatch(
        createNotification({
          description: t<string>('captions.transactionsSentSuccessfully', {
            amount: 1,
          }),
          title: t<string>('headings.transactionsSuccessful'),
          type: 'success',
        })
      );

      // force update the account information as we spent fees and refresh all the new transactions
      dispatch(
        updateAccountsThunk({
          accountIDs: [account.id],
          forceInformationUpdate: true,
          refreshTransactions: true,
        })
      );

      // clean up and close
      handleOnComplete();
    } catch (error) {
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
    }

    setSending(false);
  };
  const handleSendClick = () => onAuthenticationModalOpen();

  useEffect(() => {
    let _genesisHash: string;
    let _network: INetworkWithTransactionParams | null;

    if (genesisHash) {
      _genesisHash = encodeBase64(decodeBase64URLSafe(genesisHash));
      _network =
        networks.find((value) => value.genesisHash === _genesisHash) || null;

      setNetwork(_network);

      return;
    }

    _network = selectNetworkFromSettings({
      networks,
      settings,
      withDefaultFallback: true,
    });

    setNetwork(_network);
  }, [genesisHash]);
  useEffect(() => {
    if (account && network) {
      (async () =>
        setUnsignedTransaction(
          await createUnsignedKeyRegistrationTransactionFromSchema({
            logger,
            network,
            nodeID: selectNodeIDByGenesisHashFromSettings({
              genesisHash: network.genesisHash,
              settings,
            }),
            schema,
          })
        ))();
    }
  }, [account, network, schema]);

  return (
    <>
      {/*authentication*/}
      <AuthenticationModal
        isOpen={isAuthenticationModalOpen}
        onClose={onAuthenticationModalClose}
        onConfirm={handleOnAuthenticationModalConfirm}
        onError={handleError}
        passwordHint={t<string>('captions.mustEnterPasswordToSendTransaction')}
      />

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
          <VStack
            alignItems="center"
            flexGrow={1}
            spacing={DEFAULT_GAP}
            w="full"
          >
            <Text color={defaultTextColor} fontSize="s," textAlign="center">
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
              <KeyRegistrationTransactionModalBody
                account={account}
                accounts={accounts}
                condensed={{
                  expanded: isMoreInformationToggleOpen,
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
          <HStack spacing={DEFAULT_GAP - 2} w="full">
            {/*cancel button*/}
            <Button
              leftIcon={cancelButtonIcon}
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {cancelButtonLabel || t<string>('buttons.cancel')}
            </Button>

            {/*send button*/}
            <Button
              isLoading={sending}
              onClick={handleSendClick}
              rightIcon={<IoArrowUpOutline />}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.send')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default ARC0300KeyRegistrationTransactionSendModalContent;
