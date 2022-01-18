import { equal } from "assert";
import {LabelsFilesFinder} from "../../src/metadata-files-finders/LabelsFilesFinder";

describe("LabelsFilesFinder", () => {
	it("should return 1", () => {
		return new LabelsFilesFinder()
			.findFiles()
			.then((foundFiles) => equal(foundFiles.length, 1));
	});
});
