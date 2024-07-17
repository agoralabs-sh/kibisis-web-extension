import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import WarningIcon from '@extension/components/WarningIcon';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// theme
import { theme } from '@extension/theme';

// types
import type { IAccount, IDecodedJwt } from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

interface IProps {
  decodedJwt: IDecodedJwt;
  host: string;
  signer: IAccount | null;
}

const SignBytesJwtContent: FC<IProps> = ({
  decodedJwt,
  host,
  signer,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();

  return (
    <VStack spacing={2} w="full">
      <Text textAlign="left" w="full">{`${t<string>(
        'labels.information'
      )}:`}</Text>
      {/*address/sub*/}
      {decodedJwt.payload.subject && (
        <HStack spacing={2} w="full">
          {/*label*/}
          <Text fontSize="xs">{`${t<string>('labels.address')}:`}</Text>

          {/*value*/}
          <Box
            backgroundColor={textBackgroundColor}
            borderRadius={theme.radii['3xl']}
            px={2}
            py={1}
          >
            <Text color={defaultTextColor} fontSize="xs" wordBreak="break-word">
              {decodedJwt.payload.subject}
            </Text>
          </Box>

          {/*warning*/}
          {(!signer ||
            decodedJwt.payload.subject !==
              convertPublicKeyToAVMAddress(signer.publicKey)) && (
            <WarningIcon
              tooltipLabel={t<string>('captions.addressDoesNotMatch')}
            />
          )}
        </HStack>
      )}
      {/*audience/aud*/}
      {decodedJwt.payload.audience && (
        <HStack spacing={2} w="full">
          {/*label*/}
          <Text fontSize="xs">{`${t<string>('labels.audience')}:`}</Text>

          {/*value*/}
          <Box
            backgroundColor={textBackgroundColor}
            borderRadius={theme.radii['3xl']}
            px={2}
            py={1}
          >
            <Text color={defaultTextColor} fontSize="xs" wordBreak="break-word">
              {decodedJwt.payload.audience}
            </Text>
          </Box>

          {/*warning*/}
          {decodedJwt.payload.audience !== host && (
            <WarningIcon
              tooltipLabel={t<string>('captions.audienceDoesNotMatch')}
            />
          )}
        </HStack>
      )}

      {/*expiration date/exp*/}
      <HStack spacing={2} w="full">
        {/*label*/}
        <Text fontSize="xs">{`${t<string>('labels.expirationDate')}:`}</Text>

        {/*value*/}
        <Box
          backgroundColor={textBackgroundColor}
          borderRadius={theme.radii['3xl']}
          px={2}
          py={1}
        >
          <Text color={defaultTextColor} fontSize="xs" wordBreak="break-word">
            {decodedJwt.payload.expiresAt.toLocaleString()}
          </Text>
        </Box>

        {/*warning*/}
        {decodedJwt.payload.expiresAt < new Date() && (
          <WarningIcon
            tooltipLabel={t<string>('captions.securityTokenExpired')}
          />
        )}
      </HStack>
      {/* More information */}
      <Accordion allowToggle={true} w="full">
        <AccordionItem border="none" w="full">
          <AccordionButton px={0}>
            <Text textAlign="left" w="full">{`${t<string>(
              'labels.moreInformation'
            )}:`}</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0}>
            <VStack spacing={2} w="full">
              {/* ID/jti */}
              {decodedJwt.payload.id && (
                <HStack spacing={2} w="full">
                  <Text fontSize="xs">{`${t<string>('labels.id')}:`}</Text>
                  <Box
                    backgroundColor={textBackgroundColor}
                    borderRadius={theme.radii['3xl']}
                    px={2}
                    py={1}
                  >
                    <Text
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {decodedJwt.payload.id}
                    </Text>
                  </Box>
                </HStack>
              )}

              {/* Issuer/iss */}
              {decodedJwt.payload.issuer && (
                <HStack spacing={2} w="full">
                  <Text fontSize="xs">{`${t<string>('labels.issuer')}:`}</Text>
                  <Box
                    backgroundColor={textBackgroundColor}
                    borderRadius={theme.radii['3xl']}
                    px={2}
                    py={1}
                  >
                    <Text
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {decodedJwt.payload.issuer}
                    </Text>
                  </Box>
                </HStack>
              )}

              {/* Issue date/iat */}
              {decodedJwt.payload.issuedAt && (
                <HStack spacing={2} w="full">
                  <Text fontSize="xs">{`${t<string>(
                    'labels.issueDate'
                  )}:`}</Text>
                  <Box
                    backgroundColor={textBackgroundColor}
                    borderRadius={theme.radii['3xl']}
                    px={2}
                    py={1}
                  >
                    <Text
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {decodedJwt.payload.issuedAt.toLocaleString()}
                    </Text>
                  </Box>
                </HStack>
              )}

              {/* Signing method/alg */}
              {decodedJwt.header.algorithm && (
                <HStack spacing={2} w="full">
                  <Text fontSize="xs">{`${t<string>(
                    'labels.signingMethod'
                  )}:`}</Text>
                  <Box
                    backgroundColor={textBackgroundColor}
                    borderRadius={theme.radii['3xl']}
                    px={2}
                    py={1}
                  >
                    <Text
                      color={defaultTextColor}
                      fontSize="xs"
                      wordBreak="break-word"
                    >
                      {decodedJwt.header.algorithm}
                    </Text>
                  </Box>

                  {decodedJwt.header.curve && (
                    <Box
                      borderColor="blue.500"
                      borderRadius={theme.radii['3xl']}
                      borderStyle="solid"
                      borderWidth="1px"
                      px={2}
                      py={1}
                    >
                      <Text
                        color="blue.500"
                        fontSize="xs"
                        wordBreak="break-word"
                      >
                        {decodedJwt.header.curve}
                      </Text>
                    </Box>
                  )}

                  {decodedJwt.header.algorithm !== 'EdDSA' && (
                    <WarningIcon
                      tooltipLabel={t<string>('captions.invalidAlgorithm')}
                    />
                  )}
                </HStack>
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};

export default SignBytesJwtContent;
