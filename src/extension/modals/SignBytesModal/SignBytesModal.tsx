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
import SignBytesContentSkeleton from './SignBytesContentSkeleton';
import SignBytesJwtContent from './SignBytesJwtContent';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// enums
import { ErrorCodeEnum } from '@extension/enums';

// errors
import {
  SerializableOperationCanceledError,
  SerializableUnknownError,
} from '@common/errors';

// features
import { setError } from '@extension/features/system';
import { sendSignBytesResponseThunk } from '@extension/features/messages';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSignBytes from '@extension/hooks/useSignBytes';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectSignBytesRequest,
} from '@extension/selectors';

// services
import { AccountService } from '@extension/services';

// theme
import { theme } from '@extension/theme';

// types
import {
  IAccount,
  IAppThunkDispatch,
  IDecodedJwt,
  ISignBytesRequest,
} from '@extension/types';

// utils
import { decodeJwt } from '@extension/utils';

interface IProps {
  onClose: () => void;
}

const SignBytesModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const passwordInputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const signBytesRequest: ISignBytesRequest | null =
    useSelectSignBytesRequest();
  const fetching: boolean = useSelectFetchingAccounts();
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
  const { encodedSignedBytes, error, signBytes } = useSignBytes();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  // state
  const [decodedJwt, setDecodedJwt] = useState<IDecodedJwt | null>(null);
  const [selectedSigner, setSelectedSigner] = useState<IAccount | null>(null);
  const handleAccountSelect = (account: IAccount) => setSelectedSigner(account);
  const handleCancelClick = () => {
    if (signBytesRequest) {
      dispatch(
        sendSignBytesResponseThunk({
          encodedSignature: null,
          error: new SerializableOperationCanceledError(
            `user dismissed sign bytes modal`
          ),
          eventId: signBytesRequest.requestEventId,
          tabId: signBytesRequest.tabId,
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
    if (validatePassword() || !signBytesRequest || !selectedSigner) {
      return;
    }

    await signBytes({
      encodedData: signBytesRequest.encodedData,
      password,
      signer: AccountService.convertPublicKeyToAlgorandAddress(
        selectedSigner.publicKey
      ),
    });
  };
  const renderContent = () => {
    if (fetching || !signBytesRequest || !selectedSigner) {
      return <SignBytesContentSkeleton />;
    }

    return (
      <VStack spacing={4} w="full">
        {/*account select*/}
        <VStack spacing={2} w="full">
          {signBytesRequest.signer ? (
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
                accounts={accounts.filter((account) =>
                  signBytesRequest.authorizedAddresses.some(
                    (value) =>
                      value ===
                      AccountService.convertPublicKeyToAlgorandAddress(
                        account.publicKey
                      )
                  )
                )}
                onSelect={handleAccountSelect}
                value={selectedSigner}
              />
            </>
          )}
        </VStack>

        {/* Data display */}
        {decodedJwt ? (
          <SignBytesJwtContent
            decodedJwt={decodedJwt}
            host={signBytesRequest.host}
            signer={selectedSigner}
          />
        ) : (
          <VStack spacing={2} w="full">
            <Text textAlign="left" w="full">{`${t<string>(
              'labels.message'
            )}:`}</Text>
            {signBytesRequest && (
              <Code borderRadius="md" w="full">
                {window.atob(signBytesRequest.encodedData)}
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
  useEffect(() => {
    let account: IAccount | null = null;

    if (accounts.length >= 0 && !selectedSigner) {
      if (signBytesRequest?.signer) {
        account =
          accounts.find(
            (value) =>
              AccountService.convertPublicKeyToAlgorandAddress(
                value.publicKey
              ) === signBytesRequest.signer
          ) || null;
      }

      setSelectedSigner(account || accounts[0]);
    }
  }, [accounts, signBytesRequest]);
  useEffect(() => {
    if (signBytesRequest) {
      setDecodedJwt(decodeJwt(window.atob(signBytesRequest.encodedData)));
    }
  }, [signBytesRequest]);
  useEffect(() => {
    if (encodedSignedBytes && signBytesRequest) {
      dispatch(
        sendSignBytesResponseThunk({
          encodedSignature: encodedSignedBytes,
          error: null,
          eventId: signBytesRequest.requestEventId,
          tabId: signBytesRequest.tabId,
        })
      );

      handleClose();
    }
  }, [encodedSignedBytes]);
  useEffect(() => {
    if (error) {
      switch (error.code) {
        case ErrorCodeEnum.InvalidPasswordError:
          setPasswordError(t<string>('errors.inputs.invalidPassword'));

          break;
        default:
          dispatch(setError(error));
          handleClose();

          if (signBytesRequest) {
            dispatch(
              sendSignBytesResponseThunk({
                encodedSignature: null,
                error: new SerializableUnknownError(error.message),
                eventId: signBytesRequest.requestEventId,
                tabId: signBytesRequest.tabId,
              })
            );
          }

          break;
      }
    }
  }, [error]);

  return (
    <Modal
      isOpen={!!signBytesRequest}
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
          <VStack alignItems="center" spacing={4} w="full">
            <Avatar
              name={signBytesRequest?.appName || 'unknown'}
              src={signBytesRequest?.iconUrl || undefined}
            />

            <VStack alignItems="center" justifyContent="flex-start" spacing={2}>
              <Heading color={defaultTextColor} size="md" textAlign="center">
                {signBytesRequest?.appName || 'Unknown'}
              </Heading>

              <Box
                backgroundColor={textBackgroundColor}
                borderRadius={theme.radii['3xl']}
                px={DEFAULT_GAP / 3}
                py={1}
              >
                <Text color={defaultTextColor} fontSize="xs" textAlign="center">
                  {signBytesRequest?.host || 'unknown host'}
                </Text>
              </Box>

              {signBytesRequest &&
                (decodedJwt ? (
                  <Text color={subTextColor} fontSize="md" textAlign="center">
                    {t<string>('captions.signJwtRequest')}
                  </Text>
                ) : (
                  <Text color={subTextColor} fontSize="md" textAlign="center">
                    {t<string>('captions.signMessageRequest')}
                  </Text>
                ))}
            </VStack>
          </VStack>
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

export default SignBytesModal;
