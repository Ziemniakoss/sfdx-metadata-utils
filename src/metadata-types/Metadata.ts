export abstract class Metadata {
	fullName: string;
}

/**
 * Useful for extraction from xml
 */
export type RawMetadata<T extends Metadata> = Record<keyof T, []>
