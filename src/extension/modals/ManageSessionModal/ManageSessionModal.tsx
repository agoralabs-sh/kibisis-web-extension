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
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { generateAccount } from 'algosdk';
import React, { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSaveOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AccountAvatarWithBadges from '@extension/components/AccountAvatarWithBadges';
import Button from '@extension/components/Button';
import NetworkBadge from '@extension/components/NetworkBadge';
import ClientHeader, {
  ClientHeaderSkeleton,
} from '@extension/components/ClientHeader';
import EmptyState from '@extension/components/EmptyState';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// features
import {
  removeByIdFromStorageThunk as removeSessionsByIdFromStorageThunk,
  saveToStorage as saveSessionToStorage,
} from '@extension/features/sessions';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectAccountsFetching,
  useSelectNetworks,
  useSelectSessionsSaving,
  useSelectSystemInfo,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type {
  IAppThunkDispatch,
  IMainRootState,
  INetwork,
} from '@extension/types';
import type { IProps } from './types';

// utils
import availableAccountsForNetwork from '@extension/utils/availableAccountsForNetwork';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';
import sortAccountsByPolisAccount from '@extension/utils/sortAccountsByPolisAccount';

const ManageSessionModal: FC<IProps> = ({ onClose, session }) => {
  const _context = 'manage-sessions-modal';
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const accounts = useSelectAccounts();
  const fetching = useSelectAccountsFetching();
  const networks = useSelectNetworks();
  const saving = useSelectSessionsSaving();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // state
  const [authorizedAddresses, setAuthorizedAddresses] = useState<string[]>([]);
  const [network, setNetwork] = useState<INetwork | null>(null);
  // handlers
  const handleCancelClick = () => handleClose();
  const handleClose = () => onClose && onClose();
  const handleSaveClick = () => {
    if (!session) {
      return;
    }

    // if all authorized accounts are removed, remove the session
    if (authorizedAddresses.length <= 0) {
      dispatch(removeSessionsByIdFromStorageThunk(session.id));

      return handleClose();
    }

    dispatch(
      saveSessionToStorage({
        ...session,
        authorizedAddresses,
      })
    );

    handleClose();
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
  const handleOnSelectAllCheckChange = () => {
    if (authorizedAddresses.length <= 0) {
      return setAuthorizedAddresses(
        accounts.map((value) => convertPublicKeyToAVMAddress(value.publicKey))
      );
    }

    setAuthorizedAddresses([]);
  };
  // renders
  const renderContent = () => {
    let accountNodes: ReactNode[];

    if (!network || fetching) {
      return Array.from({ length: 3 }, (_, index) => (
        <HStack
          key={`${_context}-fetching-item-${index}`}
          py={DEFAULT_GAP - 2}
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

    accountNodes = availableAccountsForNetwork({
      accounts: systemInfo?.polisAccountID
        ? sortAccountsByPolisAccount({
            accounts,
            polisAccountID: systemInfo.polisAccountID,
          })
        : accounts,
      network,
    }).reduce<ReactNode[]>((acc, account, currentIndex, availableAccounts) => {
      const address = convertPublicKeyToAVMAddress(account.publicKey);

      return [
        ...acc,
        <HStack
          alignItems="center"
          key={`${_context}-account-information-item-${currentIndex}`}
          py={DEFAULT_GAP - 2}
          spacing={DEFAULT_GAP - 2}
          w="full"
        >
          {/*account icon*/}
          <AccountAvatarWithBadges
            account={account}
            accounts={availableAccounts}
            network={network}
            systemInfo={systemInfo}
          />

          {/*name/address*/}
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
            isChecked={!!authorizedAddresses.find((value) => value === address)}
            onChange={handleOnAccountCheckChange(address)}
          />
        </HStack>,
      ];
    }, []);

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
  const renderHeader = () => {
    if (!session) {
      return <ClientHeaderSkeleton />;
    }

    return (
      <VStack alignItems="center" spacing={DEFAULT_GAP - 2} w="full">
        <ClientHeader
          description={session.description || undefined}
          iconUrl={session.iconUrl || undefined}
          host={session.host}
          name={session.appName}
        />

        {/*network*/}
        {network && <NetworkBadge network={network} size="xs" />}

        {/*creation date*/}
        <Text color={defaultTextColor} fontSize="xs" textAlign="center">
          {new Date(session.createdAt).toLocaleString()}
        </Text>

        {/*select all accounts*/}
        <Stack alignItems="flex-end" justifyContent="center" w="full">
          <Tooltip
            aria-label={t<string>('labels.selectAllAccounts')}
            label={t<string>('labels.selectAllAccounts')}
          >
            <Checkbox
              colorScheme={primaryColorScheme}
              isChecked={authorizedAddresses.length === accounts.length}
              isIndeterminate={
                authorizedAddresses.length > 0 &&
                authorizedAddresses.length < accounts.length
              }
              onChange={handleOnSelectAllCheckChange}
            />
          </Tooltip>
        </Stack>
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
          {renderHeader()}
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
              onClick={handleSaveClick}
              rightIcon={<IoSaveOutline />}
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
