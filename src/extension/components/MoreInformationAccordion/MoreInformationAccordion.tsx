import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// types
import type { IProps } from './types';

const MoreInformationAccordion: FC<IProps> = ({
  children,
  color,
  fontSize,
  isOpen,
  label,
  minButtonHeight,
  onChange,
}) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const handleOnChange = (value: number) => onChange(value > -1);

  return (
    <Accordion
      allowToggle={true}
      index={isOpen ? 0 : -1}
      onChange={handleOnChange}
      w="full"
    >
      <AccordionItem border="none" w="full">
        <AccordionButton minH={minButtonHeight} p={0}>
          <Text
            color={color || defaultTextColor}
            fontSize={fontSize}
            textAlign="left"
            w="full"
          >
            {label || t<string>('labels.moreInformation')}
          </Text>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={0} pt={2} px={0}>
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default MoreInformationAccordion;
