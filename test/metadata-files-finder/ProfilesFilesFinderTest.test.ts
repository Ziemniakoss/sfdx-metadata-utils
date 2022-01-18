import { equal } from "assert";
import { ProfilesFilesFinder } from "../../src/metadata-files-finders/ProfilesFilesFinder";

describe("ProfilesFilesFinder", () => {
	it("should return 1", () => {
		return new ProfilesFilesFinder()
			.findFiles()
			.then((foundFiles) => equal(foundFiles.length, 1));
	});
});
