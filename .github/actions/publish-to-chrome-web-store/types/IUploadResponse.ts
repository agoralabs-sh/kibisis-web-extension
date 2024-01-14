interface IUploadResponse {
  id: string;
  itemError: string[];
  kind: 'chromewebstore#item';
  publicKey: string;
  uploadState: string;
}

export default IUploadResponse;
