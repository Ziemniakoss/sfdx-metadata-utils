import {SfdxCommand, flags} from "@salesforce/command";
import {AnyJson} from "@salesforce/ts-types";
import {XmlUtils} from "../../../utils/XmlUtils";

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
		const {path} = this.flags;
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
			.readXmlFromFile(filePath)
			.then((xmlString) =>
				this.xmlUtils.convertXmlStringToJson(xmlString)
			)
			.then((rawCustomLabels) => {
				rawCustomLabels.CustomLabels.labels =
					rawCustomLabels.CustomLabels.labels.sort((a, b) => {
						const fullNameA = a.fullName[0].toLowerCase();
						const fullNameB = b.fullName[0].toLowerCase();
						if (fullNameA == fullNameB) {
							return 0;
						} else if (fullNameA > fullNameB) {
							return 1;
						} else {
							return -1;
						}
					});
				return rawCustomLabels;
			})
			.then((sortedRawCustomLabels) => {
				return this.xmlUtils.writeJsonAsXml(
					sortedRawCustomLabels,
					filePath
				);
			})
			.then(() => null);
	}
}
