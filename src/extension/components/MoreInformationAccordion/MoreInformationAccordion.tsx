import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  ResponsiveValue,
  Text,
} from '@chakra-ui/react';
import * as CSS from 'csstype';
import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps {
  color?: ResponsiveValue<CSS.Property.Color>;
  children: ReactElement;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  isOpen: boolean;
  minButtonHeight?: ResponsiveValue<number | CSS.Property.MinHeight>;
  onChange: (open: boolean) => void;
}

const MoreInformationAccordion: FC<IProps> = ({
  children,
  color,
  fontSize,
  isOpen,
  minButtonHeight,
  onChange,
}: IProps) => {
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
          >{`${t<string>('labels.moreInformation')}:`}</Text>
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
