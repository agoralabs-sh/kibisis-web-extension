import {
  Heading,
  Icon,
  Link,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { FC, MutableRefObject, useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  IoAlertCircleOutline,
  IoArrowBackOutline,
  IoBanOutline,
} from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import QRCodeFrameIcon from './QRCodeFrameIcon';

// constants
import {
  BODY_BACKGROUND_COLOR,
  DEFAULT_GAP,
  SUPPORT_MAIL_TO_LINK,
} from '@extension/constants';

// enums
import { ErrorCodeEnum, ScanModeEnum } from '@extension/enums';

// hooks
import useCameraStream from '@extension/hooks/useCameraStream';
import useCaptureQRCode from '@extension/hooks/useCaptureQRCode';
import useColorModeValue from '@extension/hooks/useColorModeValue';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// theme
import { theme } from '@extension/theme';

// types
import type { ILogger } from '@common/types';
import type { IScanQRCodeModalContentProps } from '@extension/types';

const ScanQRCodeViaCameraModalContent: FC<IScanQRCodeModalContentProps> = ({
  onPreviousClick,
  onURI,
}) => {
  const videoRef: MutableRefObject<HTMLVideoElement | null> =
    useRef<HTMLVideoElement | null>(null);
  const { t } = useTranslation();
  // hooks
  const {
    error,
    loading,
    reset: resetCameraStream,
    startStream,
    stream,
  } = useCameraStream();
  const {
    resetAction: resetScanAction,
    startScanningAction,
    uri,
  } = useCaptureQRCode();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = useColorModeValue(
    theme.colors.primaryLight['500'],
    theme.colors.primaryDark['500']
  );
  const subTextColor: string = useSubTextColor();
  // misc
  const reset = () => {
    // stop scanning and stop streaming
    resetCameraStream();
    resetScanAction();
  };
  // handlers
  const handlePreviousClick = () => {
    onPreviousClick();
    reset();
  };
  // renders
  const renderBody = () => {
    if (stream) {
      return <QRCodeFrameIcon color="white" h="20rem" w="20rem" />;
    }

    if (error) {
      // if the camera was denied access, show a special error
      if (error.code === ErrorCodeEnum.CameraNotAllowedError) {
        return (
          <>
            {/*icon*/}
            <Icon as={IoBanOutline} color={defaultTextColor} h={16} w={16} />

            {/*captions*/}
            <Text color={defaultTextColor} fontSize="md" textAlign="center">
              {t<string>('captions.cameraQRCodeScanNotAllowed1')}
            </Text>
            <Text color={defaultTextColor} fontSize="md" textAlign="center">
              {t<string>('captions.cameraQRCodeScanNotAllowed2')}
            </Text>
          </>
        );
      }

      return (
        <>
          {/*icon*/}
          <Icon as={IoAlertCircleOutline} color="red.500" h={16} w={16} />

          {/*heading*/}
          <Heading color={defaultTextColor} textAlign="center">
            {t<string>('errors.titles.code', { context: error.code })}
          </Heading>

          {/*description*/}
          <Text color={subTextColor} fontSize="sm" textAlign="center">
            {t<string>('errors.descriptions.code', { context: error.code })}
          </Text>

          <Text color={subTextColor} fontSize="sm" textAlign="center">
            <Trans i18nKey="captions.support">
              Please{' '}
              <Link
                color="red.500"
                href={SUPPORT_MAIL_TO_LINK}
                isExternal={true}
              >
                contact us
              </Link>{' '}
              for further assistance so we can resolve this issue for you.
            </Trans>
          </Text>
        </>
      );
    }

    return (
      <>
        {/*loader*/}
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor={defaultTextColor}
          color={primaryColor}
          size="xl"
        />

        {/*caption*/}
        <Text color={defaultTextColor} fontSize="md" textAlign="center">
          {t<string>('captions.loadingCameraStream')}
        </Text>
      </>
    );
  };

  useEffect(() => {
    (async () => await startStream())();
  }, []);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      // once we start the stream, start scanning for a qr code
      startScanningAction({
        mode: ScanModeEnum.Camera,
        videoElement: videoRef.current,
      });
    }
  }, [stream]);
  useEffect(() => {
    if (uri) {
      onURI(uri);

      reset();
    }
  }, [uri]);

  return (
    <ModalContent
      backgroundColor={BODY_BACKGROUND_COLOR}
      borderTopRadius={theme.radii['3xl']}
      borderBottomRadius={0}
      position="relative"
    >
      {/*video element*/}
      <video
        autoPlay={true}
        ref={videoRef}
        style={{
          height: '100%',
          maxWidth: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          transform: 'rotateY(180deg)',
          zIndex: 0,
        }}
      />

      {/*header*/}
      {error && error.code === ErrorCodeEnum.CameraNotAllowedError && (
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.cameraDenied')}
          </Heading>
        </ModalHeader>
      )}
      {loading && (
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.cameraLoading')}
          </Heading>
        </ModalHeader>
      )}

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP} zIndex={1}>
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          {renderBody()}
        </VStack>
      </ModalBody>

      {/*footer*/}
      <ModalFooter p={DEFAULT_GAP} zIndex={1}>
        {/*previous button*/}
        <Button
          leftIcon={<IoArrowBackOutline />}
          onClick={handlePreviousClick}
          size="lg"
          variant="outline"
          w="full"
        >
          {t<string>('buttons.previous')}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default ScanQRCodeViaCameraModalContent;
