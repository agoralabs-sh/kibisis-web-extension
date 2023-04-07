import {
  Avatar,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoEllipsisVerticalOutline,
  IoWalletOutline,
  IoUnlinkOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// Components
import ChainBadge from '../../components/ChainBadge';
import IconButton from '../../components/IconButton';

// Hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import useSubTextColor from '../../hooks/useSubTextColor';

// Selectors
import { useSelectNetworkByGenesisHash } from '../../selectors';

// Types
import { IAppThunkDispatch, INetwork, ISession } from '../../types';

// Utils
import { ellipseAddress } from '../../utils';

interface IProps {
  onRemoveSession: (id: string) => void;
  session: ISession;
}

const AuthorizedAddressItem = ({
  account,
  checked,
  onAddAddress,
  onRemoveAddress,
}: any) => {
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      return onAddAddress(account.address);
    }

    return onRemoveAddress(account.address);
  };

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={12}
      spacing={2}
      w="full"
    >
      {account.name ? (
        <VStack
          alignItems="flex-start"
          justifyContent="center"
          spacing={1}
          w="full"
        >
          <Text
            color={defaultTextColor}
            fontSize="sm"
            maxW={400}
            noOfLines={1}
            textAlign="left"
          >
            {account.name}
          </Text>
          <Text color={subTextColor} fontSize="xs" textAlign="left">
            {ellipseAddress(account.address, {
              end: 10,
              start: 10,
            })}
          </Text>
        </VStack>
      ) : (
        <Text color={defaultTextColor} fontSize="sm" textAlign="left">
          {ellipseAddress(account.address, {
            end: 10,
            start: 10,
          })}
        </Text>
      )}
      <Switch
        colorScheme="green"
        isChecked={checked}
        onChange={handleOnChange}
        size="sm"
      />
    </HStack>
  );
};

const SettingsSessionItem: FC<IProps> = ({
  onRemoveSession,
  session,
}: IProps) => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const network: INetwork | null = useSelectNetworkByGenesisHash(
    session.genesisHash
  );
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const handleMangeAddressesClick = () => console.log();
  const handleRemoveSessionClick = () => onRemoveSession(session.id);

  return (
    <HStack m={0} pt={2} px={4} spacing={2} w="full">
      {/* App icon */}
      {session.iconUrl ? (
        <Avatar name={session.appName} size="sm" src={session.iconUrl} />
      ) : (
        <Avatar name={session.appName} size="sm" />
      )}
      {/* App name/description/creation date */}
      <VStack
        alignItems="flex-start"
        flexGrow={1}
        justifyContent="space-evenly"
        spacing={0}
      >
        {/* App name */}
        <Tooltip label={session.appName}>
          <Text
            color={defaultTextColor}
            fontSize="sm"
            maxW={400}
            noOfLines={1}
            textAlign="left"
          >
            {session.appName}
          </Text>
        </Tooltip>
        {/* App description */}
        {session.description && (
          <Tooltip label={session.description}>
            <Text
              color={subTextColor}
              fontSize="xs"
              maxW={400}
              noOfLines={1}
              textAlign="left"
            >
              {session.description}
            </Text>
          </Tooltip>
        )}
        {/* Chain badge and creation date */}
        <HStack
          alignItems="center"
          justifyContent="flex-start"
          spacing={2}
          w="full"
        >
          <Text
            color={subTextColor}
            fontSize="xs"
            maxW={400}
            noOfLines={1}
            textAlign="left"
          >
            {new Date(session.createdAt).toLocaleString()}
          </Text>
          {network && <ChainBadge network={network} size="xs" />}
        </HStack>
      </VStack>
      {/* Overflow menu */}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Overflow menu"
          icon={IoEllipsisVerticalOutline}
          variant="ghost"
        />
        <MenuList>
          <MenuItem
            icon={<Icon as={IoWalletOutline} />}
            onClick={handleMangeAddressesClick}
          >
            {t<string>('labels.manageAccounts')}
          </MenuItem>
          <MenuItem
            icon={<Icon as={IoUnlinkOutline} />}
            onClick={handleRemoveSessionClick}
          >
            {t<string>('labels.removeSession')}
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};

export default SettingsSessionItem;
