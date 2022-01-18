import IMetadataFormatter from "./IMetadataFormatter";
import { Profile } from "../metadata-types/Profile";
import { compareByField } from "../utils/comparators";
import { sortObjectPropertiesAlphabetically } from "../utils/objectSorters";

export default class ProfileFormatter implements IMetadataFormatter<Profile> {
	formatMetadata(profile: Profile) {
		if (profile.Profile.classAccesses != null) {
			profile.Profile.classAccesses.sort((a, b) =>
				compareByField(a, b, "apexClass")
			);
			profile.Profile.classAccesses.map((classAccess) =>
				sortObjectPropertiesAlphabetically(classAccess)
			);
		}
	}
}
