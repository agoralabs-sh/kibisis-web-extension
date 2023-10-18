import {
  Center,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react';
import React, { FC } from 'react';

// Hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// Theme
import { theme } from '@extension/theme';

interface IProps {
  index: number;
  labels: string[];
  onChange: (index: number) => void;
}

const PillSwitch: FC<IProps> = ({ index, labels, onChange }: IProps) => {
  const borderColor: string = useBorderColor();
  const defaultTextColor: string = useDefaultTextColor();
  const height: number = 10; // 2.5rem > 40px > md
  const minWidth: number = 24;
  const padding: number = 0.5;

  return (
    <Tabs
      isFitted={true}
      onChange={onChange}
      position="relative"
      size="md"
      variant="unstyled"
    >
      <TabList
        bg={borderColor}
        borderRadius={theme.radii['3xl']}
        py={padding}
        px={padding * 2}
      >
        {labels.map((value, index) => (
          <Tab key={`pill-switch-labels-item-${index}`} minW={minWidth}>
            <Text color={defaultTextColor} textAlign="center" w="full">
              {value}
            </Text>
          </Tab>
        ))}
      </TabList>
      <TabIndicator
        bg={theme.colors['white']}
        borderRadius={theme.radii['3xl']}
        h={`calc(${theme.sizes[height]} - (${theme.space[padding]} + ${theme.space[padding]}))`}
        minW={minWidth}
        mt={`calc(-${theme.sizes[height]} + (-${theme.space[padding]} + ${theme.space[padding]}))`}
      >
        <Center alignItems="center" h="full">
          <Text color="gray.500" textAlign="center" w="full">
            {labels[index]}
          </Text>
        </Center>
      </TabIndicator>
    </Tabs>
  );
};

export default PillSwitch;
