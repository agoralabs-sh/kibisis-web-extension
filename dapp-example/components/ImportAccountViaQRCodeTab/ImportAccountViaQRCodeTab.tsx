import {
  Box,
  Button,
  Checkbox,
  Code,
  Flex,
  HStack,
  TabPanel,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { encode as encodeHex } from '@stablelib/hex';
import { encodeAddress } from 'algosdk';
import { sanitize } from 'dompurify';
import { toString } from 'qrcode';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';
import { randomBytes } from 'tweetnacl';

// constants
import {
  EXPORT_ACCOUNT_PAGE_LIMIT,
  EXPORT_ACCOUNT_QR_CODE_DURATION,
} from '@extension/constants';

// hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import usePrimaryColorScheme from '../../hooks/usePrimaryColorScheme';
import useSubTextColor from '../../hooks/useSubTextColor';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// theme
import { theme } from '@extension/theme';

// utils
import createAccountImportURI from '@extension/utils/createAccountImportURI';

const ImportAccountViaQRCodeTab: FC = () => {
  const toast = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  // states
  const [addNames, setAddNames] = useState<boolean>(false);
  const [isPagination, setIsPagination] = useState<boolean>(false);
  const [keyPairs, setKeyPairs] = useState<Ed21559KeyPair[]>([]);
  const [multipleAccounts, setMultipleAccounts] = useState<boolean>(false);
  const [pagination, setPagination] = useState<[number, number]>([1, 1]);
  const [svgStrings, setSvgStrings] = useState<string[] | null>(null);
  const [uris, setURIs] = useState<string[] | null>(null);
  // misc
  const generateKeyPairs = () => {
    let length = 1; // default to 1 account

    // for multiple account, use the maximum per page and if pagination, add 3 page's worth
    if (multipleAccounts) {
      length = isPagination
        ? EXPORT_ACCOUNT_PAGE_LIMIT * 3 - 2
        : EXPORT_ACCOUNT_PAGE_LIMIT;
    }

    setPagination([1, Math.ceil(length / EXPORT_ACCOUNT_PAGE_LIMIT)]);

    return setKeyPairs(Array.from({ length }, () => Ed21559KeyPair.generate()));
  };
  const qrCodeSize = 350;
  // handlers
  const handleAddNamesCheckChange = (event: ChangeEvent<HTMLInputElement>) =>
    setAddNames(event.target.checked);
  const handleGenerateNewAccountsClick = () => generateKeyPairs();
  const handleMultipleAccountsCheckChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => setMultipleAccounts(event.target.checked);
  const handlePaginationCheckChange = (event: ChangeEvent<HTMLInputElement>) =>
    setIsPagination(event.target.checked);

  useEffect(() => {
    const intervalId: number = window.setInterval(() => {
      setPagination(([current, total]) => {
        // if the current page is at the total, start again
        if (current >= total) {
          return [1, total];
        }

        return [current + 1, total];
      });
    }, EXPORT_ACCOUNT_QR_CODE_DURATION);

    generateKeyPairs();

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    (async () => {
      let _svgStrings: string[];
      let _uris: string[];

      try {
        _uris = createAccountImportURI({
          accounts: keyPairs.map(({ privateKey }) => ({
            privateKey,
            ...(addNames && {
              name: encodeHex(randomBytes(16)), // 32-byte string max
            }),
          })),
        });

        setURIs(_uris);

        _svgStrings = await Promise.all(
          _uris.map(
            async (value) =>
              await toString(value, {
                type: 'svg',
                width: qrCodeSize,
              })
          )
        );

        setSvgStrings(_svgStrings);
      } catch (error) {
        toast({
          description: error.message,
          status: 'error',
          title: 'Failed to create QR code(s)!',
        });
      }
    })();
  }, [keyPairs]);
  // regenerate accounts
  useEffect(
    () => generateKeyPairs(),
    [addNames, multipleAccounts, isPagination]
  );

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/*add names checkbox*/}
        <HStack alignItems="center" spacing={2} w="full">
          <Checkbox
            isChecked={addNames}
            onChange={handleAddNamesCheckChange}
            size="lg"
          />

          <Text color={subTextColor} fontSize="sm" w="full">
            Add names?
          </Text>
        </HStack>

        {/*multiple accounts checkbox*/}
        <HStack alignItems="center" spacing={2} w="full">
          <Checkbox
            isChecked={multipleAccounts}
            onChange={handleMultipleAccountsCheckChange}
            size="lg"
          />

          <Text color={subTextColor} fontSize="sm" w="full">
            Multiple accounts?
          </Text>
        </HStack>

        {/*pagination checkbox*/}
        <HStack alignItems="center" spacing={2} w="full">
          <Checkbox
            isChecked={isPagination}
            isDisabled={!multipleAccounts}
            onChange={handlePaginationCheckChange}
            size="lg"
          />

          <Text color={subTextColor} fontSize="sm" w="full">
            Pagination?
          </Text>
        </HStack>

        {/*qr code*/}
        {svgStrings ? (
          <Box
            dangerouslySetInnerHTML={{
              __html: sanitize(svgStrings[pagination[0] - 1], {
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

        {/*captions*/}
        <Text
          color={subTextColor}
          fontSize="sm"
        >{`Displaying ${pagination[0]} of ${pagination[1]}`}</Text>

        {/*value*/}
        <VStack spacing={2} w="full">
          <Text color={defaultTextColor} fontSize="sm">
            URI(s):
          </Text>

          <VStack spacing={1} w="full">
            {uris ? (
              uris.map((value, index) => (
                <Code
                  fontSize="sm"
                  key={`import-account uri-${index}`}
                  wordBreak="break-word"
                >
                  {value}
                </Code>
              ))
            ) : (
              <Code fontSize="sm">-</Code>
            )}
          </VStack>
        </VStack>

        {/*address*/}
        <VStack spacing={2} w="full">
          <Text color={defaultTextColor}>Addresses:</Text>

          <VStack spacing={1} w="full">
            {keyPairs.map((value, index) => (
              <Code
                fontSize="sm"
                key={`import-account-address-${index}`}
                wordBreak="break-word"
              >
                {encodeAddress(value.publicKey)}
              </Code>
            ))}
          </VStack>
        </VStack>

        {/*generate new accounts button*/}
        <Button
          borderRadius={theme.radii['3xl']}
          colorScheme={primaryColorScheme}
          minW={250}
          onClick={handleGenerateNewAccountsClick}
          size="lg"
        >
          Generate New Account
        </Button>
      </VStack>
    </TabPanel>
  );
};

export default ImportAccountViaQRCodeTab;
