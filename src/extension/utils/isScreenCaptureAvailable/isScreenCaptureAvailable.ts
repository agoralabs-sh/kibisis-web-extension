/**
 * Convenience function that simply checks if the device's screen capture is accessible.
 * NOTE: This is not the same as allowed/denied, this is to actually determine if the device has screen capture capabilities or not.
 * @return {boolean} true, if the device has a screen capture capabilities, false otherwise.
 */
export default function isScreenCaptureAvailable(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
}
