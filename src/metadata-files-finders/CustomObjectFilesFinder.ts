import { IMetadataFilesFinder } from "./IMetadataFilesFinder";
import { findFilesWithExtension } from "../utils/filesUtils";
import { FILE_EXTENSION } from "../metadata-types/CustomObject";

export class CustomObjectFilesFinder implements IMetadataFilesFinder {
	findFiles(): Promise<string[]> {
		return findFilesWithExtension(FILE_EXTENSION);
	}
}
