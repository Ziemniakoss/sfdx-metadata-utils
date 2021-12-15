import { SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";

export default class ListSupportedMetadata extends SfdxCommand {
	private static SUPPORTED_TYPES = ["CustomLabels"];

	public async run(): Promise<AnyJson> {
		ListSupportedMetadata.SUPPORTED_TYPES.forEach(type => console.log(type));
		return ListSupportedMetadata.SUPPORTED_TYPES;
	}
}
