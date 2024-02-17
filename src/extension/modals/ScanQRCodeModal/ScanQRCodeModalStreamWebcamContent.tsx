import {
  Box,
  ModalBody,
  ModalContent,
  ModalFooter,
  VStack,
} from '@chakra-ui/react';
import React, {
  FC,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import QRCodeFrameIcon from './QRCodeFrameIcon';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import { useSelectLogger } from '@extension/selectors';

// theme
import { theme } from '@extension/theme';

// types
import type { ILogger } from '@common/types';

interface IProps {
  onPreviousClick: () => void;
}

const ScanQRCodeModalStreamWebcamContent: FC<IProps> = ({
  onPreviousClick,
}: IProps) => {
  const { t } = useTranslation();
  const videoRef: MutableRefObject<HTMLVideoElement | null> =
    useRef<HTMLVideoElement | null>(null);
  // selectors
  const logger: ILogger = useSelectLogger();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  // state
  const [stream, setStream] = useState<MediaStream | null>(null);
  // handlers
  const handlePreviousClick = () => {
    // stop the webcam stream
    if (stream) {
      stream.getTracks().forEach((value) => value.stop());
    }

    onPreviousClick();
  };

  useEffect(() => {
    (async () => {
      const _functionName: string = 'useEffect';
      let _stream: MediaStream;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          _stream = await navigator.mediaDevices.getUserMedia({ video: true });

          setStream(_stream);
        } catch (error) {
          logger.error(
            `${ScanQRCodeModalStreamWebcamContent.name}#${_functionName}: `,
            error
          );
        }
      }
    })();
  }, []);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

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

      {/*body*/}
      <ModalBody display="flex" px={DEFAULT_GAP} zIndex={1}>
        <VStack
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          spacing={DEFAULT_GAP}
          w="full"
        >
          <QRCodeFrameIcon color="white" h="20rem" w="20rem" />
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

export default ScanQRCodeModalStreamWebcamContent;
