import { Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { IoEllipsisVerticalOutline } from 'react-icons/io5';

// components
import IconButton from '@extension/components/IconButton';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const OverflowMenu: FC<IProps> = ({ context, items }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Overflow menu"
        icon={IoEllipsisVerticalOutline}
        variant="ghost"
      />

      <MenuList>
        {items.map(({ icon, label, onSelect }, index) => (
          <MenuItem
            color={defaultTextColor}
            fontSize="sm"
            key={`${context}-overflow-menu-item-${index}`}
            minH={DEFAULT_GAP * 2}
            onClick={onSelect}
            {...(icon && {
              icon: (
                <Icon
                  as={icon}
                  boxSize={calculateIconSize()}
                  color={defaultTextColor}
                />
              ),
            })}
          >
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default OverflowMenu;
