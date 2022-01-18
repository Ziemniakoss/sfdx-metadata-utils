import { SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import { Messages } from "@salesforce/core";
import { flags } from "@oclif/command";
import {
	promptForProfileFile,
	promptForSObjectName,
} from "../../../../utils/prompts";
import { XmlBoolean, XmlUtils } from "../../../../utils/XmlUtils";
import { Profile } from "../../../../metadata-types/Profile";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(
	"sfdx-metadata-utils",
	"profiles_objectPermissions_check"
);

type AccessType = "enabled" | "disabled" | "undeclared";

// @ts-ignore
export class CheckObjectAccess extends SfdxCommand {
	public static description = messages.getMessage("description");
	public static flagsConfig = {
		profile: flags.string({
			char: "p",
			description: messages.getMessage("flag:profile:description"),
		}),
		sobject: flags.string({
			char: "s",
			description: messages.getMessage("flag:sobject:description"),
		}),
	};

	public async run(): Promise<AnyJson> {
		const profilePath =
			this.flags.profile ??
			(await promptForProfileFile(this.flags.profile));
		const sObjectName = this.flags.class ?? (await promptForSObjectName());
		console.log(sObjectName);
		const xmlUtils = new XmlUtils();
		const xmlProfile = await xmlUtils.readXmlFromFile<Profile>(profilePath);
		let sObjectPermissions = xmlProfile.Profile?.objectPermissions?.find(
			(objectPermission) => objectPermission.object[0] == sObjectName
		);
		if (sObjectPermissions == null) {
			sObjectPermissions = {};
		}
		this.ux.log(
			"Creation:",
			this.convertToAccessType(sObjectPermissions.allowCreate)
		);
		this.ux.log(
			"Deletion:",
			this.convertToAccessType(sObjectPermissions.allowDelete)
		);
		this.ux.log(
			"Edition:",
			this.convertToAccessType(sObjectPermissions.allowEdit)
		);
		this.ux.log(
			"Read all:",
			this.convertToAccessType(sObjectPermissions.viewAllRecords)
		);
		this.ux.log(
			"Modify all:",
			this.convertToAccessType(sObjectPermissions.modifyAllRecords)
		);

		return null;
	}

	private convertToAccessType(x: XmlBoolean[]): AccessType {
		if (x == null || x.length == 0) {
			return "undeclared";
		} else if (x[0] == "true") {
			return "enabled";
		} else {
			return "disabled";
		}
	}
}
