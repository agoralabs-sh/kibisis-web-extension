import { useEffect, useState } from 'react';

// Types
import { IDocument, IUseDocumentState } from './types';

export default function useDocument(documentUrl: string): IUseDocumentState {
  const [document, setDocument] = useState<IDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let blob: Blob;
      let response: Response;
      let text: string;

      try {
        setFetching(true);

        response = await fetch(documentUrl);
        blob = await response.blob();
        text = await blob.text();

        setDocument({
          blob,
          text,
        });
      } catch (error) {
        setError(error.message);
      }

      setFetching(false);
    })();
  }, [documentUrl]);

  return {
    document,
    error,
    fetching,
  };
}
