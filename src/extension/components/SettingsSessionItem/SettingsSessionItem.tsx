import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoEllipsisVerticalOutline,
  IoWalletOutline,
  IoUnlinkOutline,
} from 'react-icons/io5';

// components
import ChainBadge from '@extension/components/ChainBadge';
import IconButton from '@extension/components/IconButton';
import SessionAvatar from '@extension/components/SessionAvatar';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectNetworkByGenesisHash } from '@extension/selectors';

// types
import { INetwork, ISession } from '@extension/types';

interface IProps {
  onManageSession: (id: string) => void;
  onRemoveSession: (id: string) => void;
  session: ISession;
}

const SettingsSessionItem: FC<IProps> = ({
  onManageSession,
  onRemoveSession,
  session,
}: IProps) => {
  const { t } = useTranslation();
  const network: INetwork | null = useSelectNetworkByGenesisHash(
    session.genesisHash
  );
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const handleMangeAccountsClick = () => onManageSession(session.id);
  const handleRemoveSessionClick = () => onRemoveSession(session.id);

  return (
    <HStack m={0} pt={2} px={4} spacing={2} w="full">
      {/*app icon*/}
      <SessionAvatar
        name={session.appName}
        iconUrl={session.iconUrl || undefined}
        isWalletConnect={!!session.walletConnectMetadata}
        size="sm"
      />

      {/*app name/description/creation date*/}
      <VStack
        alignItems="flex-start"
        flexGrow={1}
        justifyContent="space-evenly"
        spacing={0}
      >
        {/*app name*/}
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

        {/*app description*/}
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

        {/*chain badge and creation date*/}
        <HStack
          alignItems="center"
          justifyContent="space-between"
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

      {/*overflow menu*/}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Overflow menu"
          icon={IoEllipsisVerticalOutline}
          variant="ghost"
        />
        <MenuList>
          <MenuItem
            color={defaultTextColor}
            icon={<Icon as={IoWalletOutline} color={defaultTextColor} />}
            onClick={handleMangeAccountsClick}
          >
            {t<string>('labels.manageAccounts')}
          </MenuItem>
          <MenuItem
            color={defaultTextColor}
            icon={<Icon as={IoUnlinkOutline} color={defaultTextColor} />}
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
