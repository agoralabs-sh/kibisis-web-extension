interface IUploadResponse {
  channel: 'listed' | 'unlisted';
  processed: boolean;
  submitted: boolean;
  url: string;
  uuid: string;
  valid: boolean;
  version: string;
}

export default IUploadResponse;
