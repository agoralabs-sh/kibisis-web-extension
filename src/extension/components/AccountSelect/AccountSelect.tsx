import {
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoChevronDown } from 'react-icons/io5';

// components
import AccountItem from '@extension/components/AccountItem';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';

// types
import { IAccount } from '@extension/types';
import { DEFAULT_GAP } from '@extension/constants';

interface IProps {
  accounts: IAccount[];
  onSelect: (account: IAccount) => void;
  value: IAccount;
}

const AccountSelect: FC<IProps> = ({ accounts, onSelect, value }: IProps) => {
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const expandedBackground: string = useColorModeValue(
    'primaryLight.400',
    'primaryDark.400'
  );
  const handleAccountClick = (account: IAccount) => () => onSelect(account);
  const minimumHeight: number = 48;

  return (
    <Menu matchWidth={true}>
      <MenuButton
        _expanded={{ bg: expandedBackground }}
        _focus={{ boxShadow: 'outline' }}
        _hover={{ bg: buttonHoverBackgroundColor }}
        borderRadius="md"
        borderWidth="1px"
        minH={`${minimumHeight}px`}
        px={DEFAULT_GAP - 2}
        py={DEFAULT_GAP / 3}
        transition="all 0.2s"
        w="full"
      >
        <HStack justifyContent="space-between" w="full">
          <AccountItem account={value} />
          <Icon as={IoChevronDown} />
        </HStack>
      </MenuButton>

      <MenuList w="full">
        {accounts.map((account, index) => (
          <MenuItem
            key={`account-select-item-${index}`}
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
