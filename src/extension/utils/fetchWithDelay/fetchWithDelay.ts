interface IOptions {
  delay: number;
  url: string;
}

/**Convenient function that simply wraps a fetch in a delay.
 * @param {IOptions} options - options needed to send the request.
 * @returns {Response} the response.
 */
export default async function fetchWithDelay({
  delay,
  url,
}: IOptions): Promise<Response> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let response: Response;

      try {
        response = await fetch(url);

        resolve(response);
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
