/**
 * Format metadata.
 * This means grouping elements with same type.
 */
export default interface IMetadataFormatter<T> {
	formatMetadata(metadata: T);
}
