import { SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import { prompt } from "inquirer";
import {
	promptForApexClassName,
	promptForProfileFile,
} from "../../../../utils/prompts";
import { XmlUtils } from "../../../../utils/XmlUtils";
import { RawProfile } from "../../../../metadata-types/Profile";
import ProfileFormatter from "../../../../formatters/ProfileFormatter";

export default class SetApexClassAccess extends SfdxCommand {
	public static description = "Set access to apex class for this profile";

	public async run(): Promise<AnyJson> {
		const profilePath = await promptForProfileFile();
		const apexClass = await promptForApexClassName();
		const access = await this.promptForAccessLevel();
		console.log(profilePath, apexClass, access);

		const xmlUtils = new XmlUtils();
		const rawProfile = await xmlUtils.readXmlFromFile<RawProfile>(
			profilePath
		);
		this.setAccess(rawProfile, apexClass, access);

		const formatter = new ProfileFormatter();
		formatter.formatRawMetadata(rawProfile);
		return "";
	}

	private setAccess(
		rawProfile: RawProfile,
		apexClass: string,
		enabled: boolean
	) {
		if (rawProfile.Profile.classAccesses == null) {
			rawProfile.Profile.classAccesses = [];
		} else {
			rawProfile.Profile.classAccesses =
				rawProfile.Profile.classAccesses.filter((access) => {
					return access.apexClass[0] != apexClass;
				});
		}
		rawProfile.Profile.classAccesses.push({
			apexClass: [apexClass],
			enabled: [enabled],
		});
	}

	private async promptForAccessLevel(): Promise<boolean> {
		const answer = await prompt([
			{
				type: "list",
				name: "access",
				choices: [
					{
						name: "enabled",
						value: true,
					},
					{
						name: "disabled",
						value: false,
					},
				],
			},
		]);
		return answer.access;
	}
}
