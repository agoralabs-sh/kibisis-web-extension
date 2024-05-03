import jsQR, { QRCode } from 'jsqr';

// utils
import convertDataUriToImageData from '@extension/utils/convertDataUriToImageData';

export default async function captureQRCodeFromStream(
  videoElement: HTMLVideoElement
): Promise<string> {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
  let dataImageUrl: string;
  let imageData: ImageData | null;
  let result: QRCode | null;

  if (!context) {
    throw new Error(`unable get canvas`);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  context.drawImage(videoElement, 0, 0, window.innerWidth, window.innerHeight);

  dataImageUrl = canvas.toDataURL('image/png');
  imageData = await convertDataUriToImageData(dataImageUrl);

  if (!imageData) {
    throw new Error('unable to get image data for current window');
  }

  result = jsQR(imageData.data, imageData.width, imageData.height);

  if (!result) {
    throw new Error(`no qr code found in stream`);
  }

  return result.data;
}
