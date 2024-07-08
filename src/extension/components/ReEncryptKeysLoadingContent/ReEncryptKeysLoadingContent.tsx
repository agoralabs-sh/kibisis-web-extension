import {
  CircularProgress,
  CircularProgressLabel,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLockClosedOutline, IoLockOpenOutline } from 'react-icons/io5';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

// utils
import calculateIconSize from '@extension/utils/calculateIconSize';

const ReEncryptKeysLoadingContent: FC<IProps> = ({
  encryptionProgressState,
  fontSize = 'sm',
}) => {
  const { t } = useTranslation();
  // hooks
  const subTextColor = useSubTextColor();
  // misc
  const count = encryptionProgressState.filter(
    ({ encrypted }) => encrypted
  ).length;
  const iconSize = calculateIconSize('lg');
  const total = encryptionProgressState.length;
  const incomplete = count < total || total <= 0;

  console.log('encryptionProgressState:', encryptionProgressState);

  return (
    <VStack
      alignItems="center"
      flexGrow={1}
      justifyContent="center"
      spacing={DEFAULT_GAP - 2}
      w="full"
    >
      {/*progress*/}
      <CircularProgress
        color="green.600"
        size="100px"
        thickness="4px"
        trackColor="gray.600"
        value={total > 0 ? (count / total) * 100 : 0}
      >
        <CircularProgressLabel>
          <Icon
            as={incomplete ? IoLockOpenOutline : IoLockClosedOutline}
            color={incomplete ? 'gray.600' : 'green.600'}
            h={iconSize}
            w={iconSize}
          />
        </CircularProgressLabel>
      </CircularProgress>

      {/*caption*/}
      <Text
        color={subTextColor}
        fontSize={fontSize}
        textAlign="center"
        w="full"
      >
        {t<string>('captions.reEncryptingKeys', {
          count,
          total,
        })}
      </Text>
    </VStack>
  );
};

export default ReEncryptKeysLoadingContent;
