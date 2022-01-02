import {IMetadataFilesFinder} from "./IMetadataFilesFinder";
import {findFilesWithExtension} from "../utils/filesUtils";

export class ProfilesFilesFinder implements IMetadataFilesFinder {
	findFiles(): Promise<string[]> {
		return findFilesWithExtension(".profile-meta.xml")
	}
}
