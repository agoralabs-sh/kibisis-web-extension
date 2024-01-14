// enums
import { UploadStatusEnum } from '../enums';

interface IUploadStatusResponse {
  createdTime: string;
  errorCode: string | null;
  errors: string[] | null;
  id: string;
  lastUpdatedTime: string;
  message: string;
  status: UploadStatusEnum;
}

export default IUploadStatusResponse;
