import jsQR, { QRCode } from 'jsqr';
import browser, { Windows } from 'webextension-polyfill';

// Utils
import { convertDataUriToImageData } from '@extension/utils';

export default async function captureQrCode(): Promise<string> {
  let dataImageUrl: string;
  let imageData: ImageData | null;
  let result: QRCode | null;
  let windows: Windows.Window[];
  let window: Windows.Window | null;

  windows = await browser.windows.getAll();
  window = windows.find((value) => value.type !== 'popup') || null; // get windows that are not popups, i.e. the extension

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
