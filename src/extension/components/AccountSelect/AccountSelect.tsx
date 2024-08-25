import {
  Button as ChakraButton,
  Icon,
  Stack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownOutline } from 'react-icons/io5';

// components
import AccountItem from '@extension/components/AccountItem';
import Label from '@extension/components/Label';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@extension/constants';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import AccountSelectModal from './AccountSelectModal';

// theme
import { theme } from '@extension/theme';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

const AccountSelect: FC<IProps> = ({
  _context,
  accounts,
  allowWatchAccounts,
  disabled = false,
  label,
  onSelect,
  required = false,
  value,
}) => {
  const { t } = useTranslation();
  // hooks
  const borderColor = useBorderColor();
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const primaryColorCode = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  const {
    isOpen: isAccountSelectModalOpen,
    onClose: onAccountSelectClose,
    onOpen: onAccountSelectModalOpen,
  } = useDisclosure();
  // handlers
  const handleOnClick = () => onAccountSelectModalOpen();
  const handleOnSelect = (_value: IAccountWithExtendedProps[]) =>
    onSelect(_value[0]);

  return (
    <>
      {/*account select modal*/}
      <AccountSelectModal
        _context={_context}
        accounts={accounts}
        allowWatchAccounts={allowWatchAccounts}
        isOpen={isAccountSelectModalOpen}
        multiple={false}
        onClose={onAccountSelectClose}
        onSelect={handleOnSelect}
      />

      <VStack alignItems="flex-start" spacing={DEFAULT_GAP / 3} w="full">
        {/*label*/}
        {label && (
          <Label label={label} px={DEFAULT_GAP - 2} required={required} />
        )}

        <ChakraButton
          _focus={{
            borderColor: primaryColor,
            boxShadow: `0 0 0 1px ${primaryColorCode}`,
          }}
          _hover={{
            bg: buttonHoverBackgroundColor,
            borderColor: borderColor,
          }}
          aria-label={t<string>('labels.selectAccount')}
          alignItems="center"
          borderStyle="solid"
          borderWidth="1px"
          borderRadius="full"
          h={INPUT_HEIGHT}
          justifyContent="space-between"
          onClick={handleOnClick}
          px={DEFAULT_GAP - 2}
          py={0}
          rightIcon={
            <Icon
              as={IoChevronDownOutline}
              boxSize={calculateIconSize()}
              color={subTextColor}
            />
          }
          variant="ghost"
          w="full"
        >
          <Stack flexGrow={1} justifyContent="center" w="full">
            <AccountItem
              address={convertPublicKeyToAVMAddress(value.publicKey)}
              {...(value.name && { name: value.name })}
            />
          </Stack>
        </ChakraButton>
      </VStack>
    </>
  );
};

export default AccountSelect;
