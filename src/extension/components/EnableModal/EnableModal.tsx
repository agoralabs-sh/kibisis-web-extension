import {
  Avatar,
  Box,
  Checkbox,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { randomBytes } from 'tweetnacl';

// Components
import Button from '@extension/components/Button';
import ChainBadge from '@extension/components/ChainBadge';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Errors
import { SerializableOperationCanceledError } from '@common/errors';

// Features
import {
  sendEnableResponse,
  setEnableRequest,
} from '@extension/features/messages';
import { setSessionThunk } from '@extension/features/sessions';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccounts,
  useSelectEnableRequest,
  useSelectFetchingAccounts,
  useSelectNetworks,
  useSelectSavingSessions,
} from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import {
  IAccount,
  IAppThunkDispatch,
  IEnableRequest,
  INetwork,
  ISession,
} from '@extension/types';

// Utils
import { ellipseAddress, mapSessionFromEnableRequest } from '@extension/utils';

interface IProps {
  onClose: () => void;
}

const EnableModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const accounts: IAccount[] = useSelectAccounts();
  const enableRequest: IEnableRequest | null = useSelectEnableRequest();
  const fetching: boolean = useSelectFetchingAccounts();
  const networks: INetwork[] = useSelectNetworks();
  const saving: boolean = useSelectSavingSessions();
  const network: INetwork | null =
    networks.find(
      (value) => value.genesisHash === enableRequest?.genesisHash
    ) || null;
  const handleCancelClick = () => {
    if (enableRequest) {
      dispatch(
        sendEnableResponse({
          error: new SerializableOperationCanceledError(
            `user dismissed connect modal`
          ),
          session: null,
          tabId: enableRequest.tabId,
        })
      );
    }

    onClose();
  };
  const handleConnectClick = () => {
    let session: ISession;

    if (!enableRequest || enableRequest.authorizedAddresses.length <= 0) {
      return;
    }

    session = mapSessionFromEnableRequest(enableRequest);

    // save the session, send an enable response and remove the connect request
    dispatch(setSessionThunk(session));
    dispatch(
      sendEnableResponse({
        error: null,
        session,
        tabId: enableRequest.tabId,
      })
    );

    onClose();
  };
  const handleOnAccountCheckChange =
    (address: string) => (event: ChangeEvent<HTMLInputElement>) => {
      if (!enableRequest) {
        return;
      }

      if (event.target.checked) {
        if (
          !enableRequest.authorizedAddresses.find((value) => value === address)
        ) {
          dispatch(
            setEnableRequest({
              ...enableRequest,
              authorizedAddresses: [
                ...enableRequest.authorizedAddresses,
                address,
              ],
            })
          );
        }

        return;
      }

      // remove if unchecked
      dispatch(
        setEnableRequest({
          ...enableRequest,
          authorizedAddresses: enableRequest.authorizedAddresses.filter(
            (value) => value !== address
          ),
        })
      );
    };
  const renderContent = () => {
    if (fetching) {
      return Array.from({ length: 3 }, () => (
        <HStack key={nanoid()} py={4} spacing={4} w="full">
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
      ));
    }

    if (accounts.length > 0) {
      return accounts.map((account) => (
        <HStack key={nanoid()} py={4} spacing={4} w="full">
          <Avatar name={account.name || account.address} />
          {account.name ? (
            <VStack
              alignItems="flex-start"
              flexGrow={1}
              justifyContent="space-evenly"
              spacing={0}
            >
              <Text color={defaultTextColor} fontSize="md" textAlign="left">
                {account.name}
              </Text>
              <Text color={subTextColor} fontSize="sm" textAlign="left">
                {ellipseAddress(account.address, {
                  end: 10,
                  start: 10,
                })}
              </Text>
            </VStack>
          ) : (
            <Text
              color={defaultTextColor}
              flexGrow={1}
              fontSize="md"
              textAlign="left"
            >
              {ellipseAddress(account.address, {
                end: 10,
                start: 10,
              })}
            </Text>
          )}
          <Checkbox
            colorScheme="primary"
            isChecked={
              !!enableRequest?.authorizedAddresses?.find(
                (value) => value === account.address
              )
            }
            onChange={handleOnAccountCheckChange(account.address)}
          />
        </HStack>
      ));
    }
    return (
      <Heading color={defaultTextColor} size="md" textAlign="center" w="full">
        {t<string>('headings.noAccountsFound')}
      </Heading>
    );
  };

  return (
    <Modal
      isOpen={!!enableRequest}
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
            {/* App icon */}
            <Avatar
              name={enableRequest?.appName || 'unknown'}
              src={enableRequest?.iconUrl || undefined}
            />
            <VStack alignItems="center" justifyContent="flex-start" spacing={2}>
              {/* App name */}
              <Heading color={defaultTextColor} size="md" textAlign="center">
                {enableRequest?.appName || 'Unknown'}
              </Heading>
              {/* App description */}
              {enableRequest?.description && (
                <Text color={defaultTextColor} fontSize="sm" textAlign="center">
                  {enableRequest.description}
                </Text>
              )}
              {/* App host */}
              <Box
                backgroundColor={textBackgroundColor}
                borderRadius={theme.radii['3xl']}
                px={2}
                py={1}
              >
                <Text color={defaultTextColor} fontSize="xs" textAlign="center">
                  {enableRequest?.host || 'unknown host'}
                </Text>
              </Box>
              {/* Network */}
              {network && <ChainBadge network={network} />}
              <Text color={subTextColor} fontSize="md" textAlign="center">
                {t<string>('captions.connectRequest')}
              </Text>
            </VStack>
          </VStack>
        </ModalHeader>
        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>
        <ModalFooter p={DEFAULT_GAP}>
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
              isLoading={saving}
              onClick={handleConnectClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.allow')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EnableModal;
