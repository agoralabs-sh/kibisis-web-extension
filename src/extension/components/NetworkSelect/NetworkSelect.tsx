import {
  Button as ChakraButton,
  Icon,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownOutline } from 'react-icons/io5';

// components
import NetworkBadge from '@extension/components/NetworkBadge';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import NetworkSelectModal from './NetworkSelectModal';

// types
import type { INetwork } from '@extension/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const NetworkSelect: FC<IProps> = ({
  _context,
  networks,
  onSelect,
  size,
  value,
}) => {
  const { t } = useTranslation();
  const {
    isOpen: isSelectModalOpen,
    onClose: onSelectClose,
    onOpen: onSelectModalOpen,
  } = useDisclosure();
  // hooks
  const borderColor = useBorderColor();
  const buttonHoverBackgroundColor = useButtonHoverBackgroundColor();
  const subTextColor = useSubTextColor();
  // misc
  const iconSize = calculateIconSize('sm');
  // handlers
  const handleOnClick = () => onSelectModalOpen();
  const handleOnSelect = (_value: INetwork) => onSelect(_value);

  return (
    <>
      {/*select modal*/}
      <NetworkSelectModal
        _context={_context}
        isOpen={isSelectModalOpen}
        networks={networks}
        onClose={onSelectClose}
        onSelect={handleOnSelect}
        selectedGenesisHash={value.genesisHash}
      />

      <Tooltip label={t<string>('labels.chooseANetwork')}>
        <ChakraButton
          _hover={{
            bg: buttonHoverBackgroundColor,
            borderColor: borderColor,
          }}
          aria-label={t<string>('labels.chooseANetwork')}
          alignItems="center"
          borderColor="transparent"
          borderStyle="solid"
          borderWidth="1px"
          borderRadius="full"
          h="auto"
          justifyContent="space-between"
          onClick={handleOnClick}
          paddingBottom={0}
          paddingLeft={0}
          paddingRight={DEFAULT_GAP / 3}
          paddingTop={0}
          rightIcon={
            <Icon
              as={IoChevronDownOutline}
              boxSize={iconSize}
              color={subTextColor}
            />
          }
          variant="ghost"
        >
          <NetworkBadge network={value} size={size} />
        </ChakraButton>
      </Tooltip>
    </>
  );
};

export default NetworkSelect;
