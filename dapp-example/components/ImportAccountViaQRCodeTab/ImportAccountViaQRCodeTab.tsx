import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Code,
  CreateToastFnReturn,
  Flex,
  HStack,
  Select,
  TabPanel,
  Text,
  Tooltip,
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

// types
import type { IAccountImportAsset } from './types';

// utils
import createAccountImportURI from '@extension/utils/createAccountImportURI';
import createWatchAccountImportURI from '@extension/utils/createWatchAccountImportURI';

const ImportAccountViaQRCodeTab: FC = () => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  // states
  const [account, setAccount] = useState<Account>(generateAccount());
  const [addAsWatchAccount, setAddAsWatchAccount] = useState<boolean>(false);
  const [assets, setAssets] = useState<IAccountImportAsset[]>([
    {
      appId: '6779767',
      checked: false,
      name: 'Voi Incentive Asset',
    },
    {
      appId: '99',
      checked: false,
      name: 'Non-ARC0200 Asset',
    },
  ]);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [uri, setURI] = useState<string | null>(null);
  const [encoding, setEncoding] = useState<ARC0300EncodingEnum>(
    ARC0300EncodingEnum.Hexadecimal
  );
  // misc
  const qrCodeSize: number = 350;
  // handlers
  const handleAddAsWatchAccountCheckChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => setAddAsWatchAccount(event.target.checked);
  const handleAssetCheckChange =
    (appId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setAssets(
        assets.map((value) => {
          if (value.appId === appId) {
            return {
              ...value,
              checked: event.target.checked,
            };
          }

          return value;
        })
      );
    };
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
      let _assets: string[];
      let _svg: string;
      let _uri: string;

      try {
        _assets = assets
          .filter((value) => value.checked)
          .map((value) => value.appId);
        _uri = addAsWatchAccount
          ? createWatchAccountImportURI({
              address: account.addr,
              assets: _assets,
            })
          : createAccountImportURI({
              assets: _assets,
              encoding,
              privateKey: account.sk,
            });

        setURI(_uri);

        _svg = await toString(_uri, {
          type: 'svg',
          width: qrCodeSize,
        });

        setSvgString(_svg);
      } catch (error) {
        toast({
          description: error.message,
          status: 'error',
          title: 'Failed to create QR code!',
        });
      }
    })();
  }, [account, addAsWatchAccount, assets, encoding]);

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/*add as a watch account checkbox*/}
        <HStack alignItems="center" spacing={2} w="full">
          <Checkbox
            isChecked={addAsWatchAccount}
            onChange={handleAddAsWatchAccountCheckChange}
            size="lg"
          />

          <Text size="md" w="full">
            Add as a watch account?
          </Text>
        </HStack>

        {/*encoding*/}
        {!addAsWatchAccount && (
          <HStack spacing={2} w="full">
            <Text>Encoding:</Text>

            <Select onChange={handleEncodingTypeChange} value={encoding}>
              <option value={ARC0300EncodingEnum.Hexadecimal}>
                Hexadecimal
              </option>
              <option value={ARC0300EncodingEnum.Base64URLSafe}>
                Base64 (URL Safe)
              </option>
            </Select>
          </HStack>
        )}

        {/*assets to add*/}
        <VStack alignItems="flex-start" spacing={4} w="full">
          <Text>Add Assets:</Text>

          <CheckboxGroup>
            {assets.map((value, index) => (
              <HStack key={`account-import-add-asset-${index}`}>
                <Checkbox
                  isChecked={value.checked}
                  onChange={handleAssetCheckChange(value.appId)}
                  size="lg"
                  value={value.appId}
                />

                <Tooltip label={value.name}>
                  <Text noOfLines={1} size="md" w={200}>
                    {value.name}
                  </Text>
                </Tooltip>
              </HStack>
            ))}
          </CheckboxGroup>
        </VStack>

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
            {uri}
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

export default ImportAccountViaQRCodeTab;
