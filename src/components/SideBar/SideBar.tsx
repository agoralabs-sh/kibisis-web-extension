import {
  Avatar,
  Button,
  Center,
  HStack,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, {
  FC,
  ReactNode,
  ReactElement,
  TransitionEvent,
  useState,
  useEffect,
} from 'react';
import {
  IoAddCircleOutline,
  IoChevronBack,
  IoChevronForward,
  IoSettingsOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { randomBytes } from 'tweetnacl';

// Components
import AgoraIcon from '../AgoraIcon';
import Divider from '../Divider';
import SideBarActionItem from './SideBarActionItem';

// Constants
import {
  ACCOUNTS_ROUTE,
  SETTINGS_ROUTE,
  SIDEBAR_BORDER_WIDTH,
  SIDEBAR_ITEM_HEIGHT,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from '../../constants';

// Selectors
import { useSelectAccounts, useSelectFetchingAccounts } from '../../selectors';

// Types
import { IAccount } from '../../types';

// Utils
import { ellipseAddress } from '../../utils';
import { add } from 'husky';

const SideBar: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  const accounts: IAccount[] = useSelectAccounts();
  const fetchingAccounts: boolean = useSelectFetchingAccounts();
  const [width, setWidth] = useState<number>(SIDEBAR_MIN_WIDTH);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sideBarIcon, setSideBarIcon] = useState<ReactElement>(
    <IoChevronForward />
  );
  const [isHeaderShowing, setIsHeaderShowing] = useState<boolean>(false);
  const onCloseSideBar = () => {
    setIsHeaderShowing(false);
    setIsOpen(false);
  };
  const handleOpenToggleClick = () => {
    setIsHeaderShowing(false);
    setIsOpen(!isOpen);
  };
  const handleAccountClick = (address: string) => () => {
    onCloseSideBar();
    navigate(`${ACCOUNTS_ROUTE}/${address}`);
  };
  const handleAddAccountClick = () => {
    onCloseSideBar();
    console.log('go to add account page');
  };
  const handleSettingsClick = () => {
    onCloseSideBar();
    navigate(SETTINGS_ROUTE);
  };
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'width' && width >= SIDEBAR_MAX_WIDTH) {
      setIsHeaderShowing(true);
    }
  };
  const renderAccounts: () => ReactNode = () => {
    if (fetchingAccounts) {
      return Array.from({ length: 3 }, () => (
        <Button
          borderRadius={0}
          colorScheme="gray"
          fontSize="md"
          h={SIDEBAR_ITEM_HEIGHT}
          justifyContent="start"
          key={nanoid()}
          p={0}
          variant="ghost"
          w="full"
        >
          <HStack m={0} p={0} spacing={0} w="full">
            <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
              <SkeletonCircle size="9" />
            </Center>
            <Skeleton>
              <Text color="gray.500" flexGrow={1} fontSize="sm">
                {ellipseAddress(randomBytes(52).toString(), {
                  end: 10,
                  start: 10,
                })}
              </Text>
            </Skeleton>
          </HStack>
        </Button>
      ));
    }

    return accounts.map((value) => (
      <Button
        borderRadius={0}
        colorScheme="gray"
        fontSize="md"
        h={SIDEBAR_ITEM_HEIGHT}
        justifyContent="start"
        key={nanoid()}
        onClick={handleAccountClick(value.address)}
        p={0}
        variant="ghost"
        w="full"
      >
        <HStack m={0} p={0} spacing={0} w="full">
          <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
            <Avatar bg="primary.500" icon={<IoWalletOutline />} size="sm" />
          </Center>
          {value.name ? (
            <VStack
              alignItems="flex-start"
              flexGrow={1}
              justifyContent="space-evenly"
              spacing={0}
            >
              <Text color="gray.500" fontSize="sm" maxW={195} noOfLines={1}>
                {value.name}
              </Text>
              <Text color="gray.400" fontSize="xs">
                {ellipseAddress(value.address, {
                  end: 10,
                  start: 10,
                })}
              </Text>
            </VStack>
          ) : (
            <Text color="gray.500" flexGrow={1} fontSize="sm">
              {ellipseAddress(value.address, {
                end: 10,
                start: 10,
              })}
            </Text>
          )}
        </HStack>
      </Button>
    ));
  };

  useEffect(() => {
    if (isOpen) {
      setSideBarIcon(<IoChevronBack />);
      setWidth(SIDEBAR_MAX_WIDTH);

      return;
    }

    setSideBarIcon(<IoChevronForward />);
    setWidth(SIDEBAR_MIN_WIDTH);
  }, [isOpen]);

  return (
    <VStack
      backgroundColor="white"
      borderRightColor="gray.300"
      borderRightStyle="solid"
      borderRightWidth={SIDEBAR_BORDER_WIDTH}
      h="100vh"
      left={0}
      onTransitionEnd={handleTransitionEnd}
      overflowX="hidden"
      position="absolute"
      spacing={0}
      top={0}
      transition="width 0.3s ease"
      w={`${width}px`}
      zIndex={10}
    >
      <HStack justifyContent="flex-end" w="full">
        {isHeaderShowing && (
          <HStack flexGrow={1} px={2} spacing={1} w="full">
            <AgoraIcon color="primary.500" h={5} w={5} />
            <Text color="gray.500" fontSize="sm">
              {__APP_TITLE__}
            </Text>
          </HStack>
        )}
        <IconButton
          aria-label="Open drawer"
          borderRadius={0}
          colorScheme="gray"
          icon={sideBarIcon}
          onClick={handleOpenToggleClick}
          variant="ghost"
        />
      </HStack>
      <Divider />
      <VStack flexGrow={1} overflowY="scroll" spacing={0} w="full">
        {renderAccounts()}
      </VStack>
      <Divider />
      <SideBarActionItem
        icon={IoAddCircleOutline}
        label={t<string>('labels.addAccount')}
        onClick={handleAddAccountClick}
      />
      <SideBarActionItem
        icon={IoSettingsOutline}
        label={t<string>('labels.settings')}
        onClick={handleSettingsClick}
      />
    </VStack>
  );
};

export default SideBar;