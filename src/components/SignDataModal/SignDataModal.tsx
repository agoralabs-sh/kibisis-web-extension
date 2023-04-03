import {
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
import { ISignDataRequest } from '../../features/accounts';
import { sendSignBytesResponse } from '../../features/messages';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';
import useTextBackgroundColor from '../../hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectSignDataRequest,
} from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { IAccount, IAppThunkDispatch, IDecodedJwt } from '../../types';

// Utils
import { decodeJwt, ellipseAddress, formatCurrencyUnit } from '../../utils';

interface IProps {
  onClose: () => void;
}

const SignDataModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const accounts: IAccount[] = useSelectAccounts();
  const signDataRequest: ISignDataRequest | null = useSelectSignDataRequest();
  const fetching: boolean = useSelectFetchingAccounts();
  const [decodedJwt, setDecodedJwt] = useState<IDecodedJwt | null>(null);
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [selectedSigner, setSelectedSigner] = useState<IAccount | null>(null);
  const handleAccountSelect = (account: IAccount) => setSelectedSigner(account);
  const handleCancelClick = () => {
    if (signDataRequest) {
      dispatch(
        sendSignBytesResponse({
          encodedSignature: null,
          error: new SerializableOperationCanceledError(
            `user dismissed sign data modal`
          ),
          tabId: signDataRequest.tabId,
        })
      );
    }

    onClose();
  };
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordError(null);
    setPassword(event.target.value);
  };
  const handleSignClick = () => {
    console.log('get private key and sign!');
  };
  const renderContent = () => {
    if (fetching || !signDataRequest || !selectedSigner) {
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
          <Text textAlign="left" w="full">{`${t<string>(
            'labels.addressToSign'
          )}:`}</Text>
          {signDataRequest.signer ? (
            <AccountItem account={selectedSigner} />
          ) : (
            <AccountSelect
              accounts={accounts}
              onSelect={handleAccountSelect}
              value={selectedSigner}
            />
          )}
        </VStack>
        {/* Data display */}
        {decodedJwt ? (
          <VStack spacing={2} w="full">
            <Text textAlign="left" w="full">{`${t<string>(
              'labels.information'
            )}:`}</Text>
            {/* Address/sub */}
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
                  {decodedJwt.payload.address}
                </Text>
              </Box>
              {decodedJwt.payload.address !== selectedSigner?.address && (
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
                    <Icon as={IoWarningOutline} color="red.500" />
                  </span>
                </Tooltip>
              )}
            </HStack>
            {/* Audience/aud */}
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
              {decodedJwt.payload.audience !== signDataRequest?.host && (
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
                    <Icon as={IoWarningOutline} color="red.500" />
                  </span>
                </Tooltip>
              )}
            </HStack>
            {/* Expiration date/iat */}
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
            </HStack>
          </VStack>
        ) : (
          <VStack spacing={2} w="full">
            <Text textAlign="left" w="full">{`${t<string>(
              'labels.message'
            )}:`}</Text>
            {signDataRequest && (
              <Code borderRadius="md" w="full">
                {window.atob(signDataRequest.encodedData)}
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
      if (signDataRequest?.signer) {
        account =
          accounts.find((value) => value.address === signDataRequest.signer) ||
          null;
      }

      setSelectedSigner(account || accounts[0]);
    }
  }, [accounts, signDataRequest]);
  useEffect(() => {
    if (signDataRequest) {
      setDecodedJwt(decodeJwt(window.atob(signDataRequest.encodedData)));
    }
  }, [signDataRequest]);

  return (
    <Modal
      isOpen={!!signDataRequest}
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
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <VStack alignItems="center" spacing={5} w="full">
            <Avatar
              name={signDataRequest?.appName || 'unknown'}
              src={signDataRequest?.iconUrl || undefined}
            />
            <VStack alignItems="center" justifyContent="flex-start" spacing={2}>
              <Heading color={defaultTextColor} size="md" textAlign="center">
                {signDataRequest?.appName || 'Unknown'}
              </Heading>
              <Box
                backgroundColor={textBackgroundColor}
                borderRadius={theme.radii['3xl']}
                px={2}
                py={1}
              >
                <Text color={defaultTextColor} fontSize="xs" textAlign="center">
                  {signDataRequest?.host || 'unknown host'}
                </Text>
              </Box>
              {signDataRequest &&
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

export default SignDataModal;
