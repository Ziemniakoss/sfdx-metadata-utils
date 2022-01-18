import {
	extractFileName,
	findFilesWithExtension,
	findFilesWithName,
} from "./filesUtils";
import { prompt } from "inquirer";
import { ProfilesFilesFinder } from "../metadata-files-finders/ProfilesFilesFinder";
import { Messages, SfdxError } from "@salesforce/core";
import { CustomObjectFilesFinder } from "../metadata-files-finders/CustomObjectFilesFinder";
import { FILE_EXTENSION as SOBJECT_FILE_EXTENSION } from "../metadata-types/CustomObject";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages("sfdx-metadata-utils", "prompts");

export async function promptForApexClassName(): Promise<string> {
	const choices = await findFilesWithExtension("cls").then((apexFiles) => {
		apexFiles.sort();
		return apexFiles.map((apexFile) => {
			return {
				value: extractFileName(apexFile),
			};
		});
	});
	const selectedApexClass = await prompt([
		{
			type: "list",
			name: "class",
			choices,
		},
	]);
	return selectedApexClass.class;
}

export async function promptForSObjectName(): Promise<string> {
	const sObjectChoices = await new CustomObjectFilesFinder()
		.findFiles()
		.then((files) =>
			files.map((file) => extractFileName(file, SOBJECT_FILE_EXTENSION))
		);
	const selectedSObject = await prompt([
		{
			type: "list",
			name: "sObject",
			choices: sObjectChoices,
		},
	]);
	return selectedSObject.sObject;
}

export async function promptForProfileFile(
	preselected: string
): Promise<string> {
	if (preselected != null) {
		const fileForProfile = await findFilesWithName(
			preselected,
			"profile-meta.xml"
		);
		if (fileForProfile.length == 0) {
			throw new SfdxError(
				messages.getMessage("profileFile:doesntExist"),
				null,
				[
					messages.getMessage("profileFile:createProfile"),
					messages.getMessage("profileFile:fetchFromOrg"),
				]
			);
		} else if (fileForProfile.length != 1) {
			throw new SfdxError(
				messages.getMessage("profileFile:multipleFiles")
			);
		}
		return fileForProfile[0];
	}
	const profiles = await new ProfilesFilesFinder().findFiles();
	const profileChoices = profiles.map((profileName) => {
		return {
			name: extractFileName(profileName, "profile-meta.xml"),
			value: profileName,
		};
	});
	const selectedProfileData = await prompt([
		{
			type: "list",
			name: "profile",
			choices: profileChoices,
		},
	]);
	return selectedProfileData.profile;
}
