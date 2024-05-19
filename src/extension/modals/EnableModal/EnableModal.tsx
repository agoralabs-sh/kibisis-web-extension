import { ARC0027MethodCanceledError } from '@agoralabs-sh/avm-web-provider';
import {
  Checkbox,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  SkeletonCircle,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { generateAccount } from 'algosdk';
import React, { ChangeEvent, FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import AccountAvatar from '@extension/components/AccountAvatar';
import Button from '@extension/components/Button';
import ChainBadge from '@extension/components/ChainBadge';
import ClientHeader, {
  ClientHeaderSkeleton,
} from '@extension/components/ClientHeader';
import EmptyState from '@extension/components/EmptyState';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// features
import { removeEventByIdThunk } from '@extension/features/events';
import { sendEnableResponseThunk } from '@extension/features/messages';
import { setSessionThunk } from '@extension/features/sessions';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useEnableModal from './hooks/useEnableModal';

// selectors
import {
  useSelectAccountsFetching,
  useSelectNonWatchAccounts,
  useSelectSessionsSaving,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IModalProps,
  ISession,
} from '@extension/types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';
import mapSessionFromEnableRequest from '@extension/utils/mapSessionFromEnableRequest';

const EnableModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts = useSelectNonWatchAccounts();
  const fetching = useSelectAccountsFetching();
  const saving = useSelectSessionsSaving();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const {
    authorizedAddresses,
    event,
    network,
    setAuthorizedAddresses,
    setNetwork,
  } = useEnableModal();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // handlers
  const handleCancelClick = async () => {
    if (event) {
      await dispatch(
        sendEnableResponseThunk({
          error: new ARC0027MethodCanceledError({
            message: `user dismissed connect modal`,
            method: event.payload.message.method,
            providerId: __PROVIDER_ID__,
          }),
          event: event,
          session: null,
        })
      ).unwrap();
      // remove the event
      await dispatch(removeEventByIdThunk(event.id)).unwrap();
    }

    handleClose();
  };
  const handleClose = () => {
    setAuthorizedAddresses([]);
    setNetwork(null);

    if (onClose) {
      onClose();
    }
  };
  const handleConnectClick = async () => {
    let session: ISession;

    if (!event || !network || authorizedAddresses.length <= 0) {
      return;
    }

    session = mapSessionFromEnableRequest({
      authorizedAddresses,
      clientInfo: event.payload.message.clientInfo,
      network,
    });

    // save the session
    dispatch(setSessionThunk(session));

    // send the response
    await dispatch(
      sendEnableResponseThunk({
        error: null,
        event,
        session,
      })
    ).unwrap();
    // remove the event
    await dispatch(removeEventByIdThunk(event.id)).unwrap();

    handleClose();
  };
  const handleOnAccountCheckChange =
    (address: string) => (event: ChangeEvent<HTMLInputElement>) => {
      if (!event) {
        return;
      }

      if (event.target.checked) {
        if (!authorizedAddresses.find((value) => value === address)) {
          setAuthorizedAddresses([...authorizedAddresses, address]);
        }

        return;
      }

      // remove if unchecked
      setAuthorizedAddresses(
        authorizedAddresses.filter((value) => value !== address)
      );
    };
  const renderContent = () => {
    let accountNodes: ReactNode[];

    if (!event || fetching) {
      return Array.from({ length: 3 }, (_, index) => (
        <HStack
          key={`enable-modal-fetching-item-${index}`}
          py={4}
          spacing={DEFAULT_GAP - 2}
          w="full"
        >
          <SkeletonCircle size="12" />

          <Skeleton flexGrow={1}>
            <Text color={defaultTextColor} fontSize="md" textAlign="center">
              {ellipseAddress(generateAccount().addr, {
                end: 10,
                start: 10,
              })}
            </Text>
          </Skeleton>
        </HStack>
      ));
    }

    accountNodes = accounts.reduce<ReactNode[]>(
      (acc, account, currentIndex) => {
        const address = AccountService.convertPublicKeyToAlgorandAddress(
          account.publicKey
        );

        return [
          ...acc,
          <HStack
            key={`enable-modal-account-information-${currentIndex}`}
            py={4}
            spacing={DEFAULT_GAP - 2}
            w="full"
          >
            {/*account icon*/}
            <AccountAvatar />

            {/*name/address*/}
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
                  {ellipseAddress(address, {
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
                {ellipseAddress(address, {
                  end: 10,
                  start: 10,
                })}
              </Text>
            )}
            <Checkbox
              colorScheme={primaryColorScheme}
              isChecked={
                !!authorizedAddresses?.find((value) => value === address)
              }
              onChange={handleOnAccountCheckChange(address)}
            />
          </HStack>,
        ];
      },
      []
    );

    return accountNodes.length > 0 ? (
      accountNodes
    ) : (
      <>
        <Spacer />

        {/*empty state*/}
        <EmptyState text={t<string>('headings.noAccountsFound')} />

        <Spacer />
      </>
    );
  };

  return (
    <Modal
      isOpen={!!event}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          {event ? (
            <VStack alignItems="center" spacing={DEFAULT_GAP - 2} w="full">
              <ClientHeader
                description={
                  event.payload.message.clientInfo.description || undefined
                }
                iconUrl={event.payload.message.clientInfo.iconUrl || undefined}
                host={event.payload.message.clientInfo.host || 'unknown host'}
                name={event.payload.message.clientInfo.appName || 'Unknown'}
              />

              {/*network*/}
              {network && <ChainBadge network={network} />}

              {/*caption*/}
              <Text color={subTextColor} fontSize="sm" textAlign="center">
                {t<string>('captions.enableRequest')}
              </Text>
            </VStack>
          ) : (
            <ClientHeaderSkeleton />
          )}
        </ModalHeader>

        <ModalBody px={DEFAULT_GAP}>{renderContent()}</ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={DEFAULT_GAP - 2} w="full">
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
