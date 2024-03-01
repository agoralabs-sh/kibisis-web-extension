/**
 * Convenience function that simply checks if the device's camera is accessible.
 * NOTE: This is not the same as allowed/denied, this is to actually determine if the device has a camera or not.
 * @return {boolean} true, if the device has a camera, false otherwise.
 */
export default function isCameraAvailable(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
