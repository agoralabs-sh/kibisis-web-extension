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

const CustomNodeSummaryModalContent: FC<IProps> = ({ customNode, network }) => {
  const { t } = useTranslation();

  return (
    <VStack flexGrow={1} spacing={DEFAULT_GAP / 3} w="full">
      {/*general details*/}
      <ModalSubHeading text={t<string>('headings.generalDetails')} />

      {/*name*/}
      <ModalTextItem
        label={`${t<string>('labels.name')}:`}
        tooltipLabel={customNode.name}
        value={customNode.name}
      />

      {/*type*/}
      <ModalItem
        label={`${t<string>('labels.chain')}:`}
        value={<NetworkBadge network={network} />}
      />

      {/*algod details*/}
      <ModalSubHeading text={t<string>('headings.algodDetails')} />

      {/*algod url*/}
      <ModalTextItem
        isCode={true}
        label={`${t<string>('labels.url')}:`}
        tooltipLabel={customNode.algod.url}
        value={customNode.algod.url}
      />

      {/*algod port*/}
      {customNode.algod.port && (
        <ModalTextItem
          isCode={true}
          label={`${t<string>('labels.port')}:`}
          tooltipLabel={customNode.algod.port}
          value={customNode.algod.port}
        />
      )}

      {/*algod token*/}
      {customNode.algod.token && (
        <ModalTextItem
          isCode={true}
          label={`${t<string>('labels.token')}:`}
          tooltipLabel={customNode.algod.token}
          value={customNode.algod.token}
        />
      )}

      {customNode.indexer && (
        <>
          {/*indexer details*/}
          <ModalSubHeading text={t<string>('headings.indexerDetails')} />

          {/*indexer url*/}
          <ModalTextItem
            isCode={true}
            label={`${t<string>('labels.url')}:`}
            tooltipLabel={customNode.indexer.url}
            value={customNode.indexer.url}
          />

          {/*indexer port*/}
          {customNode.indexer.port && (
            <ModalTextItem
              isCode={true}
              label={`${t<string>('labels.port')}:`}
              tooltipLabel={customNode.indexer.port}
              value={customNode.indexer.port}
            />
          )}

          {/*indexer token*/}
          {customNode.indexer.token && (
            <ModalTextItem
              isCode={true}
              label={`${t<string>('labels.token')}:`}
              tooltipLabel={customNode.indexer.token}
              value={customNode.indexer.token}
            />
          )}
        </>
      )}
    </VStack>
  );
};

export default CustomNodeSummaryModalContent;
