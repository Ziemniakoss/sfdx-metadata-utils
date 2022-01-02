import { SfdxCommand, flags } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import { LabelsFilesFinder } from "../../../metadata-files-finders/LabelsFilesFinder";
import { CustomLabel } from "../../../metadata-types/CustomLabel";
import { XmlUtils } from "../../../utils/XmlUtils";
import { exists } from "@oclif/config/lib/util";

export default class AddLabel extends SfdxCommand {
	public static flagsConfig = {
		path: flags.string({
			description:
				"path for label, can be existing label. If not specified, first existing file will be chosen",
			char: "p",
		}),
		name: flags.string({
			description: "Name for new label",
			char: "n",
		}),
		categories: flags.string({
			description: "Categories for new label separated with comma",
			char: "c",
		}),
		protected: flags.boolean({
			description: "Mark this label as protected",
		}),
		"short-description": flags.string({
			description:
				"Short description for label. Could contain localization in GUI",
			char: "s",
		}),
		value: flags.string({
			description: "value of label",
		}),
		language: flags.string({
			description: "language of this label",
			char: "l",
		}),
	};

	public async run(): Promise<AnyJson> {
		const path = await this.getFileNameForLabel();
		const label = await this.getNewLabelData();
		const rawLabels = await this.readXmlLabelsFromFile(path);
		rawLabels.CustomLabels.labels.push(label);
		await new XmlUtils().writeJsonAsXml(rawLabels, path);
		this.ux.log(
			"Added, you should run metadata-utils:labels:sort to sort labels"
		);
		return null;
	}

	private async readXmlLabelsFromFile(fileName): Promise<any> {
		if (!(await exists(fileName))) {
			return {
				$: {
					xmlns: `http://soap.sforce.com/2006/04/metadata`,
				},
				labels: [],
			};
		}
		const xmlUtils = new XmlUtils();
		return xmlUtils
			.readXmlStringFromFile(fileName)
			.then((xmlString) => xmlUtils.convertXmlStringToJson(xmlString));
	}

	private async getNewFileName(): Promise<string> {
		while (true) {
			const fileName = await this.ux.prompt("New file name", {
				required: true,
			});
			if (!fileName.endsWith(".labels-meta.xml")) {
				this.ux.warn(
					`This file name does not have "labels-meta.xml" extension`
				);
				const confirmation = await this.ux.confirm(`continue? y/n`);
				if (confirmation) {
					return fileName;
				}
			} else {
				return fileName;
			}
		}
	}

	private async getFileNameForLabel(): Promise<string> {
		if (this.flags.path != null) {
			return this.flags.path;
		}
		const existingFiles = await new LabelsFilesFinder().findFiles();
		if (existingFiles.length == 0) {
			return await this.getNewFileName();
		}
		this.ux.log(
			"Multiple files found, please select which file should contain new label"
		);
		const options = [
			{
				option: 0,
				fileName: "Create new file",
			},
			...existingFiles.map((fileName, index) => {
				return {
					option: index + 1,
					fileName,
				};
			}),
		];
		this.ux.table(options, {
			columns: [
				{
					label: "Option number",
					key: "option",
				},
				{
					label: "Name of file",
					key: "fileName",
				},
			],
		});
		let selectedOption = -1;
		while (true) {
			const answer = await this.ux.prompt("What path", {
				required: true,
			});
			const answerAsInt = parseInt(answer);
			if (
				!isNaN(answerAsInt) &&
				answerAsInt >= 0 &&
				answerAsInt <= existingFiles.length
			) {
				selectedOption = answerAsInt;
				break;
			}
		}
		if (selectedOption == 0) {
			return await this.getNewFileName();
		}
		return existingFiles[selectedOption - 1];
	}

	private async getNewLabelData(): Promise<CustomLabel> {
		let fullName = this.flags.name;
		let value = this.flags.value;
		let isProtected = this.flags.protected;
		let shortDescription = this.flags.shortDescription;
		let language = this.flags.language;
		if (fullName == null) {
			fullName = await this.ux.prompt("Name of label", {
				required: true,
			});
		}
		if (value == null) {
			value = await this.ux.prompt("Value", { required: true });
		}
		if (isProtected == null) {
			while (true) {
				const answer = await this.ux.prompt("Is Protected y/n", {
					default: "n",
				});
				if (answer == "y") {
					isProtected = true;
					break;
				} else if (answer == "n") {
					isProtected = false;
					break;
				}
			}
		}
		if (shortDescription == null) {
			shortDescription = await this.ux.prompt("Short description", {
				required: true,
			});
		}
		if (language == null) {
			language = await this.ux.prompt("Language", { default: "en_US" });
		}
		return {
			fullName,
			shortDescription,
			language,
			value,
			protected: isProtected,
		};
	}
}
