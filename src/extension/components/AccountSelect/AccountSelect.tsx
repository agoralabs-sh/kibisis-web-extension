import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { FC } from 'react';
import { IoChevronDown } from 'react-icons/io5';

// Components
import AccountItem from '@extension/components/AccountItem';

// Hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';

// Types
import { IAccount } from '@extension/types';

interface IProps {
  accounts: IAccount[];
  onSelect: (account: IAccount) => void;
  value: IAccount;
}

const AccountSelect: FC<IProps> = ({ accounts, onSelect, value }: IProps) => {
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const handleAccountClick = (account: IAccount) => () => onSelect(account);
  const minimumHeight: number = 48;

  return (
    <Menu>
      <MenuButton
        _expanded={{ bg: 'primary.400' }}
        _focus={{ boxShadow: 'outline' }}
        _hover={{ bg: buttonHoverBackgroundColor }}
        borderRadius="md"
        borderWidth="1px"
        minH={`${minimumHeight}px`}
        px={4}
        py={2}
        transition="all 0.2s"
        w="full"
      >
        <HStack justifyContent="space-between" w="full">
          <AccountItem account={value} />
          <Icon as={IoChevronDown} />
        </HStack>
      </MenuButton>
      <MenuList minW="full">
        {accounts.map((account) => (
          <MenuItem
            key={nanoid()}
            minH={`${minimumHeight}px`}
            onClick={handleAccountClick(account)}
          >
            <AccountItem account={account} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default AccountSelect;
