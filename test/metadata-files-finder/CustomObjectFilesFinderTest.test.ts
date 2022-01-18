import { CustomObjectFilesFinder } from "../../src/metadata-files-finders/CustomObjectFilesFinder";
import { equal } from "assert";

describe("CustomObjectFilesFinder", () => {
	it("should return 3", () => {
		return new CustomObjectFilesFinder()
			.findFiles()
			.then((foundFiles) => equal(foundFiles.length, 3));
	});
});
