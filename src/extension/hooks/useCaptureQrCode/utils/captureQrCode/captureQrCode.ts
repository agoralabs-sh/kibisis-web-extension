import jsQR, { QRCode } from 'jsqr';
import browser, { Windows } from 'webextension-polyfill';

// types
import { IScanMode } from '@extension/hooks/useCaptureQrCode';

// utils
import convertDataUriToImageData from '@extension/utils/convertDataUriToImageData';

export default async function captureQrCode(mode: IScanMode): Promise<string> {
  let dataImageUrl: string;
  let imageData: ImageData | null;
  let result: QRCode | null;
  let windows: Windows.Window[];
  let window: Windows.Window | null = null;

  windows = await browser.windows.getAll();

  switch (mode) {
    case 'browserWindow':
      window = windows.find((value) => value.type !== 'popup') || null; // get windows that are not the extension window
      break;
    case 'extensionPopup':
      window = windows.find((value) => value.type === 'popup') || null; // get extension window as we will be showing a video from teh webcam
      break;
    default:
      break;
  }

  if (!window) {
    throw new Error('unable to find browser window');
  }

  dataImageUrl = await browser.tabs.captureVisibleTab(window.id, {
    format: 'png',
  });
  imageData = await convertDataUriToImageData(dataImageUrl);

  if (!imageData) {
    throw new Error('unable to get image data for current window');
  }

  result = jsQR(imageData.data, imageData.width, imageData.height);

  if (!result) {
    throw new Error('no qr code found');
  }

  return result.data;
}
