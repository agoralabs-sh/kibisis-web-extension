import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Code,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  SkeletonCircle,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWarningOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { randomBytes } from 'tweetnacl';

// Components
import AccountSelect from '../AccountSelect';
import AccountItem from '../AccountItem';
import Button from '../Button';
import PasswordInput from '../PasswordInput';

// Constants
import { DEFAULT_GAP } from '../../constants';

// Errors
import { SerializableOperationCanceledError } from '../../errors';

// Features
import { sendSignBytesResponse } from '../../features/messages';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSignBytes from '../../hooks/useSignBytes';
import useSubTextColor from '../../hooks/useSubTextColor';
import useTextBackgroundColor from '../../hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectSignBytesRequest,
} from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import {
  IAccount,
  IAppThunkDispatch,
  IDecodedJwt,
  ISignBytesRequest,
} from '../../types';

// Utils
import { decodeJwt, ellipseAddress } from '../../utils';

interface IProps {
  onClose: () => void;
}

const SignBytesModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const defaultTextColor: string = useDefaultTextColor();
  const { encodedSignedBytes, error, signBytes } = useSignBytes();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const accounts: IAccount[] = useSelectAccounts();
  const signBytesRequest: ISignBytesRequest | null =
    useSelectSignBytesRequest();
  const fetching: boolean = useSelectFetchingAccounts();
  const [decodedJwt, setDecodedJwt] = useState<IDecodedJwt | null>(null);
  const [password, setPassword] = useState<string>('');
  const [selectedSigner, setSelectedSigner] = useState<IAccount | null>(null);
  const handleAccountSelect = (account: IAccount) => setSelectedSigner(account);
  const handleCancelClick = () => {
    if (signBytesRequest) {
      dispatch(
        sendSignBytesResponse({
          encodedSignature: null,
          error: new SerializableOperationCanceledError(
            `user dismissed sign bytes modal`
          ),
          tabId: signBytesRequest.tabId,
        })
      );
    }

    handleClose();
  };
  const handleClose = () => {
    setPassword('');
    onClose();
  };
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleSignClick = async () => {
    if (!signBytesRequest || !selectedSigner) {
      return;
    }

    await signBytes({
      encodedData: signBytesRequest.encodedData,
      password,
      signer: selectedSigner.address,
    });
  };
  const renderContent = () => {
    if (fetching || !signBytesRequest || !selectedSigner) {
      return (
        <VStack spacing={4} w="full">
          <HStack py={4} spacing={4} w="full">
            <SkeletonCircle size="12" />
            <Skeleton flexGrow={1}>
              <Text color={defaultTextColor} fontSize="md" textAlign="center">
                {ellipseAddress(randomBytes(52).toString(), {
                  end: 10,
                  start: 10,
                })}
              </Text>
            </Skeleton>
          </HStack>
          {Array.from({ length: 3 }, () => (
            <Skeleton key={nanoid()}>
              <Text color={defaultTextColor} fontSize="md" textAlign="center">
                {ellipseAddress(randomBytes(52).toString(), {
                  end: 10,
                  start: 10,
                })}
              </Text>
            </Skeleton>
          ))}
        </VStack>
      );
    }

    return (
      <VStack spacing={4} w="full">
        {/* Account select */}
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
                    (value) => value === account.address
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
          <VStack spacing={2} w="full">
            <Text textAlign="left" w="full">{`${t<string>(
              'labels.information'
            )}:`}</Text>
            {/* Address/sub */}
            {decodedJwt.payload.subject && (
              <HStack spacing={2} w="full">
                <Text fontSize="xs">{`${t<string>('labels.address')}:`}</Text>
                <Box
                  backgroundColor={textBackgroundColor}
                  borderRadius={theme.radii['3xl']}
                  px={2}
                  py={1}
                >
                  <Text
                    color={defaultTextColor}
                    fontSize="xs"
                    wordBreak="break-word"
                  >
                    {decodedJwt.payload.subject}
                  </Text>
                </Box>
                {decodedJwt.payload.subject !== selectedSigner?.address && (
                  <Tooltip
                    aria-label="Address does not match the signer"
                    label={t<string>('captions.addressDoesNotMatch')}
                  >
                    <span
                      style={{
                        height: '1em',
                        lineHeight: '1em',
                      }}
                    >
                      <Icon as={IoWarningOutline} color="yellow.500" />
                    </span>
                  </Tooltip>
                )}
              </HStack>
            )}
            {/* Audience/aud */}
            {decodedJwt.payload.audience && (
              <HStack spacing={2} w="full">
                <Text fontSize="xs">{`${t<string>('labels.audience')}:`}</Text>
                <Box
                  backgroundColor={textBackgroundColor}
                  borderRadius={theme.radii['3xl']}
                  px={2}
                  py={1}
                >
                  <Text
                    color={defaultTextColor}
                    fontSize="xs"
                    wordBreak="break-word"
                  >
                    {decodedJwt.payload.audience}
                  </Text>
                </Box>
                {decodedJwt.payload.audience !== signBytesRequest?.host && (
                  <Tooltip
                    aria-label="Audience does not match the host"
                    label={t<string>('captions.audienceDoesNotMatch')}
                  >
                    <span
                      style={{
                        height: '1em',
                        lineHeight: '1em',
                      }}
                    >
                      <Icon as={IoWarningOutline} color="yellow.500" />
                    </span>
                  </Tooltip>
                )}
              </HStack>
            )}
            {/* Expiration date/exp */}
            <HStack spacing={2} w="full">
              <Text fontSize="xs">{`${t<string>(
                'labels.expirationDate'
              )}:`}</Text>
              <Box
                backgroundColor={textBackgroundColor}
                borderRadius={theme.radii['3xl']}
                px={2}
                py={1}
              >
                <Text
                  color={defaultTextColor}
                  fontSize="xs"
                  wordBreak="break-word"
                >
                  {decodedJwt.payload.expiresAt.toLocaleString()}
                </Text>
              </Box>
              {decodedJwt.payload.expiresAt < new Date() && (
                <Tooltip
                  aria-label="Expiriation date is in the past"
                  label={t<string>('captions.securityTokenExpired')}
                >
                  <span
                    style={{
                      height: '1em',
                      lineHeight: '1em',
                    }}
                  >
                    <Icon as={IoWarningOutline} color="yellow.500" />
                  </span>
                </Tooltip>
              )}
            </HStack>
            {/* More information */}
            <Accordion allowToggle={true} w="full">
              <AccordionItem border="none" w="full">
                <AccordionButton px={0}>
                  <Text textAlign="left" w="full">{`${t<string>(
                    'labels.moreInformation'
                  )}:`}</Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel px={0}>
                  <VStack spacing={2} w="full">
                    {/* ID/jti */}
                    {decodedJwt.payload.id && (
                      <HStack spacing={2} w="full">
                        <Text fontSize="xs">{`${t<string>(
                          'labels.id'
                        )}:`}</Text>
                        <Box
                          backgroundColor={textBackgroundColor}
                          borderRadius={theme.radii['3xl']}
                          px={2}
                          py={1}
                        >
                          <Text
                            color={defaultTextColor}
                            fontSize="xs"
                            wordBreak="break-word"
                          >
                            {decodedJwt.payload.id}
                          </Text>
                        </Box>
                      </HStack>
                    )}
                    {/* Issuer/iss */}
                    {decodedJwt.payload.issuer && (
                      <HStack spacing={2} w="full">
                        <Text fontSize="xs">{`${t<string>(
                          'labels.issuer'
                        )}:`}</Text>
                        <Box
                          backgroundColor={textBackgroundColor}
                          borderRadius={theme.radii['3xl']}
                          px={2}
                          py={1}
                        >
                          <Text
                            color={defaultTextColor}
                            fontSize="xs"
                            wordBreak="break-word"
                          >
                            {decodedJwt.payload.issuer}
                          </Text>
                        </Box>
                      </HStack>
                    )}
                    {/* Issue date/iat */}
                    {decodedJwt.payload.issuedAt && (
                      <HStack spacing={2} w="full">
                        <Text fontSize="xs">{`${t<string>(
                          'labels.issueDate'
                        )}:`}</Text>
                        <Box
                          backgroundColor={textBackgroundColor}
                          borderRadius={theme.radii['3xl']}
                          px={2}
                          py={1}
                        >
                          <Text
                            color={defaultTextColor}
                            fontSize="xs"
                            wordBreak="break-word"
                          >
                            {decodedJwt.payload.issuedAt.toLocaleString()}
                          </Text>
                        </Box>
                      </HStack>
                    )}
                    {/* Signing method/alg */}
                    {decodedJwt.header.algorithm && (
                      <HStack spacing={2} w="full">
                        <Text fontSize="xs">{`${t<string>(
                          'labels.signingMethod'
                        )}:`}</Text>
                        <Box
                          backgroundColor={textBackgroundColor}
                          borderRadius={theme.radii['3xl']}
                          px={2}
                          py={1}
                        >
                          <Text
                            color={defaultTextColor}
                            fontSize="xs"
                            wordBreak="break-word"
                          >
                            {decodedJwt.header.algorithm}
                          </Text>
                        </Box>
                        {decodedJwt.header.curve && (
                          <Box
                            borderColor="blue.500"
                            borderRadius={theme.radii['3xl']}
                            borderStyle="solid"
                            borderWidth="1px"
                            px={2}
                            py={1}
                          >
                            <Text
                              color="blue.500"
                              fontSize="xs"
                              wordBreak="break-word"
                            >
                              {decodedJwt.header.curve}
                            </Text>
                          </Box>
                        )}
                        {decodedJwt.header.algorithm !== 'EdDSA' && (
                          <Tooltip
                            aria-label="Invalid signing algorithm"
                            label={t<string>('captions.invalidAlgorithm')}
                          >
                            <span
                              style={{
                                height: '1em',
                                lineHeight: '1em',
                              }}
                            >
                              <Icon as={IoWarningOutline} color="yellow.500" />
                            </span>
                          </Tooltip>
                        )}
                      </HStack>
                    )}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
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

  useEffect(() => {
    let account: IAccount | null = null;

    if (accounts.length >= 0 && !selectedSigner) {
      if (signBytesRequest?.signer) {
        account =
          accounts.find((value) => value.address === signBytesRequest.signer) ||
          null;
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
        sendSignBytesResponse({
          encodedSignature: encodedSignedBytes,
          error: null,
          tabId: signBytesRequest.tabId,
        })
      );

      handleClose();
    }
  }, [encodedSignedBytes]);

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
          <VStack alignItems="center" spacing={5} w="full">
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
                px={2}
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
              error={error}
              hint={t<string>('captions.mustEnterPasswordToSign')}
              onChange={handlePasswordChange}
              value={password}
            />
            <HStack spacing={4} w="full">
              <Button
                colorScheme="primary"
                onClick={handleCancelClick}
                size="lg"
                variant="outline"
                w="full"
              >
                {t<string>('buttons.cancel')}
              </Button>
              <Button
                colorScheme="primary"
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
