import { SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";

export default class ListSupportedMetadata extends SfdxCommand {
	private static SUPPORTED_TYPES = [
		"CustomLabels",
		"Profile:apexAccess"
	];

	public async run(): Promise<AnyJson> {
		for(const supportedType of ListSupportedMetadata.SUPPORTED_TYPES) {
			console.log(supportedType)
		}
		return ListSupportedMetadata.SUPPORTED_TYPES;
	}
}
