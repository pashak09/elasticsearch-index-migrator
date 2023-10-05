import { Document } from '@lib/indexes/IndexDocumentInterface';

export class IndexNameResolver {
  resolve(document: Document): string {
    const documentName = document.name.toString();

    return (
      documentName.charAt(0).toLowerCase() +
      documentName
        .slice(1)
        .replace(
          /[A-Z]/g,
          (letter: string): string => `_${letter.toLowerCase()}`,
        )
    );
  }
}
