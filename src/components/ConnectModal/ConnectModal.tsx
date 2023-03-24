import {
  Avatar,
  Checkbox,
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
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// Components
import Button from '../Button';

// Constants
import { DEFAULT_GAP } from '../../constants';

// Errors
import { SerializableOperationCanceledError } from '../../errors';

// Features
import { sendEnableResponse } from '../../features/messages';
import {
  createSessionFromConnectRequest,
  IConnectRequest,
  saveSession,
  setConnectRequest,
} from '../../features/sessions';

// Selectors
import {
  useSelectAccounts,
  useSelectConnectRequest,
  useSelectSavingSessions,
} from '../../selectors';

// Types
import { IAccount, IAppThunkDispatch, ISession } from '../../types';

// Utils
import { ellipseAddress } from '../../utils';

interface IProps {
  onClose: () => void;
}

const ConnectModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch>();
  const accounts: IAccount[] = useSelectAccounts();
  const connectRequest: IConnectRequest | null = useSelectConnectRequest();
  const saving: boolean = useSelectSavingSessions();
  const handleClose = () => {};
  const handleCancelClick = () => {
    if (connectRequest) {
      dispatch(
        sendEnableResponse({
          error: new SerializableOperationCanceledError(
            `user dismissed connect modal`
          ),
          session: null,
          tabId: connectRequest.tabId,
        })
      );
    }

    onClose();
  };
  const handleConnectClick = () => {
    let session: ISession;

    if (!connectRequest) {
      return;
    }

    session = createSessionFromConnectRequest(connectRequest);

    // save the session, send an enable response and remove the connect request
    dispatch(saveSession(session));
    dispatch(
      sendEnableResponse({
        error: null,
        session,
        tabId: connectRequest.tabId,
      })
    );
    dispatch(setConnectRequest(null));
  };
  const handleOnAccountCheckChange =
    (address: string) => (event: ChangeEvent<HTMLInputElement>) => {
      if (!connectRequest) {
        return;
      }

      if (event.target.checked) {
        if (
          !connectRequest.authorizedAddresses.find((value) => value === address)
        ) {
          dispatch(
            setConnectRequest({
              ...connectRequest,
              authorizedAddresses: [
                ...connectRequest.authorizedAddresses,
                address,
              ],
            })
          );
        }

        return;
      }

      // remove if unchecked
      dispatch(
        setConnectRequest({
          ...connectRequest,
          authorizedAddresses: connectRequest.authorizedAddresses.filter(
            (value) => value !== address
          ),
        })
      );
    };

  return (
    <Modal
      isOpen={!!connectRequest}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent borderTopRadius={25} borderBottomRadius={0}>
        <ModalHeader justifyContent="center" px={DEFAULT_GAP}>
          <VStack alignItems="center" spacing={5} w="full">
            <Avatar
              name={connectRequest?.appName || 'unknown'}
              src={connectRequest?.iconUrl || undefined}
            />
            <VStack alignItems="center" justifyContent="flex-start" spacing={2}>
              <Heading color="gray.500" size="md" textAlign="center">
                {connectRequest?.appName || 'Unknown'}
              </Heading>
              <Text color="gray.400" fontSize="sm" textAlign="center">
                {connectRequest?.host || 'unknown host'}
              </Text>
              <Text color="gray.500" fontSize="md" textAlign="center">
                {t<string>('headings.connectRequest')}
              </Text>
            </VStack>
          </VStack>
        </ModalHeader>
        <ModalBody px={DEFAULT_GAP}>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <HStack key={nanoid()} py={4} spacing={4} w="full">
                <Avatar name={account.name || account.address} />
                {account.name ? (
                  <VStack
                    alignItems="flex-start"
                    flexGrow={1}
                    justifyContent="space-evenly"
                    spacing={0}
                  >
                    <Text color="gray.500" fontSize="md" textAlign="center">
                      {account.name}
                    </Text>
                    <Text color="gray.400" fontSize="sm" textAlign="center">
                      {ellipseAddress(account.address, {
                        end: 10,
                        start: 10,
                      })}
                    </Text>
                  </VStack>
                ) : (
                  <Text
                    color="gray.500"
                    flexGrow={1}
                    fontSize="md"
                    textAlign="center"
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
                    !!connectRequest?.authorizedAddresses?.find(
                      (value) => value === account.address
                    )
                  }
                  onChange={handleOnAccountCheckChange(account.address)}
                />
              </HStack>
            ))
          ) : (
            <Heading color="gray.400" size="md" textAlign="center" w="full">
              {t<string>('headings.noAccountsFound')}
            </Heading>
          )}
        </ModalBody>
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
              {t<string>('buttons.connect')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConnectModal;
