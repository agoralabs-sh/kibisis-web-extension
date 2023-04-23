import {
  AlgorandProvider,
  BaseError,
  IBaseResult,
  ISignBytesResult,
} from '@agoralabs-sh/algorand-provider';
import {
  Button,
  Code,
  CreateToastFnReturn,
  HStack,
  Icon,
  TabPanel,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64Url } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import { verifyBytes } from 'algosdk';
import React, { ChangeEvent, FC, useState } from 'react';
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from 'react-icons/io5';
import { v4 as uuid } from 'uuid';

// Theme
import { theme } from '@extension/theme';

// Types
import { IWindow } from '@external/types';
import { IAccountInformation } from './types';

// Utils
import { isValidJwt } from './utils';

interface IProps {
  account: IAccountInformation | null;
  toast: CreateToastFnReturn;
}

function createSignatureToSign(header: string, payload: string): Uint8Array {
  const encoder: TextEncoder = new TextEncoder();
  const rawHeader: Uint8Array = encoder.encode(
    JSON.stringify(JSON.parse(header))
  );
  const rawPayload: Uint8Array = encoder.encode(
    JSON.stringify(JSON.parse(payload))
  );

  return encoder.encode(
    `${encodeBase64Url(rawHeader)}.${encodeBase64Url(rawPayload)}`
  );
}

const SignJwtTab: FC<IProps> = ({ account, toast }: IProps) => {
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [signedData, setSignedData] = useState<Uint8Array | null>(null);
  const encoder: TextEncoder = new TextEncoder();
  const handleClearClick = () => {
    setHeader('');
    setPayload('');
    setSignedData(null);
  };
  const handleSignJwtClick = (withSigner: boolean) => async () => {
    const algorand: AlgorandProvider | undefined = (window as IWindow).algorand;
    let result: IBaseResult & ISignBytesResult;

    if (
      !header ||
      !payload ||
      (withSigner && !account) ||
      !isValidJwt(header, payload)
    ) {
      console.error('no data/address or the jwt is invalid');

      return;
    }

    if (!algorand) {
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
      result = await algorand.signBytes({
        data: createSignatureToSign(header, payload),
        ...(withSigner && {
          signer: account?.address || undefined,
        }),
      });

      toast({
        description: `Successfully signed JWT for wallet "${result.id}".`,
        duration: 3000,
        isClosable: true,
        status: 'success',
        title: 'JWT Signed!',
      });

      setSignedData(result.signature);
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
    let verifiedResult: boolean;

    if (!header || !payload || !signedData || !account) {
      toast({
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: 'No Data To Verify!',
      });

      return;
    }

    verifiedResult = verifyBytes(
      createSignatureToSign(header, payload),
      signedData,
      account.address
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
    const now: number = new Date().getTime(); // now in milliseconds

    if (!account) {
      toast({
        description: 'No account has been selected',
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: 'No account!',
      });

      return;
    }

    setHeader(`{
  "alg": "EdDSA",
  "crv": "Ed25519",
  "typ": "JWT"
}`);
    setPayload(`{
  "aud": "${window.location.protocol}//${window.location.host}",
  "exp": ${now + 300000},
  "iat": ${now},
  "iss": "did:algo:${account.address}",
  "jti": "${uuid()}",
  "gty": "did",
  "sub": "${account.address}"
}`);
  };

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/* Header */}
        <VStack alignItems="flex-start" spacing={2} w="full">
          <Text>Header:</Text>
          <Textarea
            onChange={handleHeaderTextareaChange}
            placeholder={`A valid JWT header, e.g.:
{
  "alg": "EdDSA",
  "crv": "Ed25519",
  "typ": "JWT"
}
            `}
            rows={5}
            value={header || ''}
          />
          <HStack spacing={2} w="full">
            <Text>Encoded:</Text>
            {header && (
              <Code wordBreak="break-word">
                {encodeBase64Url(
                  encoder.encode(JSON.stringify(JSON.parse(header)))
                )}
              </Code>
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
  "exp": 109282718234,
  ...
}
            `}
            rows={9}
            value={payload || ''}
          />
          <HStack spacing={2} w="full">
            <Text>Encoded:</Text>
            {payload && (
              <Code wordBreak="break-word">
                {encodeBase64Url(
                  encoder.encode(JSON.stringify(JSON.parse(payload)))
                )}
              </Code>
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
        {/* Signed data */}
        <HStack spacing={2} w="full">
          <Text>Encoded signed data (hex):</Text>
          {signedData && (
            <Code fontSize="sm" wordBreak="break-word">
              {encodeHex(signedData).toUpperCase()}
            </Code>
          )}
        </HStack>
        {/* CTAs */}
        <VStack justifyContent="center" spacing={3} w="full">
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            minW={250}
            onClick={handleUseJwtPreset}
            size="lg"
          >
            Use JWT Preset
          </Button>
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            minW={250}
            onClick={handleSignJwtClick(true)}
            size="lg"
          >
            Sign JWT
          </Button>
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            minW={250}
            onClick={handleSignJwtClick(false)}
            size="lg"
          >
            Sign JWT Without Signer
          </Button>
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            isDisabled={!signedData}
            minW={250}
            onClick={handleVerifySignedJWT}
            size="lg"
          >
            Verify Signed JWT
          </Button>
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
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

export default SignJwtTab;
