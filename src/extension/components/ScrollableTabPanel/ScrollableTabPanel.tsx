import { TabPanel, TabPanelProps } from '@chakra-ui/react';
import React, { FC, MutableRefObject, useRef } from 'react';

interface IProps extends TabPanelProps {
  onScrollEnd?: () => void;
}

const ScrollableTabPanel: FC<IProps> = ({
  children,
  onScrollEnd,
  ...tabPanelProps
}: IProps) => {
  const ref: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const handleScroll = () => {
    if (onScrollEnd && ref.current) {
      if (
        ref.current.scrollHeight -
          (ref.current.clientHeight + ref.current.scrollTop) ===
        0
      ) {
        onScrollEnd();
      }
    }
  };

  return (
    <TabPanel
      onScroll={handleScroll}
      ref={ref}
      overflowY="scroll"
      {...tabPanelProps}
    >
      {children}
    </TabPanel>
  );
};

export default ScrollableTabPanel;
