import {
  BaseError,
  IBaseResult,
  ISignBytesResult,
  IWalletAccount,
} from '@agoralabs-sh/algorand-provider';
import {
  Box,
  Code,
  CreateToastFnReturn,
  HStack,
  Icon,
  Select,
  TabPanel,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { verifyBytes } from 'algosdk';
import { nanoid } from 'nanoid';
import React, { ChangeEvent, FC, useState } from 'react';
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from 'react-icons/io5';
import { v4 as uuid } from 'uuid';

// Components
import Button from '../src/components/Button';

// Types
import { IWindow } from '../src/types';

// Utils
import encodeBase64Url from '../src/utils/encodeBase64Url';
import { isValidJwt } from './utils';
import { theme } from '../src/theme';

interface IProps {
  enabledAccounts: IWalletAccount[];
  genesisHash: string | null;
  toast: CreateToastFnReturn;
}

const SignDataTab: FC<IProps> = ({
  enabledAccounts,
  genesisHash,
  toast,
}: IProps) => {
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [signedData, setSignedData] = useState<string | null>(null);
  const handleClearClick = () => {
    setHeader('');
    setPayload('');
    setSelectedAddress(null);
    setSignedData(null);
  };
  const handleSignJwtClick = async () => {
    let decoder: TextDecoder;
    let encoder: TextEncoder;
    let result: IBaseResult & ISignBytesResult;
    let signature: string;

    if (
      !header ||
      !payload ||
      !selectedAddress ||
      !isValidJwt(header, payload)
    ) {
      return;
    }

    if (!(window as IWindow).algorand) {
      toast({
        description:
          'Algorand Provider has been intialized; there is no supported wallet.',
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: 'window.algorand Not Found!',
      });

      return;
    }

    try {
      signature = `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(
        JSON.stringify(payload)
      )}`;
      encoder = new TextEncoder();
      result = await (window as IWindow).algorand.signBytes({
        data: encoder.encode(signature),
        signer: selectedAddress,
      });
    } catch (error) {
      toast({
        description: (error as BaseError).message,
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
      });
    }
  };
  const handleHeaderTextareaChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => setHeader(event.target.value);
  const handlePayloadTextareaChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => setPayload(event.target.value);
  const handleVerifySignedJWT = () => {
    let encoder: TextEncoder;
    let verifiedResult: boolean;

    if (!header || !payload || !signedData || !selectedAddress) {
      toast({
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: 'No Data To Verify!',
      });

      return;
    }

    encoder = new TextEncoder();
    verifiedResult = verifyBytes(
      encoder.encode(''),
      encoder.encode(signedData),
      selectedAddress
    ); // verify using the algosdk

    if (!verifiedResult) {
      toast({
        description: 'The signed data failed verification',
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: 'Signed Data is Invalid!',
      });

      return;
    }

    toast({
      description: 'The signed data has been verified.',
      duration: 3000,
      isClosable: true,
      status: 'success',
      title: 'Signed Data is Valid!',
    });
  };
  const handleUseJwtPreset = () => {
    const now: number = Math.round(new Date().getTime() / 1000); // now in seconds

    setHeader(`{
  "alg": "ES256",
  "typ": "JWT"
}`);
    setPayload(`{
  "aud": "${window.location.protocol}//${window.location.host}",
  "exp": ${now + 300},
  "iat": ${now},
  "iss": "did:algo:${selectedAddress}",
  "jti": "${uuid()}",
  "gty": "did",
  "sub": "${selectedAddress}"
}`);
  };

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/* Address */}
        <HStack spacing={2} w="full">
          <Text>Address:</Text>
          <Select placeholder="Select an address">
            {enabledAccounts.map((value) => (
              <option key={nanoid()} value={value.address}>
                {value.address}
              </option>
            ))}
          </Select>
        </HStack>
        {/* Header */}
        <VStack alignItems="flex-start" spacing={2} w="full">
          <Text>Header:</Text>
          <Textarea
            onChange={handleHeaderTextareaChange}
            placeholder={`A valid JWT header, e.g.:
{
  "alg": "ES256",
  "typ": "JWT"
}
            `}
            rows={4}
            value={header || ''}
          />
          <HStack spacing={2} w="full">
            <Text>Encoded:</Text>
            {header && (
              <Code wordBreak="break-word">{encodeBase64Url(header)}</Code>
            )}
          </HStack>
        </VStack>
        {/* Payload */}
        <VStack alignItems="flex-start" spacing={2} w="full">
          <Text>Payload:</Text>
          <Textarea
            onChange={handlePayloadTextareaChange}
            placeholder={`A valid JWT payload, e.g.:
{
  "aud": "https://exmaple.com",
  "exp": 109282718,
  ...
}
            `}
            rows={9}
            value={payload || ''}
          />
          <HStack spacing={2} w="full">
            <Text>Encoded:</Text>
            {payload && (
              <Code wordBreak="break-word">{encodeBase64Url(payload)}</Code>
            )}
          </HStack>
        </VStack>
        {/* Valid */}
        <HStack spacing={2}>
          <Text>Is JWT Valid:</Text>
          {isValidJwt(header, payload) ? (
            <Icon as={IoCheckmarkCircleSharp} color="green.500" size="md" />
          ) : (
            <Icon as={IoCloseCircleSharp} color="red.500" size="md" />
          )}
        </HStack>
        {/* CTAs */}
        <VStack justifyContent="center" spacing={3} w="full">
          <Button
            colorScheme="primary"
            minW={250}
            onClick={handleUseJwtPreset}
            size="lg"
          >
            Use JWT Preset
          </Button>
          <Button
            colorScheme="primary"
            minW={250}
            onClick={handleSignJwtClick}
            size="lg"
          >
            Sign JWT
          </Button>
          <Button
            colorScheme="primary"
            isDisabled={!signedData}
            minW={250}
            onClick={handleVerifySignedJWT}
            size="lg"
          >
            Verify Signed JWT
          </Button>
          <Button
            colorScheme="primary"
            minW={250}
            onClick={handleClearClick}
            size="lg"
            variant="outline"
          >
            Clear
          </Button>
        </VStack>
      </VStack>
    </TabPanel>
  );
};

export default SignDataTab;
