import {
  Avatar,
  Box,
  Checkbox,
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
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWarningOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { randomBytes } from 'tweetnacl';

// Components
import Button from '../Button';
import ChainBadge from '../ChainBadge';

// Constants
import { DEFAULT_GAP } from '../../constants';

// Features
import { removeSessionThunk, setSessionThunk } from '../../features/sessions';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';
import useTextBackgroundColor from '../../hooks/useTextBackgroundColor';

// Selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectNetworks,
  useSelectSavingSessions,
} from '../../selectors';

// Theme
import { theme } from '../../theme';

// Types
import { IAccount, IAppThunkDispatch, INetwork, ISession } from '../../types';

// Utils
import { ellipseAddress } from '../../utils';

interface IProps {
  onClose: () => void;
  session: ISession | null;
}

const ManageSessionModal: FC<IProps> = ({ onClose, session }: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const accounts: IAccount[] = useSelectAccounts();
  const fetching: boolean = useSelectFetchingAccounts();
  const networks: INetwork[] = useSelectNetworks();
  const saving: boolean = useSelectSavingSessions();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const [network, setNetwork] = useState<INetwork | null>(null);
  const [authorizedAddresses, setAuthorizedAddresses] = useState<string[]>([]);
  const handleCancelClick = () => onClose();
  const handleSaveClick = () => {
    if (!session) {
      return;
    }

    // if all authorized accounts are removed, remove the session
    if (authorizedAddresses.length <= 0) {
      dispatch(removeSessionThunk(session.id));

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
              !!authorizedAddresses.find((value) => value === account.address)
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
        {/* App icon */}
        <Avatar name={session.appName} src={session.iconUrl || undefined} />
        <VStack
          alignItems="center"
          justifyContent="flex-start"
          spacing={2}
          w="full"
        >
          {/* App name */}
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {session.appName}
          </Heading>
          {/* App description */}
          {session.description && (
            <Text color={defaultTextColor} fontSize="sm" textAlign="center">
              {session.description}
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
              {session.host}
            </Text>
          </Box>
          {/* Creation date */}
          <Text color={defaultTextColor} fontSize="sm" textAlign="center">
            {new Date(session.createdAt).toLocaleString()}
          </Text>
          {/* Network */}
          {network && <ChainBadge network={network} />}
          {/* Remove warning */}
          {authorizedAddresses.length <= 0 && (
            <HStack
              borderColor="red.500"
              borderRadius={theme.radii['3xl']}
              borderStyle="solid"
              borderWidth={1}
              px={2}
              py={1}
              spacing={2}
            >
              <Icon as={IoWarningOutline} color="red.500" h={3} w={3} />
              <Text color="red.500" fontSize="xs" textAlign="left">
                {t<string>('captions.removeAllAccounts')}
              </Text>
            </HStack>
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
