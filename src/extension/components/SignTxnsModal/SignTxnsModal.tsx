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
  Skeleton,
  SkeletonCircle,
  Tag,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { decode as decodeBase64 } from '@stablelib/base64';
import { decodeUnsignedTransaction, Transaction } from 'algosdk';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import Button from '@extension/components/Button';
import ChainBadge from '@extension/components/ChainBadge';
import PasswordInput from '@extension/components/PasswordInput';
import AssetTransferTransactionContent from './AssetTransferTransactionContent';
import MultipleTransactionsContent from './MultipleTransactionsContent';
import PaymentTransactionContent from './PaymentTransactionContent';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Enums
import { ErrorCodeEnum } from '@extension/enums';

// Errors
import {
  SerializableOperationCanceledError,
  SerializableUnknownError,
} from '@common/errors';

// Features
import { setError } from '@extension/features/application';
import { sendSignTxnsResponse } from '@extension/features/messages';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSignTxns from '@extension/hooks/useSignTxns';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Selectors
import { useSelectSignTxnsRequest } from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import { IAppThunkDispatch, ISignTxnsRequest } from '@extension/types';

interface IProps {
  onClose: () => void;
}

const SignTxnsModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const defaultTextColor: string = useDefaultTextColor();
  const { encodedSignedTransactions, error, signTransactions } = useSignTxns();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const signTxnsRequest: ISignTxnsRequest | null = useSelectSignTxnsRequest();
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const handleCancelClick = () => {
    if (signTxnsRequest) {
      dispatch(
        sendSignTxnsResponse({
          error: new SerializableOperationCanceledError(
            `user dismissed sign transaction modal`
          ),
          signedTransactions: null,
          tabId: signTxnsRequest.tabId,
        })
      );
    }

    handleClose();
  };
  const handleClose = () => {
    setPassword('');
    setPasswordError(null);
    onClose();
  };
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordError(null);
    setPassword(event.target.value);
  };
  const handleSignClick = async () => {
    if (!signTxnsRequest) {
      return;
    }

    if (password.length <= 0) {
      return setPasswordError(
        t<string>('errors.inputs.required', { name: 'Password' })
      );
    }

    await signTransactions({
      authorizedAddresses: signTxnsRequest.authorizedAddresses,
      password,
      transactions: signTxnsRequest.transactions,
    });
  };
  const renderContent = () => {
    let decodedTransactions: Transaction[];

    if (!signTxnsRequest) {
      return <VStack spacing={4} w="full"></VStack>;
    }

    decodedTransactions = signTxnsRequest.transactions.map((value) =>
      decodeUnsignedTransaction(decodeBase64(value.txn))
    );

    // atomic transfers
    if (decodedTransactions.length > 1) {
      return (
        <MultipleTransactionsContent
          nativeCurrency={signTxnsRequest.network.nativeCurrency}
          network={signTxnsRequest.network}
          transactions={decodedTransactions}
        />
      );
    }

    // single payment transaction
    if (decodedTransactions[0].type === 'pay') {
      return (
        <PaymentTransactionContent
          nativeCurrency={signTxnsRequest.network.nativeCurrency}
          network={signTxnsRequest.network}
          transaction={decodedTransactions[0]}
        />
      );
    }

    // single asset transfer
    if (decodedTransactions[0].type === 'axfer') {
      return (
        <AssetTransferTransactionContent
          nativeCurrency={signTxnsRequest.network.nativeCurrency}
          network={signTxnsRequest.network}
          transaction={decodedTransactions[0]}
        />
      );
    }

    return null;
  };
  const renderHeader = () => {
    if (!signTxnsRequest) {
      return (
        <VStack alignItems="center" justifyContent="flex-start" spacing={2}>
          <HStack
            alignItems="center"
            justifyContent="center"
            spacing={4}
            w="full"
          >
            <SkeletonCircle size="10" />
            <Skeleton>
              <Heading size="md" textAlign="center">
                {faker.commerce.productName()}
              </Heading>
            </Skeleton>
          </HStack>
          <Skeleton>
            <Text fontSize="xs" textAlign="center">
              {faker.internet.domainName()}
            </Text>
          </Skeleton>
          <Skeleton>
            <Text fontSize="xs" textAlign="center">
              {faker.random.words(8)}
            </Text>
          </Skeleton>
          <Skeleton>
            <Tag size="sm">
              <TagLabel>{faker.internet.domainName()}</TagLabel>
            </Tag>
          </Skeleton>
        </VStack>
      );
    }

    return (
      <VStack alignItems="center" justifyContent="flex-start" spacing={2}>
        {/* App icon & name */}
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={4}
          w="full"
        >
          <Avatar
            name={signTxnsRequest.appName}
            size="sm"
            src={signTxnsRequest.iconUrl || undefined}
          />
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {signTxnsRequest.appName}
          </Heading>
        </HStack>
        {/* Host */}
        <Box
          backgroundColor={textBackgroundColor}
          borderRadius={theme.radii['3xl']}
          px={2}
          py={1}
        >
          <Text color={defaultTextColor} fontSize="xs" textAlign="center">
            {signTxnsRequest.host}
          </Text>
        </Box>
        {/* Caption */}
        <Text color={subTextColor} fontSize="md" textAlign="center">
          {t<string>(
            signTxnsRequest.transactions.length > 1
              ? 'captions.signTransactionsRequest'
              : 'captions.signTransactionRequest'
          )}
        </Text>
        {/* Network */}
        <ChainBadge network={signTxnsRequest.network} />
      </VStack>
    );
  };

  useEffect(() => {
    // if the resultant signed transactions has been filled, we can send it back to the dapp
    if (
      signTxnsRequest &&
      encodedSignedTransactions.length === signTxnsRequest.transactions.length
    ) {
      dispatch(
        sendSignTxnsResponse({
          error: null,
          signedTransactions: encodedSignedTransactions,
          tabId: signTxnsRequest.tabId,
        })
      );

      handleClose();
    }
  }, [encodedSignedTransactions]);
  useEffect(() => {
    if (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

          break;
        default:
          dispatch(setError(error));
          handleClose();

          if (signTxnsRequest) {
            dispatch(
              sendSignTxnsResponse({
                error: new SerializableUnknownError(error.message),
                signedTransactions: null,
                tabId: signTxnsRequest.tabId,
              })
            );
          }

          break;
      }
    }
  }, [error]);

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
          {renderHeader()}
        </ModalHeader>
        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>
        <ModalFooter p={DEFAULT_GAP}>
          <VStack alignItems="flex-start" spacing={4} w="full">
            <PasswordInput
              error={passwordError}
              hint={
                signTxnsRequest
                  ? t<string>(
                      signTxnsRequest.transactions.length > 1
                        ? 'captions.mustEnterPasswordToSignTransactions'
                        : 'captions.mustEnterPasswordToSignTransaction'
                    )
                  : null
              }
              onChange={handlePasswordChange}
              value={password}
            />
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
