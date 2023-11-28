import {
  Avatar,
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
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import SessionRequestHeader, {
  SessionRequestHeaderSkeleton,
} from '@extension/components/SessionRequestHeader';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// errors
import { SerializableOperationCanceledError } from '@common/errors';

// features
import {
  sendEnableResponseThunk,
  setEnableRequest,
} from '@extension/features/messages';
import { setSessionThunk } from '@extension/features/sessions';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectEnableRequest,
  useSelectFetchingAccounts,
  useSelectSavingSessions,
} from '@extension/selectors';

// services
import { AccountService } from '@extension/services';

// theme
import { theme } from '@extension/theme';

// types
import {
  IAccount,
  IAccountInformation,
  IAppThunkDispatch,
  IEnableRequest,
  ISession,
} from '@extension/types';

// utils
import { ellipseAddress, mapSessionFromEnableRequest } from '@extension/utils';

interface IProps {
  onClose: () => void;
}

const EnableModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const enableRequest: IEnableRequest | null = useSelectEnableRequest();
  const fetching: boolean = useSelectFetchingAccounts();
  const saving: boolean = useSelectSavingSessions();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  // handlers
  const handleCancelClick = () => {
    if (enableRequest) {
      dispatch(
        sendEnableResponseThunk({
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
      sendEnableResponseThunk({
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
    let accountNodes: ReactNode[];

    if (!enableRequest || fetching) {
      return Array.from({ length: 3 }, (_, index) => (
        <HStack
          key={`enable-modal-fetching-item-${index}`}
          py={4}
          spacing={4}
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
        const address: string =
          AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);

        return [
          ...acc,
          <HStack
            key={`enable-modal-account-information-${currentIndex}`}
            py={4}
            spacing={4}
            w="full"
          >
            <Avatar name={account.name || address} />
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
                !!enableRequest?.authorizedAddresses?.find(
                  (value) => value === address
                )
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
        {/*empty state*/}
        <Spacer />
        <EmptyState text={t<string>('headings.noAccountsFound')} />
        <Spacer />
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
          {enableRequest ? (
            <SessionRequestHeader
              caption={t<string>('captions.enableRequest')}
              description={enableRequest.description || undefined}
              host={enableRequest.host}
              iconUrl={enableRequest.iconUrl || undefined}
              name={enableRequest.appName}
              network={enableRequest.network}
            />
          ) : (
            <SessionRequestHeaderSkeleton />
          )}
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
