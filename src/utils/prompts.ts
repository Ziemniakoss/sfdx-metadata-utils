import {extractFileName, findFilesWithExtension, findFilesWithName} from "./filesUtils";
import {prompt} from "inquirer";
import {ProfilesFilesFinder} from "../metadata-files-finders/ProfilesFilesFinder";
import {SfdxError} from "@salesforce/core";

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

export async function promptForProfileFile(preselected: string, errorMessages: { fileDoesNotExist: string, multipleFiles: string }): Promise<string> {
	if (preselected != null) {
		const fileForProfile = await findFilesWithName(preselected, "profile-meta.xml")
		if (fileForProfile.length == 0) {
			throw new SfdxError(
				errorMessages.fileDoesNotExist,
				null,
				["create profile", "fetch profile"]
			)
		} else if (fileForProfile.length != 1) {
			throw new SfdxError(errorMessages.multipleFiles)
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
