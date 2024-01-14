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
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { generateAccount } from 'algosdk';
import React, { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Rings } from 'react-loader-spinner';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import SessionRequestHeader from '@extension/components/SessionRequestHeader';
import WalletConnectBannerIcon from '@extension/components/WalletConnectBannerIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useCaptureQrCode from '@extension/hooks/useCaptureQrCode';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useWalletConnect from '@extension/hooks/useWalletConnect';

// selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectInitializingWalletConnect,
  useSelectSelectedNetwork,
  useSelectWalletConnectModalOpen,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// theme
import { theme } from '@extension/theme';

// types
import { IAccount, INetwork } from '@extension/types';

// utils
import ellipseAddress from '@extension/utils/ellipseAddress';

interface IProps {
  onClose: () => void;
}

const WalletConnectModal: FC<IProps> = ({ onClose }: IProps) => {
  const { t } = useTranslation();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const fetching: boolean = useSelectFetchingAccounts();
  const initializing: boolean = useSelectInitializingWalletConnect();
  const network: INetwork | null = useSelectSelectedNetwork();
  const isOpen: boolean = useSelectWalletConnectModalOpen();
  // hooks
  const { scanning, startScanningAction, stopScanningAction, url } =
    useCaptureQrCode();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const primaryColorScheme: string = usePrimaryColorScheme();
  const subTextColor: string = useSubTextColor();
  const {
    approveSessionProposalAction,
    pairing,
    rejectSessionProposalAction,
    sessionProposal,
  } = useWalletConnect(url);
  // states
  const [authorizedAddresses, setAuthorizedAddresses] = useState<string[]>([]);
  // handlers
  const handleApproveClick = async () => {
    if (authorizedAddresses.length > 0 && network) {
      await approveSessionProposalAction(authorizedAddresses, network);
    }

    handleClose();
  };
  const handleCancelClick = () => handleClose();
  const handleClose = () => {
    stopScanningAction();
    setAuthorizedAddresses([]);
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
  const handleRejectClick = async () => {
    await rejectSessionProposalAction();

    handleClose();
  };
  // renders
  const renderContent = () => {
    let accountNodes: ReactNode[];

    if (initializing || scanning) {
      return (
        <>
          <ModalBody display="flex" px={DEFAULT_GAP}>
            <VStack
              alignItems="center"
              flexGrow={1}
              justifyContent="center"
              spacing={4}
              w="full"
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor={defaultTextColor}
                color={primaryColor}
                size="xl"
              />
              <Text color={defaultTextColor} fontSize="md" textAlign="center">
                {t<string>(
                  scanning
                    ? 'captions.scanningForQrCode'
                    : 'captions.initializingWalletConnect'
                )}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter p={DEFAULT_GAP}>
            <Button
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>
          </ModalFooter>
        </>
      );
    }

    if (pairing) {
      return (
        <>
          <ModalBody display="flex" px={DEFAULT_GAP}>
            <VStack
              alignItems="center"
              flexGrow={1}
              justifyContent="center"
              spacing={4}
              w="full"
            >
              <Rings
                ariaLabel="rings-loading"
                color={primaryColor}
                height={200}
                radius="6"
              />
              <Text color={defaultTextColor} fontSize="md" textAlign="center">
                {t<string>('captions.connectingToWalletConnect')}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter p={DEFAULT_GAP}>
            <Button
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>
          </ModalFooter>
        </>
      );
    }

    if (!network || fetching) {
      return (
        <>
          <ModalBody display="flex" px={DEFAULT_GAP}>
            {Array.from({ length: 3 }, (_, index) => (
              <HStack
                key={`wallet-connect-modal-fetching-item-${index}`}
                py={4}
                spacing={4}
                w="full"
              >
                <SkeletonCircle size="12" />
                <Skeleton flexGrow={1}>
                  <Text
                    color={defaultTextColor}
                    fontSize="md"
                    textAlign="center"
                  >
                    {ellipseAddress(generateAccount().addr, {
                      end: 10,
                      start: 10,
                    })}
                  </Text>
                </Skeleton>
              </HStack>
            ))}
          </ModalBody>
          <ModalFooter p={DEFAULT_GAP}>
            <Button
              onClick={handleCancelClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.cancel')}
            </Button>
          </ModalFooter>
        </>
      );
    }

    accountNodes = accounts.reduce<ReactNode[]>(
      (acc, account, currentIndex) => {
        const address: string =
          AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);

        return [
          ...acc,
          <HStack
            key={`wallet-connect-modal-item-${currentIndex}`}
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
                !!authorizedAddresses.find((value) => value === address)
              }
              onChange={handleOnAccountCheckChange(address)}
            />
          </HStack>,
        ];
      },
      []
    );

    return (
      <>
        <ModalBody display="flex" px={DEFAULT_GAP}>
          <VStack w="full">
            {accountNodes.length > 0 ? (
              accountNodes
            ) : (
              <>
                {/*empty state*/}
                <Spacer />
                <EmptyState text={t<string>('headings.noAccountsFound')} />
                <Spacer />
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>
          <HStack spacing={4} w="full">
            <Button
              onClick={handleRejectClick}
              size="lg"
              variant="outline"
              w="full"
            >
              {t<string>('buttons.reject')}
            </Button>

            <Button
              onClick={handleApproveClick}
              size="lg"
              variant="solid"
              w="full"
            >
              {t<string>('buttons.approve')}
            </Button>
          </HStack>
        </ModalFooter>
      </>
    );
  };

  useEffect(() => {
    if (isOpen) {
      startScanningAction();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
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
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          {sessionProposal ? (
            <SessionRequestHeader
              caption={t<string>('captions.enableRequest')}
              description={sessionProposal.params.proposer.metadata.description}
              host={sessionProposal.params.proposer.metadata.url}
              iconUrl={sessionProposal.params.proposer.metadata.icons[0]}
              isWalletConnect={true}
              name={sessionProposal.params.proposer.metadata.name}
              network={network || undefined}
            />
          ) : (
            <WalletConnectBannerIcon h={9} w={60} />
          )}
        </ModalHeader>

        {renderContent()}
      </ModalContent>
    </Modal>
  );
};

export default WalletConnectModal;
