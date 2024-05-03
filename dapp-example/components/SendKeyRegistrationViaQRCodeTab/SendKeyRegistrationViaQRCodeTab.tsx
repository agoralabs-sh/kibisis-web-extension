import {
  Box,
  Code,
  CreateToastFnReturn,
  Flex,
  HStack,
  Input,
  Select,
  TabPanel,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { sanitize } from 'dompurify';
import { toString } from 'qrcode';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

// utils
import { createKeyRegistrationTransactionURI } from '../../utils';

const SendKeyRegistrationViaQRCodeTab: FC<IProps> = ({ account, network }) => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  // states
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [type, setType] = useState<'offline' | 'online'>('online');
  const [uri, setURI] = useState<string>('');
  // misc
  const qrCodeSize = 350;
  // handlers
  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) =>
    setNote(event.target.value);
  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setType(event.target.value as 'offline' | 'online');

  useEffect(() => {
    (async () => {
      if (account && network) {
        try {
          const _uri = await createKeyRegistrationTransactionURI({
            from: account.address,
            network,
            note,
            type,
          });
          const svg = await toString(_uri, {
            type: 'svg',
            width: qrCodeSize,
          });

          setURI(_uri);
          setQRCode(svg);
        } catch (error) {
          toast({
            description: error.message,
            status: 'error',
            title: 'Failed to create QR code!',
          });
        }
      }
    })();
  }, [account, network, note, type]);

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/*offline/online*/}
        <HStack spacing={2} w="full">
          <Text>Type:</Text>

          <Select onChange={handleTypeChange} value={type}>
            <option value="offline">Offline</option>
            <option value="online">Online</option>
          </Select>
        </HStack>

        {/*note*/}
        <HStack w="full">
          <Text size="md" textAlign="left">
            Note:
          </Text>
          <Input onChange={handleNoteChange} value={note} />
        </HStack>

        {/*qr code*/}
        {qrCode ? (
          <Box
            dangerouslySetInnerHTML={{
              __html: sanitize(qrCode, {
                USE_PROFILES: { svg: true, svgFilters: true },
              }),
            }}
          />
        ) : (
          <Flex
            alignItems="center"
            h={qrCodeSize}
            justifyContent="center"
            w={qrCodeSize}
          >
            <InfinitySpin
              color={theme.colors.primaryLight['500']}
              width={`${qrCodeSize}px`}
            />
          </Flex>
        )}

        {/*value*/}
        <HStack spacing={2} w="full">
          <Text>Value:</Text>

          <Code fontSize="sm" wordBreak="break-word">
            {uri}
          </Code>
        </HStack>
      </VStack>
    </TabPanel>
  );
};

export default SendKeyRegistrationViaQRCodeTab;
