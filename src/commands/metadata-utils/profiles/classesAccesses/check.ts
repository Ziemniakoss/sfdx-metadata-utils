import { SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { XmlUtils } from "../../../../utils/XmlUtils";
import {
	promptForApexClassName,
	promptForProfileFile,
} from "../../../../utils/prompts";
import { flags } from "@oclif/command";
import { Profile } from "../../../../metadata-types/Profile";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(
	"sfdx-metadata-utils",
	"profiles_classesAccesses_check"
);

//@ts-ignore
export default class CheckApexClassAccess extends SfdxCommand {
	public static description = messages.getMessage("description"); //"Show current access to class for this profile";

	public static flagsConfig = {
		profile: flags.string({
			char: "p",
			description: messages.getMessage("flag:profile:description"),
		}),
		class: flags.string({
			description: messages.getMessage("flag:class:description"),
			char: "c",
		}),
	};

	public async run(): Promise<
		"granted" | "denied" | "not defined" | "unknown"
	> {
		const profilePath = await promptForProfileFile(this.flags.profile);
		const className = await this.getClassName();

		const xmlUtils = new XmlUtils();
		const rawProfile = await xmlUtils.readXmlFromFile<Profile>(profilePath);
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

	private async getClassName(): Promise<string> {
		if (this.flags.class != null) {
			return this.flags.class;
		}
		return promptForApexClassName();
	}
}
