import { SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import { XmlUtils } from "../../../utils/XmlUtils";
import { LabelsFilesFinder } from "../../../metadata-files-finders/LabelsFilesFinder";
import { SfdxError } from "@salesforce/core";

export default class VerifyLabels extends SfdxCommand {
	public static description =
		"Check if custom labels file does not contain duplicates";

	private xmlUtils = new XmlUtils();

	public async run(): Promise<AnyJson> {
		return this.verifyAllFiles();
	}

	async verifyAllFiles(): Promise<AnyJson> {
		const files = await new LabelsFilesFinder().findFiles();
		const labelsOccurrencesMap = new Map<string, LabelOccurrence>();
		for (const fileName of files) {
			const dirtyLabelsXml = await this.xmlUtils
				.readXmlStringFromFile(fileName)
				.then((xmlString) =>
					this.xmlUtils.convertXmlStringToJson(xmlString)
				);
			for (const label of dirtyLabelsXml.CustomLabels.labels ?? []) {
				const labelFullName = label.fullName[0];

				let labelOccurrences = labelsOccurrencesMap.get(labelFullName);
				if (labelOccurrences == null) {
					labelOccurrences = new LabelOccurrence(labelFullName);
					labelsOccurrencesMap.set(labelFullName, labelOccurrences);
				}
				labelOccurrences.addOccurrence(fileName);
			}
		}
		const errors = [];
		for (const labelOccurrence of labelsOccurrencesMap.values()) {
			if (labelOccurrence.totalOccurrences > 1) {
				for (const fileWithLabel of labelOccurrence.filesWithThisLabel) {
					const message = `Duplicates of label ${
						labelOccurrence.fullName
					} found in files: ${[
						...labelOccurrence.filesWithThisLabel.values(),
					].join(",")}`;
					errors.push({
						fileName: fileWithLabel,
						label: labelOccurrence.fullName,
						message,
					});
					this.ux.error(message);
				}
			}
		}
		if (errors.length > 0) {
			//TODO better error handling
			throw new SfdxError(
				"Validation failed",
				"VALIDATION_FAILED",
				errors
			);
		} else {
			return {};
		}
	}
}

class LabelOccurrence {
	fullName: string;

	_totalOccurrences = 0;

	get totalOccurrences() {
		return this._totalOccurrences;
	}

	filesWithThisLabel = new Set<string>();

	constructor(fullName) {
		this.fullName = fullName;
	}

	addOccurrence(fileName) {
		this._totalOccurrences++;
		this.filesWithThisLabel.add(fileName);
	}
}
