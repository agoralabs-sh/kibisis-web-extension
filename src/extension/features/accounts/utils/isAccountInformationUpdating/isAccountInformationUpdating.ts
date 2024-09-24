// types
import type { IOptions } from './types';

export default function isAccountInformationUpdating({
  accountID,
  updateRequests,
  requestID,
}: IOptions): boolean {
  return (
    updateRequests.find(
      (value) =>
        value.accountIDs.some((_value) => _value === accountID) &&
        value.requestID !== requestID
    )?.information || false
  );
}
