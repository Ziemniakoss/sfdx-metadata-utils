import { SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { flags } from "@oclif/command";
import {
	promptForProfileFile,
	promptForSObjectName,
} from "../../../../utils/prompts";
import { XmlUtils } from "../../../../utils/XmlUtils";
import {
	Profile,
	ProfileObjectPermissions,
} from "../../../../metadata-types/Profile";
import { prompt } from "inquirer";
import ProfileFormatter from "../../../../formatters/ProfileFormatter";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages(
	"sfdx-metadata-utils",
	"profiles_objectPermissions_set"
);

// @ts-ignore
export class SetObjectAccess extends SfdxCommand {
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

	private xmlUtils = new XmlUtils();
	private profilesFormatter = new ProfileFormatter();

	public async run(): Promise<unknown> {
		const profilePath = await promptForProfileFile(this.flags.profile);
		const sObjectName = this.flags.class ?? (await promptForSObjectName());
		const accessType = await this.promptForAccessType(sObjectName);
		console.log(accessType);

		const profileFromFile = await this.xmlUtils.readXmlFromFile<Profile>(
			profilePath
		);
		if (profileFromFile.Profile.objectPermissions == null) {
			profileFromFile.Profile.objectPermissions = [accessType];
		} else {
			profileFromFile.Profile.objectPermissions =
				profileFromFile.Profile.objectPermissions.filter(
					(perm) => perm.object != sObjectName
				);
			profileFromFile.Profile.objectPermissions.push(accessType);
		}

		this.profilesFormatter.formatMetadata(profileFromFile);

		await this.xmlUtils.writeJsonAsXml(profileFromFile, profilePath);

		return accessType;
	}

	/**
	 * @private
	 * @return Error message if some error was detected
	 */
	private validateOptions(answers: string[]): string | boolean {
		if (
			answers.includes("viewAllRecords") &&
			!answers.includes("allowRead")
		) {
			return messages.getMessage("errors:readAllRequiresRead");
		}
		if (
			answers.includes("modifyAllRecords") &&
			!answers.includes("allowEdit")
		) {
			return messages.getMessage("errors:modifyAllRequiresEdit");
		}
		if (answers.includes("allowDelete") && !answers.includes("allowEdit")) {
			return messages.getMessage("errors:deleteRequiresEdit");
		}
		if (answers.includes("allowEdit") && !answers.includes("allowRead")) {
			return messages.getMessage("errors:editRequiresRead");
		}
		if (answers.includes("allowCreate") && !answers.includes("allowRead")) {
			return messages.getMessage("errors:createRequiresRead");
		}
		return true;
	}

	public async promptForAccessType(
		sObjectName: string
	): Promise<ProfileObjectPermissions> {
		const answers = await prompt([
			{
				type: "checkbox",
				name: "perms",
				message: messages.getMessage("accessType:prompt"),
				choices: [
					{
						name: messages.getMessage("accessType:create"),
						value: "allowCreate",
					},
					{
						name: messages.getMessage("accessType:delete"),
						value: "allowDelete",
					},
					{
						name: messages.getMessage("accessType:edit"),
						value: "allowEdit",
					},
					{
						name: messages.getMessage("accessType:edit-all"),
						value: "modifyAllRecords",
					},
					{
						name: messages.getMessage("accessType:read"),
						value: "allowRead",
					},
					{
						name: messages.getMessage("accessType:read-all"),
						value: "viewAllRecords",
					},
				],
				validate: this.validateOptions,
			},
		]);
		const permissions: ProfileObjectPermissions = {
			object: [sObjectName],
			allowDelete: [false],
			allowEdit: [false],
			allowCreate: [false],
			viewAllRecords: [false],
			modifyAllRecords: [false],
			allowRead: [false],
		};
		for (const selectedPermission of answers.perms) {
			permissions[selectedPermission] = [true];
		}
		return permissions;
	}
}
