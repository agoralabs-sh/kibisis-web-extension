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
import type { Identifier, XYCoord } from 'dnd-core';
import React, { type FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IoReorderTwoOutline } from 'react-icons/io5';

// components
import AccountAvatarWithBadges from '@extension/components/AccountAvatarWithBadges';

// constants
import {
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
import type { IDragCollect, IDragItem } from '@extension/types';
import type { IItemProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import ellipseAddress from '@extension/utils/ellipseAddress';

const Item: FC<IItemProps> = ({
  account,
  accounts,
  active,
  index,
  network,
  onClick,
  onSort,
  onSortComplete,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [{ isDragging }, dragRef, previewRef] = useDrag<
    IDragItem,
    unknown,
    IDragCollect
  >(() => ({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => ({ id: account.id, index }),
    type: Item.name,
  }));
  const [{ handlerId }, dropRef] = useDrop<
    IDragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: Item.name,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop: onSortComplete,
    hover(item, monitor) {
      let clientOffset: XYCoord | null;
      let dragIndex: number;
      let hoverBoundingRect: DOMRect;
      let hoverClientY: number;
      let hoverIndex: number;
      let hoverMiddleY: number;

      if (!ref.current) {
        return;
      }

      dragIndex = item.index;
      hoverIndex = index;

      // don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // determine rectangle on screen
      hoverBoundingRect = ref.current?.getBoundingClientRect();
      // get middle
      hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // determine mouse position
      clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      // get pixels to the top
      hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // sort the indexes
      onSort(dragIndex, hoverIndex);

      // update index
      item.index = hoverIndex;
    },
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
      };
  previewRef(dropRef(ref));
  // handlers
  const handleOnClick = () => onClick(account.id);

  return (
    <Tooltip
      aria-label="Name or address of the account"
      label={account.name || address}
    >
      <HStack
        {...activeProps}
        data-handler-id={handlerId}
        opacity={isDragging ? 0 : 1}
        ref={ref}
        spacing={0}
        w="full"
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
              <Text color={defaultTextColor} fontSize="sm" textAlign="left">
                {ellipseAddress(address)}
              </Text>
            )}
          </HStack>
        </Button>
        <Button
          _hover={{
            bg: 'none',
          }}
          bgColor="none"
          borderRadius={0}
          cursor="move"
          minH={SIDEBAR_ITEM_HEIGHT}
          p={0}
          ref={dragRef}
          variant="ghost"
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
