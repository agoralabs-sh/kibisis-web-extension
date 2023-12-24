// types
import IDocument from './IDocument';

interface IUseDocumentState {
  document: IDocument | null;
  error: string | null;
  fetching: boolean;
}

export default IUseDocumentState;
