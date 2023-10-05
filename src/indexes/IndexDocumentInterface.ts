export type Document = new (
  ...args: readonly never[]
) => IndexDocumentInterface;

export interface IndexDocumentInterface {
  getId(): string;
  toJSON(): Record<string, unknown>;
}
