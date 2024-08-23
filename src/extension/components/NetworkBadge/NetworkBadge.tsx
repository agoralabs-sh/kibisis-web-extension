import { HStack, StackProps, Text } from '@chakra-ui/react';
import React, { type FC } from 'react';

// enums
import { NetworkTypeEnum } from '@extension/enums';

// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseIconSize from './utils/parseIconSize';
import parsePadding from './utils/parsePadding';
import { DEFAULT_GAP } from '@extension/constants';

const NetworkBadge: FC<IProps> = ({ network, size = 'sm' }) => {
  // hooks
  const primaryColorCode = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const textColorColorCode = useColorModeValue(
    theme.colors.gray['500'],
    theme.colors.whiteAlpha['700']
  );
  // misc
  const fontColor = theme.colors[network.chakraTheme]
    ? 'white'
    : textColorColorCode;
  const nativeCurrencyIcon = createIconFromDataUri(
    network.nativeCurrency.iconUrl,
    {
      color: fontColor,
      boxSize: parseIconSize(size),
    }
  );
  const padding = parsePadding(size);
  // renders
  const renderTypeTag = () => {
    const defaultProps: StackProps = {
      borderRightRadius: 'full',
      paddingLeft: 1,
      paddingRight: padding,
      py: padding - 1,
      spacing: 0,
    };

    switch (network.type) {
      case NetworkTypeEnum.Beta:
        return (
          <HStack backgroundColor={theme.colors.blue['500']} {...defaultProps}>
            <Text color={fontColor} fontSize={size} textAlign="center">
              {`BetaNet`}
            </Text>
          </HStack>
        );
      case NetworkTypeEnum.Test:
        return (
          <HStack
            backgroundColor={theme.colors.yellow['500']}
            {...defaultProps}
          >
            <Text color={fontColor} fontSize={size} textAlign="center">
              {`TestNet`}
            </Text>
          </HStack>
        );
      default:
        return null;
    }
  };
  const renderTags = () => {
    const typeTag = renderTypeTag();
    const defaultProps: StackProps = {
      backgroundColor:
        theme.colors[network.chakraTheme]['500'] || primaryColorCode,
      py: padding - 1,
      spacing: DEFAULT_GAP / 3,
    };

    if (typeTag) {
      return (
        <>
          {/*network name*/}
          <HStack
            borderLeftRadius="full"
            paddingLeft={padding}
            paddingRight={1}
            {...defaultProps}
          >
            {/*icon*/}
            {nativeCurrencyIcon}

            {/*name*/}
            <Text color={fontColor} fontSize={size} textAlign="center">
              {network.canonicalName}
            </Text>
          </HStack>

          {/*network type*/}
          {typeTag}
        </>
      );
    }

    return (
      <HStack borderRadius="full" px={padding} {...defaultProps}>
        {/*icon*/}
        {nativeCurrencyIcon}

        {/*name*/}
        <Text color={fontColor} fontSize={size} textAlign="center">
          {network.canonicalName}
        </Text>
      </HStack>
    );
  };

  return (
    <HStack alignItems="center" justifyContent="flex-start" spacing={0}>
      {renderTags()}
    </HStack>
  );
};

export default NetworkBadge;
