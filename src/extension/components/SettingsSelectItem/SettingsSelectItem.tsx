import { Box, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IconType } from 'react-icons';
import Select, { GroupBase, OptionProps, SingleValueProps } from 'react-select';

// components
import SettingsSelectItemOption from './SettingsSelectItemOption';

// constants
import { DEFAULT_GAP, SETTINGS_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// theme
import { theme } from '@extension/theme';

export interface IOption<Value = unknown> {
  icon?: IconType;
  label: string;
  value: Value;
}
interface IProps {
  description?: string;
  emptyOptionLabel: string;
  label: string;
  onChange: (option: IOption) => void;
  options: IOption[];
  value: IOption | undefined;
  width?: string | number;
}

const SettingsSelectItem: FC<IProps> = ({
  description,
  emptyOptionLabel,
  label,
  onChange,
  options,
  value,
  width,
}: IProps) => {
  // hooks
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const primaryColor25: string = useColorModeValue(
    theme.colors.primaryLight['200'],
    theme.colors.primaryDark['200']
  );
  const primaryColor50: string = useColorModeValue(
    theme.colors.primaryLight['300'],
    theme.colors.primaryDark['300']
  );
  const primaryColor75: string = useColorModeValue(
    theme.colors.primaryLight['400'],
    theme.colors.primaryDark['400']
  );
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // handlers
  const handleOnChange = (option: IOption) => onChange(option);

  return (
    <HStack
      alignItems="center"
      h={SETTINGS_ITEM_HEIGHT}
      justifyContent="space-between"
      pb={DEFAULT_GAP - 2}
      px={DEFAULT_GAP - 2}
      spacing={2}
      w="full"
    >
      {/*label/description*/}
      <VStack
        alignItems="flex-start"
        flexGrow={1}
        justifyContent="center"
        spacing={1}
      >
        <Text color={defaultTextColor} fontSize="sm">
          {label}
        </Text>
        {description && (
          <Text color={subTextColor} fontSize="xs">
            {description}
          </Text>
        )}
      </VStack>

      {/*select*/}
      <Box minW="40%">
        <Select
          components={{
            NoOptionsMessage: () => (
              <HStack
                alignItems="center"
                justifyContent="flex-start"
                m={0}
                p={DEFAULT_GAP / 2}
                position="absolute"
                spacing={2}
                w="full"
              >
                {/*label*/}
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  maxW={250}
                  noOfLines={1}
                >
                  {emptyOptionLabel}
                </Text>
              </HStack>
            ),
            Option: ({
              data,
              innerProps,
              isSelected,
            }: OptionProps<IOption, false, GroupBase<IOption>>) => (
              <SettingsSelectItemOption
                icon={data.icon}
                isSelected={isSelected}
                label={data.label}
                onClick={innerProps.onClick}
              />
            ),
            SingleValue: ({
              data,
            }: SingleValueProps<IOption, false, GroupBase<IOption>>) => (
              <HStack
                alignItems="center"
                justifyContent="flex-start"
                m={0}
                p={DEFAULT_GAP / 2}
                position="absolute"
                spacing={2}
                w="full"
              >
                {/*icon*/}
                {data.icon && (
                  <Icon as={data.icon} color={defaultTextColor} h={4} w={4} />
                )}

                {/*label*/}
                <Text
                  color={defaultTextColor}
                  fontSize="sm"
                  maxW={250}
                  noOfLines={1}
                >
                  {data.label}
                </Text>
              </HStack>
            ),
          }}
          onChange={handleOnChange}
          options={options}
          styles={{
            container: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
              width: width || '100%',
            }),
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
              cursor: 'pointer',
              height: '100%',
            }),
            indicatorSeparator: (baseStyles) => ({
              ...baseStyles,
              display: 'none',
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
            }),
          }}
          theme={(value) => ({
            ...value,
            colors: {
              ...theme.colors,
              primary: primaryColor,
              primary25: primaryColor25,
              primary50: primaryColor50,
              primary75: primaryColor75,
            },
          })}
          value={value || null}
        />
      </Box>
    </HStack>
  );
};

export default SettingsSelectItem;
