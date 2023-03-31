import {
  Center,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import React, { FC } from 'react';

// Theme
import { theme } from '../../theme';

interface IProps {
  index: number;
  labels: string[];
  onChange: (index: number) => void;
}

const PillSwitch: FC<IProps> = ({ index, labels, onChange }: IProps) => {
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
        bg={useColorModeValue('gray.300', 'whiteAlpha.400')}
        borderRadius={theme.radii['3xl']}
        index={index}
        py={padding}
        px={padding * 2}
      >
        {labels.map((value) => (
          <Tab key={nanoid()} minW={minWidth}>
            <Text
              color={useColorModeValue('gray.500', 'whiteAlpha.800')}
              textAlign="center"
              w="full"
            >
              {value}
            </Text>
          </Tab>
        ))}
      </TabList>
      <TabIndicator
        bg={theme.colors['white']}
        borderRadius={theme.radii['3xl']}
        h={`calc(${theme.sizes[10]} - (${theme.space[padding]} + ${theme.space[padding]}))`}
        minW={minWidth}
        mt={`calc(-${theme.sizes[10]} + (-${theme.space[padding]} + ${theme.space[padding]}))`}
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
