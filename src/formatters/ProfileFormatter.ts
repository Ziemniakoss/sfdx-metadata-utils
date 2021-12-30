import IMetadataFormatter from "./IMetadataFormatter";
import {Profile} from "../metadata-types/Profile";
import {RawMetadata} from "../metadata-types/Metadata";

export default class ProfileFormatter implements  IMetadataFormatter<Profile> {
	formatMetadata(metadata: Profile) {
		//TODO
	}

	formatRawMetadata(rawMetadata: RawMetadata<Profile>) {
		//TODO
	}

	private formatApexAccesses(rawMetadata: RawMetadata<Profile>) {

	}

	private formatApexAccesses(metadata: Profile) {
		metadata.classAccesses.s

	}
}
