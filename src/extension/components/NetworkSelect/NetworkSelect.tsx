import {
  Button as ChakraButton,
  Icon,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GoSingleSelect } from 'react-icons/go';

// components
import NetworkBadge from '@extension/components/NetworkBadge';

// constants
import { DEFAULT_GAP, INPUT_HEIGHT } from '@extension/constants';

// hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useBorderColor from '@extension/hooks/useBorderColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// modals
import NetworkSelectModal from './NetworkSelectModal';

// types
import type { INetwork } from '@extension/types';
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const NetworkSelect: FC<IProps> = ({ _context, networks, onSelect, value }) => {
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
  const iconSize = calculateIconSize('md');
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

      <Tooltip label={t<string>('labels.openSelectModal')}>
        <ChakraButton
          _hover={{
            bg: buttonHoverBackgroundColor,
          }}
          aria-label={'labels.openSelectModal'}
          alignItems="center"
          borderColor={borderColor}
          borderStyle="solid"
          borderWidth="1px"
          borderRadius="md"
          justifyContent="space-between"
          minH={INPUT_HEIGHT}
          onClick={handleOnClick}
          p={DEFAULT_GAP / 3}
          rightIcon={
            <Icon as={GoSingleSelect} boxSize={iconSize} color={subTextColor} />
          }
          variant="ghost"
        >
          <NetworkBadge network={value} />
        </ChakraButton>
      </Tooltip>
    </>
  );
};

export default NetworkSelect;
