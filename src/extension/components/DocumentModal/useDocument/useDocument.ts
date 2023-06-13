import { useEffect, useState } from 'react';

// Types
import { IUseDocumentState } from './types';

export default function useDocument(
  documentName: string,
  language: string = 'en'
): IUseDocumentState {
  const [document, setDocument] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let response: Response;
      let text: string;

      try {
        setFetching(true);

        response = await fetch(`documents/${documentName}/${language}.md`);
        text = await response.text();

        setDocument(text.length > 0 ? text : null);
      } catch (error) {
        setError(error.message);
      }

      setFetching(false);
    })();
  }, [documentName]);

  return {
    document,
    error,
    fetching,
  };
}
