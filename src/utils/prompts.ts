import { extractFileName, findFilesWithExtension } from "./filesUtils";
import { prompt } from "inquirer";
import { ProfilesFilesFinder } from "../metadata-files-finders/ProfilesFilesFinder";

export async function promptForApexClassName(): Promise<string> {
	const choices = await findFilesWithExtension(".cls").then((apexFiles) => {
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

export async function promptForProfileFile(): Promise<string> {
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
