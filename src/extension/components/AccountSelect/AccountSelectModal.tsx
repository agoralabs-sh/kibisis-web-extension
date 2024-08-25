import {
  Button as ChakraButton,
  Checkbox,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoCheckmarkDoneCircleOutline,
  IoChevronForward,
} from 'react-icons/io5';

// components
import AccountAvatarWithBadges from '@extension/components/AccountAvatarWithBadges';
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  TAB_ITEM_HEIGHT,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectLogger,
  useSelectSettingsSelectedNetwork,
} from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { IAccountWithExtendedProps } from '@extension/types';
import type { TAccountSelectModalProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';
import upsertItemsById from '@extension/utils/upsertItemsById';

const AccountSelectModal: FC<TAccountSelectModalProps> = ({
  _context,
  accounts,
  allowWatchAccounts = true,
  isOpen,
  multiple,
  onClose,
  onSelect,
}) => {
  const { t } = useTranslation();
  // selectors
  const network = useSelectSettingsSelectedNetwork();
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // states
  const [selectedAccounts, setSelectedAccounts] = useState<
    IAccountWithExtendedProps[]
  >([]);
  // misc
  const iconSize = calculateIconSize('md');
  const reset = () => {
    setSelectedAccounts([]);
  };
  // handlers
  const handleOnAccountChange = (account: IAccountWithExtendedProps) => () => {
    // for a single selection, just return the account
    if (!multiple) {
      return handleConfirm([account]);
    }

    // if the account exists in the selected accounts, remove it
    if (selectedAccounts.find((value) => value.id === account.id)) {
      return setSelectedAccounts(
        selectedAccounts.filter((value) => value.id !== account.id)
      );
    }

    setSelectedAccounts(upsertItemsById(selectedAccounts, [account]));
  };
  const handleCancelClick = () => handleClose();
  const handleConfirm = (_accounts: IAccountWithExtendedProps[]) => {
    onSelect(_accounts);
    handleClose();
  };
  const handleConfirmClick = () => handleConfirm(selectedAccounts);
  const handleClose = () => {
    onClose && onClose();

    reset(); // clean up
  };
  const handleOnSelectAllCheckChange = () => {
    if (selectedAccounts.length <= 0) {
      return setSelectedAccounts(
        allowWatchAccounts
          ? accounts
          : accounts.filter((value) => !value.watchAccount)
      );
    }

    setSelectedAccounts([]);
  };
  // renders
  const renderContent = () => {
    if (accounts.length <= 0 || !network) {
      return (
        <>
          <Spacer />

          {/*empty state*/}
          <EmptyState text={t<string>('headings.noAccountsFound')} />

          <Spacer />
        </>
      );
    }

    return accounts.map((account, index) => {
      const address = convertPublicKeyToAVMAddress(account.publicKey);

      return (
        <ChakraButton
          _hover={{
            bg: BODY_BACKGROUND_COLOR,
          }}
          borderRadius="full"
          cursor="not-allowed"
          fontSize="md"
          h={TAB_ITEM_HEIGHT}
          justifyContent="start"
          key={`${_context}-account-select-modal-item-${index}`}
          px={DEFAULT_GAP / 2}
          py={0}
          sx={{
            opacity: 0.6,
          }}
          variant="ghost"
          w="full"
          {...((allowWatchAccounts || !account.watchAccount) && {
            _hover: {
              bg: buttonHoverBackgroundColor,
            },
            cursor: 'pointer',
            onClick: handleOnAccountChange(account),
            sx: {
              opacity: 1,
            },
            rightIcon: multiple ? (
              <Checkbox
                colorScheme={primaryColorScheme}
                isChecked={
                  !!selectedAccounts.find((value) => value.id === account.id)
                }
                pointerEvents="none"
              />
            ) : (
              <Icon
                as={IoChevronForward}
                color={defaultTextColor}
                h={iconSize}
                w={iconSize}
              />
            ),
          })}
        >
          <HStack py={DEFAULT_GAP - 2} spacing={DEFAULT_GAP - 2} w="full">
            {/*account icon*/}
            <AccountAvatarWithBadges
              account={account}
              accounts={accounts}
              network={network}
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
                  color={
                    allowWatchAccounts || !account.watchAccount
                      ? defaultTextColor
                      : subTextColor
                  }
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
                color={
                  allowWatchAccounts || !account.watchAccount
                    ? defaultTextColor
                    : subTextColor
                }
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
          </HStack>
        </ChakraButton>
      );
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />

      <ModalContent
        alignSelf="flex-end"
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
        maxH="75%"
        minH={0}
      >
        {/*heading*/}
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <VStack spacing={DEFAULT_GAP - 2} w="full">
            {/*heading*/}
            <Heading
              color={defaultTextColor}
              size="md"
              textAlign="center"
              w="full"
            >
              {t<string>(
                multiple ? 'headings.selectAccounts' : 'headings.selectAccount'
              )}
            </Heading>

            {/*select all accounts*/}
            {multiple && (
              <Stack
                alignItems="flex-end"
                justifyContent="center"
                px={DEFAULT_GAP / 2}
                w="full"
              >
                <Tooltip
                  aria-label={t<string>('labels.selectAllAccounts')}
                  label={t<string>('labels.selectAllAccounts')}
                >
                  <Checkbox
                    colorScheme={primaryColorScheme}
                    isChecked={selectedAccounts.length === accounts.length}
                    isIndeterminate={
                      selectedAccounts.length > 0 &&
                      selectedAccounts.length < accounts.length
                    }
                    onChange={handleOnSelectAllCheckChange}
                  />
                </Tooltip>
              </Stack>
            )}
          </VStack>
        </ModalHeader>

        {/*body*/}
        <ModalBody px={DEFAULT_GAP}>
          <VStack spacing={1} w="full">
            {renderContent()}
          </VStack>
        </ModalBody>

        {/*footer*/}
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

            {multiple && (
              <Button
                onClick={handleConfirmClick}
                rightIcon={<IoCheckmarkDoneCircleOutline />}
                size="lg"
                variant="solid"
                w="full"
              >
                {t<string>('buttons.confirm')}
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AccountSelectModal;
