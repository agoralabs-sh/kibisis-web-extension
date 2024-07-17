import { Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLockClosedOutline, IoLockOpenOutline } from 'react-icons/io5';

// components
import CircularProgressWithIcon from '@extension/components/CircularProgressWithIcon';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import type { IProps } from './types';

const ReEncryptKeysLoadingContent: FC<IProps> = ({
  encryptionProgressState,
  fontSize = 'sm',
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const count = encryptionProgressState.filter(
    ({ encrypted }) => encrypted
  ).length;
  const total = encryptionProgressState.length;
  const incomplete = count < total || total <= 0;

  return (
    <VStack
      alignItems="center"
      flexGrow={1}
      justifyContent="center"
      spacing={DEFAULT_GAP - 2}
      w="full"
    >
      {/*progress*/}
      <CircularProgressWithIcon
        icon={incomplete ? IoLockOpenOutline : IoLockClosedOutline}
        iconColor={incomplete ? defaultTextColor : 'green.600'}
        progress={[count, total]}
        progressColor="green.600"
      />

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
