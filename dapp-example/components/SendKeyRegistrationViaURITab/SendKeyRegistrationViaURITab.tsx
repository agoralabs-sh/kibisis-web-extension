import {
  Box,
  Button,
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

// hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import usePrimaryColorScheme from '../../hooks/usePrimaryColorScheme';

// theme
import { theme } from '@extension/theme';

// types
import type { IProps } from './types';

// utils
import { createKeyRegistrationTransactionURI } from '../../utils';

const SendKeyRegistrationViaURITab: FC<IProps> = ({ account, network }) => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  // states
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [type, setType] = useState<'offline' | 'online'>('online');
  const [uri, setURI] = useState<string>('');
  // misc
  const qrCodeSize = 350;
  // handlers
  const handleCopyOmniboxURIClick = async () => {
    if (uri) {
      await window.navigator.clipboard.writeText(`kibisis ${uri}`);

      toast({
        status: 'success',
        title: 'Copied Omnibox URI!',
      });
    }
  };
  const handleCopyURIClick = async () => {
    if (uri) {
      await window.navigator.clipboard.writeText(uri);

      toast({
        status: 'success',
        title: 'Copied URI!',
      });
    }
  };
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
          <Text color={defaultTextColor} fontSize="sm">
            Type:
          </Text>

          <Select
            color={defaultTextColor}
            onChange={handleTypeChange}
            value={type}
          >
            <option value="offline">Offline</option>
            <option value="online">Online</option>
          </Select>
        </HStack>

        {/*note*/}
        <HStack w="full">
          <Text color={defaultTextColor} fontSize="sm" textAlign="left">
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
          <Text color={defaultTextColor} fontSize="sm">
            Value:
          </Text>

          <Code fontSize="sm" wordBreak="break-word">
            {uri}
          </Code>
        </HStack>

        <HStack justifyContent="center" spacing={2} w="full">
          {/*copy uri button*/}
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme={primaryColorScheme}
            minW={250}
            onClick={handleCopyURIClick}
            size="lg"
          >
            Copy URI
          </Button>

          {/*copy omnibox uri button*/}
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme={primaryColorScheme}
            minW={250}
            onClick={handleCopyOmniboxURIClick}
            size="lg"
          >
            Copy Omnibox URI
          </Button>
        </HStack>
      </VStack>
    </TabPanel>
  );
};

export default SendKeyRegistrationViaURITab;
