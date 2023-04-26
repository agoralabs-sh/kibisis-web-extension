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
  Tag,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
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
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccounts,
  useSelectEnableRequest,
  useSelectFetchingAccounts,
  useSelectSavingSessions,
} from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import {
  IAccount,
  IAppThunkDispatch,
  IEnableRequest,
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
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const accounts: IAccount[] = useSelectAccounts();
  const enableRequest: IEnableRequest | null = useSelectEnableRequest();
  const fetching: boolean = useSelectFetchingAccounts();
  const saving: boolean = useSelectSavingSessions();
  const handleCancelClick = () => {
    if (enableRequest) {
      dispatch(
        sendEnableResponse({
          error: new SerializableOperationCanceledError(
            `user dismissed connect modal`
          ),
          requestEventId: enableRequest.requestEventId,
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
        requestEventId: enableRequest.requestEventId,
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
            colorScheme={primaryColorScheme}
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
  const renderHeader = () => {
    if (!enableRequest) {
      return (
        <>
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
        </>
      );
    }

    return (
      <>
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={4}
          w="full"
        >
          {/*app icon */}
          <Avatar
            name={enableRequest.appName}
            size="sm"
            src={enableRequest.iconUrl || undefined}
          />

          {/*app name*/}
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {enableRequest.appName}
          </Heading>
        </HStack>

        <VStack alignItems="center" justifyContent="flex-start" spacing={2}>
          {/*app description*/}
          {enableRequest.description && (
            <Text color={defaultTextColor} fontSize="sm" textAlign="center">
              {enableRequest.description}
            </Text>
          )}

          {/*app host*/}
          <Box
            backgroundColor={textBackgroundColor}
            borderRadius={theme.radii['3xl']}
            px={2}
            py={1}
          >
            <Text color={defaultTextColor} fontSize="xs" textAlign="center">
              {enableRequest.host}
            </Text>
          </Box>

          {/*network*/}
          <ChainBadge network={enableRequest.network} />

          {/*caption*/}
          <Text color={subTextColor} fontSize="md" textAlign="center">
            {t<string>('captions.enableRequest')}
          </Text>
        </VStack>
      </>
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
            {renderHeader()}
          </VStack>
        </ModalHeader>
        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>
        <ModalFooter p={DEFAULT_GAP}>
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
