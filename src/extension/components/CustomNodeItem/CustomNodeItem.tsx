import {
  HStack,
  Stack,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoEyeOutline,
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
  IoTrashOutline,
} from 'react-icons/io5';

// components
import OverflowMenu from '@extension/components/OverflowMenu';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useItemBorderColor from '@extension/hooks/useItemBorderColor';

// types
import type { IProps } from './types';

const CustomNodeItem: FC<IProps> = ({
  item,
  isActivated,
  onActivate,
  onDeactivate,
  onRemove,
  onSelect,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const itemBorderColor = useItemBorderColor();
  // handlers
  const handleOnActivateClick = () => onActivate(item.id);
  const handleOnDeactivateClick = () => onDeactivate();
  const handleOnRemoveClick = () => onRemove(item.id);
  const handleOnSelectClick = () => onSelect(item.id);

  return (
    <HStack
      borderBottomColor={itemBorderColor}
      borderBottomStyle="solid"
      borderBottomWidth="1px"
      m={0}
      p={DEFAULT_GAP - 2}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      {/*details*/}
      <HStack
        alignItems="center"
        flexGrow={1}
        justifyContent="space-evenly"
        spacing={DEFAULT_GAP / 3}
      >
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="space-between"
          spacing={1}
          w="full"
        >
          {/*name*/}
          <Tooltip label={item.name}>
            <Text
              color={defaultTextColor}
              fontSize="md"
              maxW={400}
              noOfLines={1}
              textAlign="left"
              w="full"
            >
              {item.name}
            </Text>
          </Tooltip>

          <HStack spacing={DEFAULT_GAP / 3} w="full">
            {/*algod*/}
            <Tag colorScheme="green" size="sm" variant="solid">
              <TagLabel>algod</TagLabel>
              <TagRightIcon as={IoCheckmarkCircleOutline} />
            </Tag>

            {/*indexer*/}
            <Tag
              colorScheme={item.indexer ? 'green' : 'orange'}
              size="sm"
              variant="solid"
            >
              <TagLabel>indexer</TagLabel>
              <TagRightIcon
                as={
                  item.indexer ? IoCheckmarkCircleOutline : IoCloseCircleOutline
                }
              />
            </Tag>
          </HStack>
        </VStack>

        {/*disabled*/}
        {isActivated && (
          <Stack>
            <Tag colorScheme="green" size="sm" variant="subtle">
              <TagLabel>{t<string>('labels.activated')}</TagLabel>
            </Tag>
          </Stack>
        )}
      </HStack>

      {/*overflow menu*/}
      <OverflowMenu
        context={item.id}
        items={[
          // view
          {
            icon: IoEyeOutline,
            label: t<string>('labels.view'),
            onSelect: handleOnSelectClick,
          },
          // activate/deactivate
          ...(isActivated
            ? [
                {
                  icon: IoRadioButtonOffOutline,
                  label: t<string>('labels.deactivate'),
                  onSelect: handleOnDeactivateClick,
                },
              ]
            : [
                {
                  icon: IoRadioButtonOnOutline,
                  label: t<string>('labels.activate'),
                  onSelect: handleOnActivateClick,
                },
              ]),
          // remove
          {
            icon: IoTrashOutline,
            label: t<string>('labels.remove'),
            onSelect: handleOnRemoveClick,
          },
        ]}
      />
    </HStack>
  );
};

export default CustomNodeItem;
