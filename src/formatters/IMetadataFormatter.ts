import {Metadata, RawMetadata} from "../metadata-types/Metadata";

export default interface IMetadataFormatter<T extends Metadata> {
	formatMetadata(metadata: T)

	formatRawMetadata(rawMetadata: RawMetadata<T>)
}
