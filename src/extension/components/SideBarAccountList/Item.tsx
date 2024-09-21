import {
  Button,
  ButtonProps,
  Center,
  HStack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import type { Identifier, XYCoord } from 'dnd-core';
import React, { type FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

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
  const [{ isDragging }, dragRef] = useDrag<IDragItem, unknown, IDragCollect>(
    () => ({
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: () => ({ id: account.id, index }),
      type: Item.name,
    })
  );
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
  const activeProps: Partial<ButtonProps> = active
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
  dragRef(dropRef(ref));
  // handlers
  const handleOnClick = () => onClick(account.id);

  return (
    <Tooltip
      aria-label="Name or address of the account"
      label={account.name || address}
    >
      <Button
        {...activeProps}
        borderRadius={0}
        cursor="move"
        data-handler-id={handlerId}
        fontSize="md"
        justifyContent="start"
        minH={SIDEBAR_ITEM_HEIGHT}
        onClick={handleOnClick}
        opacity={isDragging ? 0 : 1}
        p={0}
        ref={ref}
        variant="ghost"
        w="full"
      >
        {/*icon*/}
        <HStack m={0} p={0} spacing={DEFAULT_GAP / 3} w="full">
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
              flexGrow={1}
              justifyContent="space-evenly"
              spacing={0}
              w="full"
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
                {ellipseAddress(address, {
                  end: 10,
                  start: 10,
                })}
              </Text>
            </VStack>
          ) : (
            <Text
              color={defaultTextColor}
              flexGrow={1}
              fontSize="sm"
              textAlign="left"
            >
              {ellipseAddress(address, {
                end: 10,
                start: 10,
              })}
            </Text>
          )}
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default Item;
