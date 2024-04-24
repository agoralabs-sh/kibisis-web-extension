import {
  ARC0027MethodCanceledError,
  ARC0027MethodEnum,
  ISignMessageParams,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';
import {
  Avatar,
  Box,
  Code,
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
import React, {
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
import AccountItem from '@extension/components/AccountItem';
import Button from '@extension/components/Button';
import PasswordInput, {
  usePassword,
} from '@extension/components/PasswordInput';
import SignMessageContentSkeleton from './SignMessageContentSkeleton';
import SignBytesJwtContent from './SignBytesJwtContent';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { ARC0027ProviderMethodEnum } from '@common/enums';
import { ErrorCodeEnum } from '@extension/enums';

// errors
import { SerializableARC0027MethodCanceledError } from '@common/errors';

// features
import { sendSignMessageResponseThunk } from '@extension/features/messages';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// messages
import { ClientRequestMessage } from '@common/messages';

// selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectLogger,
  useSelectSessions,
  useSelectSignMessageRequest,
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
  IClientRequestEventPayload,
  IEvent,
  ISession,
} from '@extension/types';
import type { ISignMessageModalProps } from './types';

// utils
import getAuthorizedAddressesForHost from '@extension/utils/getAuthorizedAddressesForHost';
import signBytes from '@extension/utils/signBytes';

const SignMessageModal: FC<ISignMessageModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const passwordInputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const fetching: boolean = useSelectFetchingAccounts();
  const logger: ILogger = useSelectLogger();
  const sessions: ISession[] = useSelectSessions();
  const signMessageRequest: IEvent<
    IClientRequestEventPayload<ISignMessageParams>
  > | null = useSelectSignMessageRequest();
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
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  // state
  const [authorizedAccounts, setAuthorizedAccounts] = useState<IAccount[]>([]);
  const [decodedJwt, setDecodedJwt] = useState<IDecodedJwt | null>(null);
  const [selectedSigner, setSelectedSigner] = useState<IAccount | null>(null);
  // handlers
  const handleAccountSelect = (account: IAccount) => setSelectedSigner(account);
  const handleCancelClick = () => {
    if (signMessageRequest) {
      dispatch(
        sendSignMessageResponseThunk({
          error: new ARC0027MethodCanceledError({
            message: `user dismissed sign message modal`,
            method: ARC0027MethodEnum.SignMessage,
            providerId: __PROVIDER_ID__,
          }),
          event: signMessageRequest,
          signature: null,
          signer: null,
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
    let signature: string;
    let signer: string;

    if (
      validatePassword() ||
      !signMessageRequest ||
      !signBytesRequest.originMessage.params?.data ||
      !selectedSigner
    ) {
      return;
    }

    signer = AccountService.convertPublicKeyToAlgorandAddress(
      selectedSigner.publicKey
    );

    try {
      signature = await signBytes({
        encodedData: signBytesRequest.originMessage.params.data,
        logger,
        password,
        signer,
      });

      dispatch(
        sendSignMessageResponseThunk({
          error: null,
          event: signMessageRequest,
          signature,
        })
      );

      handleClose();
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

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
    if (fetching || !signMessageRequest || !selectedSigner) {
      return <SignMessageContentSkeleton />;
    }

    return (
      <VStack spacing={4} w="full">
        {/*account select*/}
        <VStack spacing={2} w="full">
          {signBytesRequest.originMessage.params?.signer ? (
            <>
              <Text textAlign="left" w="full">{`${t<string>(
                'labels.addressToSign'
              )}:`}</Text>
              <AccountItem account={selectedSigner} />
            </>
          ) : (
            <>
              <Text textAlign="left" w="full">{`${t<string>(
                'labels.authorizedAddresses'
              )}:`}</Text>
              <AccountSelect
                accounts={authorizedAccounts}
                onSelect={handleAccountSelect}
                value={selectedSigner}
              />
            </>
          )}
        </VStack>

        {/*data display*/}
        {decodedJwt ? (
          <SignBytesJwtContent
            decodedJwt={decodedJwt}
            host={signBytesRequest.clientInfo.host}
            signer={selectedSigner}
          />
        ) : (
          <VStack spacing={2} w="full">
            <Text textAlign="left" w="full">{`${t<string>(
              'labels.message'
            )}:`}</Text>
            {signBytesRequest.originMessage.params && (
              <Code borderRadius="md" w="full">
                {window.atob(signBytesRequest.originMessage.params.data)}
              </Code>
            )}
          </VStack>
        )}
      </VStack>
    );
  };

  // focus when the modal is opened
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);
  // when we have accounts, sessions and the request, update the authored accounts and get the signer, if it exists and is authorized
  useEffect(() => {
    let _authorizedAccounts: IAccount[];
    let authorizedAddresses: string[];
    let signerAccount: IAccount | null = null;

    if (accounts.length >= 0 && sessions.length > 0 && signMessageRequest) {
      authorizedAddresses = getAuthorizedAddressesForHost(
        signMessageRequest.payload.message.clientInfo.host,
        sessions
      );
      _authorizedAccounts = accounts.filter((account) =>
        authorizedAddresses.some(
          (value) =>
            value ===
            AccountService.convertPublicKeyToAlgorandAddress(account.publicKey)
        )
      );
      signerAccount =
        _authorizedAccounts.find(
          (value) =>
            AccountService.convertPublicKeyToAlgorandAddress(
              value.publicKey
            ) === signMessageRequest?.payload.message.params?.signer
        ) || null;

      setAuthorizedAccounts(_authorizedAccounts);
      setSelectedSigner(signerAccount || _authorizedAccounts[0]);
    }
  }, [accounts, sessions, signMessageRequest]);

  return (
    <Modal
      isOpen={!!signMessageRequest}
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
          {signMessageRequest && (
            <VStack alignItems="center" spacing={4} w="full">
              <Avatar
                name={
                  signMessageRequest.payload.message.clientInfo.appName ||
                  'unknown'
                }
                src={
                  signMessageRequest.payload.message.clientInfo.iconUrl ||
                  undefined
                }
              />

              <VStack
                alignItems="center"
                justifyContent="flex-start"
                spacing={2}
              >
                <Heading color={defaultTextColor} size="md" textAlign="center">
                  {signMessageRequest.payload.message.clientInfo.appName ||
                    'Unknown'}
                </Heading>

                <Box
                  backgroundColor={textBackgroundColor}
                  borderRadius={theme.radii['3xl']}
                  px={DEFAULT_GAP / 3}
                  py={1}
                >
                  <Text
                    color={defaultTextColor}
                    fontSize="xs"
                    textAlign="center"
                  >
                    {signMessageRequest.payload.message.clientInfo.host ||
                      'unknown host'}
                  </Text>
                </Box>

                {decodedJwt ? (
                  <Text color={subTextColor} fontSize="md" textAlign="center">
                    {t<string>('captions.signJwtRequest')}
                  </Text>
                ) : (
                  <Text color={subTextColor} fontSize="md" textAlign="center">
                    {t<string>('captions.signMessageRequest')}
                  </Text>
                )}
              </VStack>
            </VStack>
          )}
        </ModalHeader>

        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <VStack alignItems="flex-start" spacing={4} w="full">
            <PasswordInput
              error={passwordError}
              hint={t<string>(
                decodedJwt
                  ? 'captions.mustEnterPasswordToSignSecurityToken'
                  : 'captions.mustEnterPasswordToSign'
              )}
              inputRef={passwordInputRef}
              onChange={onPasswordChange}
              onKeyUp={handleKeyUpPasswordInput}
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

export default SignMessageModal;
