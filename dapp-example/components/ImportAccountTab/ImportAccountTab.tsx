import {
  Box,
  Button,
  Code,
  CreateToastFnReturn,
  Flex,
  HStack,
  Select,
  TabPanel,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Account, generateAccount } from 'algosdk';
import { sanitize } from 'dompurify';
import { toString } from 'qrcode';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

// enums
import { ARC0300EncodingEnum } from '@extension/enums';

// theme
import { theme } from '@extension/theme';

// utils
import { convertAccountToImportAccountURI } from '../../utils';

const ImportAccountTab: FC = () => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  // states
  const [account, setAccount] = useState<Account>(generateAccount());
  const [svgString, setSvgString] = useState<string | null>(null);
  const [encoding, setEncoding] = useState<ARC0300EncodingEnum>(
    ARC0300EncodingEnum.Hexadecimal
  );
  // misc
  const qrCodeSize: number = 350;
  // handlers
  const handleEncodingTypeChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setEncoding(event.target.value as ARC0300EncodingEnum);
  const handleGenerateNewAccountClick = () => {
    const _account: Account = generateAccount();

    setAccount(_account);

    toast({
      description: _account.addr,
      status: 'success',
      title: 'New Account Generated',
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const svg: string = await toString(
          convertAccountToImportAccountURI(account, encoding),
          {
            type: 'svg',
            width: qrCodeSize,
          }
        );
        setSvgString(svg);
      } catch (error) {
        toast({
          description: error.message,
          status: 'error',
          title: 'Failed to create QR code!',
        });
      }
    })();
  }, [account, encoding]);

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/*encoding*/}
        <HStack spacing={2} w="full">
          <Text>Encoding:</Text>

          <Select onChange={handleEncodingTypeChange} value={encoding}>
            <option value={ARC0300EncodingEnum.Hexadecimal}>Hexadecimal</option>
            <option value={ARC0300EncodingEnum.Base64URLSafe}>
              Base64 (URL Safe)
            </option>
          </Select>
        </HStack>

        {/*qr code*/}
        {svgString ? (
          <Box
            dangerouslySetInnerHTML={{
              __html: sanitize(svgString, {
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
            {convertAccountToImportAccountURI(account, encoding)}
          </Code>
        </HStack>

        {/*address*/}
        <HStack spacing={2} w="full">
          <Text>Address:</Text>

          <Code fontSize="sm" wordBreak="break-word">
            {account.addr}
          </Code>
        </HStack>

        {/*generate new account button*/}
        <Button
          borderRadius={theme.radii['3xl']}
          colorScheme="primaryLight"
          minW={250}
          onClick={handleGenerateNewAccountClick}
          size="lg"
        >
          Generate New Account
        </Button>
      </VStack>
    </TabPanel>
  );
};

export default ImportAccountTab;
