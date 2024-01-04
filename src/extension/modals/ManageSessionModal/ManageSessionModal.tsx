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
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { generateAccount } from 'algosdk';
import React, { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import ChainBadge from '@extension/components/ChainBadge';
import EmptyState from '@extension/components/EmptyState';
import SessionAvatar from '@extension/components/SessionAvatar';
import Warning from '@extension/components/Warning';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// features
import {
  removeSessionByIdThunk,
  setSessionThunk,
} from '@extension/features/sessions';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectNetworks,
  useSelectSavingSessions,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import {
  IAccount,
  IAppThunkDispatch,
  INetwork,
  ISession,
} from '@extension/types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

interface IProps {
  onClose: () => void;
  session: ISession | null;
}

const ManageSessionModal: FC<IProps> = ({ onClose, session }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const fetching: boolean = useSelectFetchingAccounts();
  const networks: INetwork[] = useSelectNetworks();
  const saving: boolean = useSelectSavingSessions();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  // state
  const [network, setNetwork] = useState<INetwork | null>(null);
  const [authorizedAddresses, setAuthorizedAddresses] = useState<string[]>([]);
  const handleCancelClick = () => onClose();
  const handleSaveClick = () => {
    if (!session) {
      return;
    }

    // if all authorized accounts are removed, remove the session
    if (authorizedAddresses.length <= 0) {
      dispatch(removeSessionByIdThunk(session.id));

      onClose();

      return;
    }

    dispatch(
      setSessionThunk({
        ...session,
        authorizedAddresses,
      })
    );

    onClose();
  };
  const handleOnAccountCheckChange =
    (address: string) => (event: ChangeEvent<HTMLInputElement>) => {
      // add if checked and doesn't exist
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

    if (!network || fetching) {
      return Array.from({ length: 3 }, (_, index) => (
        <HStack
          key={`manage-session-fetching-item-${index}`}
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
            key={`manage-session-modal-account-information-item-${currentIndex}`}
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
                <Text
                  color={defaultTextColor}
                  fontSize="md"
                  maxW={400}
                  noOfLines={1}
                  textAlign="left"
                >
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
                !!authorizedAddresses.find((value) => value === address)
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
  const renderHeader = () => {
    if (!session) {
      return (
        <VStack alignItems="center" spacing={5} w="full">
          <SkeletonCircle size="12" />

          <VStack
            alignItems="center"
            justifyContent="flex-start"
            spacing={2}
            w="full"
          >
            <Skeleton w="full">
              <Text color={defaultTextColor} fontSize="md" textAlign="center">
                {faker.animal.cetacean()}
              </Text>
            </Skeleton>

            <Skeleton w="full">
              <Text color={defaultTextColor} fontSize="xs" textAlign="center">
                {faker.animal.cetacean()}
              </Text>
            </Skeleton>

            <Skeleton w="full">
              <Text color={defaultTextColor} fontSize="xs" textAlign="center">
                {faker.animal.cetacean()}
              </Text>
            </Skeleton>
          </VStack>
        </VStack>
      );
    }

    return (
      <VStack alignItems="center" spacing={5} w="full">
        {/*app icon*/}
        <SessionAvatar
          iconUrl={session.iconUrl || undefined}
          name={session.appName}
          isWalletConnect={!!session.walletConnectMetadata}
        />
        {/*<Avatar name={session.appName} src={session.iconUrl || undefined} />*/}

        <VStack
          alignItems="center"
          justifyContent="flex-start"
          spacing={2}
          w="full"
        >
          {/*app name*/}
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {session.appName}
          </Heading>

          {/*app description*/}
          {session.description && (
            <Text color={defaultTextColor} fontSize="sm" textAlign="center">
              {session.description}
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
              {session.host}
            </Text>
          </Box>

          {/*network*/}
          {network && <ChainBadge network={network} />}

          {/*creation date*/}
          <Text color={defaultTextColor} fontSize="xs" textAlign="center">
            {new Date(session.createdAt).toLocaleString()}
          </Text>

          {/*remove warning*/}
          {authorizedAddresses.length <= 0 && (
            <Warning
              message={t<string>('captions.removeAllAccountsWarning')}
              size="xs"
            />
          )}
        </VStack>
      </VStack>
    );
  };

  useEffect(() => {
    if (session) {
      setAuthorizedAddresses(session.authorizedAddresses);
      setNetwork(
        networks.find((value) => value.genesisHash === session.genesisHash) ||
          null
      );
    }
  }, [session]);

  return (
    <Modal
      isOpen={!!session}
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
          {renderHeader()}
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
              onClick={handleSaveClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.save')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ManageSessionModal;
