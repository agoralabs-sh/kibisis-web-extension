// enums
import { ARC0300AuthorityEnum, ARC0300QueryEnum } from '@extension/enums';

interface IScanQRCodeModal {
  allowedAuthorities: ARC0300AuthorityEnum[];
  allowedQueries: ARC0300QueryEnum[];
}

export default IScanQRCodeModal;
