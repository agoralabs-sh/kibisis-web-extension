import {
  Input,
  Menu,
  MenuItem,
  MenuList,
  Text,
  VStack,
  HStack,
  MenuButton,
  Tooltip,
} from '@chakra-ui/react';
import React, {
  ChangeEvent,
  FC,
  FocusEvent,
  MutableRefObject,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDown } from 'react-icons/io5';

// components
import AccountItem from '@extension/components/AccountItem';
import IconButton from '@extension/components/IconButton';

// constants
import { ACCOUNT_SELECT_ITEM_MINIMUM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAccount } from '@extension/types';

interface IProps {
  accounts: IAccount[];
  disabled?: boolean;
  error: string | null;
  label?: string;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  value: string;
}

const AddressInput: FC<IProps> = ({
  accounts,
  disabled,
  error,
  label,
  onBlur,
  onChange,
  value,
}: IProps) => {
  const { t } = useTranslation();
  const accountSelectRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  // handlers
  const handleAccountClick = (account: IAccount) => () =>
    onChange(
      AccountService.convertPublicKeyToAlgorandAddress(account.publicKey)
    );
  const handleHandleOnChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);

  return (
    <VStack alignItems="flex-start" w="full">
      {/*label*/}
      <Text
        color={error ? 'red.300' : defaultTextColor}
        fontSize="md"
        textAlign="left"
      >
        {label || t<string>('labels.address')}
      </Text>

      <VStack alignItems="flex-start" w="full">
        <HStack alignItems="center" w="full">
          {/*input*/}
          <Input
            disabled={disabled}
            focusBorderColor={error ? 'red.300' : primaryColor}
            isInvalid={!!error}
            onBlur={onBlur}
            onChange={handleHandleOnChange}
            placeholder={t<string>('placeholders.enterAddress')}
            ref={accountSelectRef}
            size="lg"
            type="text"
            value={value}
          />

          {/*account select*/}
          <Menu>
            <Tooltip
              aria-label={t<string>('labels.selectWalletAccount')}
              label={t<string>('labels.selectWalletAccount')}
            >
              <MenuButton
                as={IconButton}
                aria-label={t<string>('labels.selectWalletAccount')}
                icon={IoChevronDown}
                size="md"
                variant="ghost"
              />
            </Tooltip>

            <MenuList w="full">
              {accounts.map((account, index) => (
                <MenuItem
                  key={`address-input-item-${index}`}
                  minH={`${ACCOUNT_SELECT_ITEM_MINIMUM_HEIGHT}px`}
                  onClick={handleAccountClick(account)}
                >
                  <AccountItem account={account} />
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>

        {/*error*/}
        <Text color="red.300" fontSize="xs" textAlign="left">
          {error}
        </Text>
      </VStack>
    </VStack>
  );
};

export default AddressInput;
