import { SfdxCommand, flags } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import { XmlUtils } from "../../../utils/XmlUtils";
import {compareByField} from "../../../utils/comparators";
import {sortObjectPropertiesAlphabetically} from "../../../utils/objectSorters";

export default class SortLabels extends SfdxCommand {
	public static description = "Sort custom labels file";
	protected static flagsConfig = {
		path: flags.string({
			char: "p",
			description: "file containing labels to sort",
		}),
	};

	private xmlUtils = new XmlUtils();

	public async run(): Promise<AnyJson> {
		const { path } = this.flags;
		if (path) {
			return this.sortFile(path);
		} else {
			const message = "Specify file";
			this.ux.error(message);
			return Promise.reject(message);
		}
	}

	private async sortFile(filePath): Promise<AnyJson> {
		this.ux.log("Sorting " + filePath);

		return this.xmlUtils
			.readXmlStringFromFile(filePath)
			.then((xmlString) =>
				this.xmlUtils.convertXmlStringToJson(xmlString)
			)
			.then((rawCustomLabels) => {
					rawCustomLabels.CustomLabels.labels.sort((a, b) => compareByField(a, b, "fullName"));
				return rawCustomLabels;
			})
			.then((sortedRawCustomLabels) => {
				sortedRawCustomLabels.CustomLabels.labels =
					sortedRawCustomLabels.CustomLabels.labels.map((label) => {
						return sortObjectPropertiesAlphabetically(label)
					});
				return sortedRawCustomLabels;
			})
			.then((rawLabelsWithSortedProperties) => {
				return this.xmlUtils.writeJsonAsXml(
					rawLabelsWithSortedProperties,
					filePath
				);
			})
			.then(() => null);
	}
}
