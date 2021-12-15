import { IMetadataFilesFinder } from "./IMetadataFilesFinder";
import { findFilesWithExtension } from "../utils/FilesFineder";

export class LabelsFilesFinder implements IMetadataFilesFinder {
	async findFiles(): Promise<string[]> {
		return findFilesWithExtension(".labels.xml");
	}
}
