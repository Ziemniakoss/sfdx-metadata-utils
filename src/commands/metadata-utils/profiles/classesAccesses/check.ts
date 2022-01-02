import { SfdxCommand, flags } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import {prompt} from "inquirer"
import {ProfilesFilesFinder} from "../../../../metadata-files-finders/ProfilesFilesFinder";
import inquirer = require('inquirer');
import {findFilesWithExtension, extractFileName} from "../../../../utils/filesUtils";
import {XmlUtils} from "../../../../utils/XmlUtils";
import {RawProfile} from "../../../../metadata-types/Profile";

export default class SetApexClassAccess extends SfdxCommand {
	public static description = "Show current access to class for this profile";

	public async run(): Promise<AnyJson> {
		const profilePath = await this.getSelectedProfileName();
		const className = await this.getSelectedClassName();

		const xmlUtils = new XmlUtils();
		const rawProfile = await xmlUtils.readXmlFromFile<RawProfile>(profilePath)
		const currentAccessForClass = rawProfile
			.Profile
			?.classAccesses
			?.find(classAccess => classAccess.apexClass[0] == className);
		if(currentAccessForClass == null) {
			this.ux.log(`Access is undefined (default false)`);
			return undefined;
		}
		const access = currentAccessForClass.enabled[0];
		let result = undefined;
		if(access == "true") {
			result = true;
			this.ux.log("Access is granted");
		} else if(access == "false") {
			result = false
			this.ux.log("Access is denied")
		}
		return result
	}

	private async getSelectedProfileName(): Promise<string> {
		this.ux.startSpinner("Scanning for profiles")
		const profiles = await new ProfilesFilesFinder().findFiles();
		this.ux.stopSpinner()
		const porfileChoices = profiles.map(profileName => {
			return {
				name: extractFileName(profileName, "profile-meta.xml"),
				value: profileName
			}
		})
		const selectedProfileData = await  inquirer.prompt([
			{
				type: "list",
				name: "profile",
				choices: porfileChoices
			}
		])
		return selectedProfileData.profile;
	}


	private async getSelectedClassName(): Promise<string> {
		this.ux.startSpinner("Scanning apex classes")
		const choices = await findFilesWithExtension(".cls")
			.then(apexFiles => {
				apexFiles.sort()
				return apexFiles.map(apexFile => {
					return {
						value: extractFileName(apexFile)
					}
				})
			})
		this.ux.stopSpinner()
		const selectedApexClass = await prompt([
			{
				type: "list",
				name: "class",
				choices
			}
		])
		return selectedApexClass.class
	}
}
