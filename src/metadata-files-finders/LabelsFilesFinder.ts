import { IMetadataFilesFinder } from "./IMetadataFilesFinder";
import { findFilesWithExtension } from "../utils/filesUtils";

export class LabelsFilesFinder implements IMetadataFilesFinder {
	async findFiles(): Promise<string[]> {
		return findFilesWithExtension(".labels-meta.xml");
	}
}
