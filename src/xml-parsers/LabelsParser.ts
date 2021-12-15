import { CustomLabel } from "../metadata-types/CustomLabel";
import { promises as fs } from "fs";
import { findFilesWithExtension } from "../utils/FilesFineder";
import { XmlUtils } from "../utils/XmlUtils";

export class LabelsParser {
	xmlUtils = new XmlUtils()
	async read(filePath: string): Promise<CustomLabel[]> {
		return fs.readFile(filePath, "utf-8")
			.then(xmlString => this.xmlUtils.convertXmlStringToJson(xmlString))
			.then(rawLabels => {
				return rawLabels.CustomLabels.labels?.map(rawLabel => this.convertRawToLabel(rawLabel));
			});
	}

	async readAll(): Promise<CustomLabel[]> {
		const files = await findFilesWithExtension("labels.xml");
		const labels: CustomLabel[] = [];
		for (const file of files) {
			const labelsInFile = await this.read(file);
			labels.push(...labelsInFile)
		}
		return Promise.resolve(labels)
	}

	convertRawToLabel(rawLabel): CustomLabel {
		return {
			fullName: rawLabel.fullName[0],
			language: rawLabel.language[0],
			protected: rawLabel.protected[0],
			shortDescription: rawLabel.shortDescription[0],
			value: rawLabel.value[0]
		};
	}
}
