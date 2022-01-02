import { Metadata } from "../metadata-types/Metadata";

export default interface IMetadataFormatter<T extends Metadata, RawVersion> {
	formatMetadata(metadata: T);

	formatRawMetadata(rawMetadata: RawVersion);
}
