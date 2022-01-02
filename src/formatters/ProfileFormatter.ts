import IMetadataFormatter from "./IMetadataFormatter";
import { Profile, RawProfile } from "../metadata-types/Profile";
import { compareByField } from "../utils/comparators";
import { sortObjectPropertiesAlphabetically } from "../utils/objectSorters";

export default class ProfileFormatter
	implements IMetadataFormatter<Profile, RawProfile>
{
	formatMetadata(metadata: Profile) {
		//TODO
	}

	formatRawMetadata(rawMetadata: RawProfile) {
		if (rawMetadata.Profile.classAccesses != null) {
			rawMetadata.Profile.classAccesses.sort((a, b) =>
				compareByField(a, b, "apexClass")
			);
			rawMetadata.Profile.classAccesses.map((classAccess) =>
				sortObjectPropertiesAlphabetically(classAccess)
			);
		}
	}
}
