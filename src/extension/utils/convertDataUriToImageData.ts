/**
 * Converts an image data URI to image data.
 * @param {string} datUri - the image data URI.
 * @returns {Promise<ImageData | null>} the image data or null if no image could be found in the URI.
 */
export default function convertDataUriToImageData(
  datUri: string
): Promise<ImageData | null> {
  return new Promise((resolve) => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    const image: HTMLImageElement = new Image();

    // add an event listener for when the image has been loaded.
    image.addEventListener('load', () => {
      canvas.width = image.width;
      canvas.height = image.height;

      if (!context) {
        return resolve(null);
      }

      // update the canvas with the image
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      return resolve(context.getImageData(0, 0, canvas.width, canvas.height));
    });

    image.src = datUri;
  });
}
