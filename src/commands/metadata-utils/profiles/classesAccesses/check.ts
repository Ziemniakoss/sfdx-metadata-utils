import { SfdxCommand } from "@salesforce/command";
import { XmlUtils } from "../../../../utils/XmlUtils";
import { RawProfile } from "../../../../metadata-types/Profile";
import {
	promptForApexClassName,
	promptForProfileFile,
} from "../../../../utils/prompts";

export default class SetApexClassAccess extends SfdxCommand {
	public static description = "Show current access to class for this profile";

	public async run(): Promise<
		"granted" | "denied" | "not defined" | "unknown"
	> {
		const profilePath = await promptForProfileFile();
		const className = await promptForApexClassName();

		const xmlUtils = new XmlUtils();
		const rawProfile = await xmlUtils.readXmlFromFile<RawProfile>(
			profilePath
		);
		const currentAccessForClass = rawProfile.Profile?.classAccesses?.find(
			(classAccess) => classAccess.apexClass[0] == className
		);
		if (currentAccessForClass == null) {
			this.ux.log(`Access is undefined (default false)`);
			return "not defined";
		}
		const access = currentAccessForClass.enabled[0];
		if (access == "true") {
			this.ux.log("Access is granted");
			return "granted";
		} else if (access == "false") {
			this.ux.log("Access is denied");
			return "denied";
		} else {
			this.ux.error(`Unknown value in enabled field: ${access}`);
			return "unknown";
		}
	}
}
