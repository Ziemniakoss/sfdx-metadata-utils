import { SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";

import { LabelsParser } from "../../../xml-parsers/LabelsParser";

export default class ListLabels extends SfdxCommand {
	public static args = [{ name: "file" }];
	public async run(): Promise<AnyJson> {
		await this.ux.prompt("hello?", {
			default: "Hello",
			type: "hide",
		});
		return new LabelsParser().readAll().then((labels) => {
			labels.forEach((label) => this.ux.log(label.fullName));

			return labels.map((label) => label.fullName);
		});
	}
}
