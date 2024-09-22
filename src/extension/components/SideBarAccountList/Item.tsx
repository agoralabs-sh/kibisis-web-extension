import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Button,
  Center,
  HStack,
  Icon,
  type StackProps,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { IoReorderTwoOutline } from 'react-icons/io5';

// components
import AccountAvatarWithBadges from '@extension/components/AccountAvatarWithBadges';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  SIDEBAR_ITEM_HEIGHT,
  SIDEBAR_MIN_WIDTH,
} from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IItemProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

const Item: FC<IItemProps> = ({
  account,
  accounts,
  active,
  isShortForm,
  network,
  onClick,
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: account.id,
  });
  // hooks
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  const activeBackground = useColorModeValue('gray.200', 'whiteAlpha.200');
  // misc
  const address = convertPublicKeyToAVMAddress(account.publicKey);
  const activeProps: Partial<StackProps> = active
    ? {
        _hover: {
          bg: activeBackground,
        },
        bg: activeBackground,
      }
    : {
        _hover: {
          bg: buttonHoverBackgroundColor,
        },
        bg: BODY_BACKGROUND_COLOR,
      };
  // handlers
  const handleOnClick = () => onClick(account.id);

  return (
    <Tooltip
      aria-label="Name or address of the account"
      label={account.name || address}
    >
      <HStack
        {...activeProps}
        ref={setNodeRef}
        spacing={0}
        transform={CSS.Translate.toString({
          x: 0,
          y: transform?.y ?? 0,
          scaleX: transform?.scaleX ?? 1,
          scaleY: transform?.scaleY ?? 1,
        })}
        transition={transition}
        w="full"
        zIndex={isDragging ? 1 : 'auto'}
      >
        <Button
          _hover={{
            bg: 'none',
          }}
          bgColor="none"
          borderRadius={0}
          cursor="pointer"
          flexGrow={1}
          fontSize="md"
          justifyContent="start"
          minH={SIDEBAR_ITEM_HEIGHT}
          onClick={handleOnClick}
          p={0}
          variant="ghost"
        >
          {/*icon*/}
          <HStack m={0} p={0} spacing={DEFAULT_GAP / 3}>
            <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
              <AccountAvatarWithBadges
                account={account}
                accounts={accounts}
                network={network}
              />
            </Center>

            {/*name/address*/}
            {account.name ? (
              <VStack
                alignItems="flex-start"
                justifyContent="space-evenly"
                spacing={0}
                {...(isShortForm && {
                  display: 'none',
                })}
              >
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  maxW={195}
                  noOfLines={1}
                  textAlign="left"
                >
                  {account.name}
                </Text>

                <Text color={subTextColor} fontSize="xs" textAlign="left">
                  {ellipseAddress(address)}
                </Text>
              </VStack>
            ) : (
              <Text
                color={defaultTextColor}
                fontSize="sm"
                textAlign="left"
                {...(isShortForm && {
                  display: 'none',
                })}
              >
                {ellipseAddress(address)}
              </Text>
            )}
          </HStack>
        </Button>

        {/*re-order button*/}
        <Button
          _hover={{
            bg: 'none',
          }}
          bgColor="none"
          borderRadius={0}
          cursor="move"
          minH={SIDEBAR_ITEM_HEIGHT}
          p={0}
          variant="ghost"
          {...(isShortForm && {
            display: 'none',
          })}
          {...attributes}
          {...listeners}
        >
          <Icon
            as={IoReorderTwoOutline}
            boxSize={calculateIconSize()}
            color={subTextColor}
          />
        </Button>
      </HStack>
    </Tooltip>
  );
};

export default Item;
