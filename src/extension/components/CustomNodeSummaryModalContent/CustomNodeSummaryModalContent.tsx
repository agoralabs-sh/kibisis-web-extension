import { VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import NetworkBadge from '@extension/components/NetworkBadge';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import ModalSubHeading from '@extension/components/ModalSubHeading';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// types
import type { IProps } from './types';

const CustomNodeSummaryModalContent: FC<IProps> = ({ item, network }) => {
  const { t } = useTranslation();

  return (
    <VStack flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
      {/*general details*/}
      <ModalSubHeading text={t<string>('headings.general')} />

      {/*name*/}
      <ModalTextItem
        label={`${t<string>('labels.name')}:`}
        tooltipLabel={item.name}
        value={item.name}
      />

      {/*type*/}
      <ModalItem
        label={`${t<string>('labels.network')}:`}
        value={<NetworkBadge network={network} />}
      />

      {item.algod && (
        <>
          {/*algod details*/}
          <ModalSubHeading text={t<string>('headings.algodDetails')} />

          {/*algod url*/}
          <ModalTextItem
            isCode={true}
            label={`${t<string>('labels.url')}:`}
            tooltipLabel={item.algod.url}
            value={item.algod.url}
          />

          {/*algod port*/}
          {item.algod.port && (
            <ModalTextItem
              isCode={true}
              label={`${t<string>('labels.port')}:`}
              tooltipLabel={item.algod.port}
              value={item.algod.port}
            />
          )}

          {/*algod token*/}
          {item.algod.token && (
            <ModalTextItem
              isCode={true}
              label={`${t<string>('labels.token')}:`}
              tooltipLabel={item.algod.token}
              value={item.algod.token}
            />
          )}
        </>
      )}

      {item.indexer && (
        <>
          {/*indexer details*/}
          <ModalSubHeading text={t<string>('headings.indexerDetails')} />

          {/*indexer url*/}
          <ModalTextItem
            isCode={true}
            label={`${t<string>('labels.url')}:`}
            tooltipLabel={item.indexer.url}
            value={item.indexer.url}
          />

          {/*indexer port*/}
          {item.indexer.port && (
            <ModalTextItem
              isCode={true}
              label={`${t<string>('labels.port')}:`}
              tooltipLabel={item.indexer.port}
              value={item.indexer.port}
            />
          )}

          {/*indexer token*/}
          {item.indexer.token && (
            <ModalTextItem
              isCode={true}
              label={`${t<string>('labels.token')}:`}
              tooltipLabel={item.indexer.token}
              value={item.indexer.token}
            />
          )}
        </>
      )}
    </VStack>
  );
};

export default CustomNodeSummaryModalContent;
