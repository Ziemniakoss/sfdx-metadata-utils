import { equal } from "assert";
import * as path from "path";
import {
	extractFileName,
	findFilesWithExtension,
} from "../../src/utils/filesUtils";

describe("filesUtils#extractFileName", () => {
	context("File with extension", () => {
		it(`Should return "testFile"`, () => {
			const result = extractFileName(`testFolder${path.sep}testFile.xml`);
			equal(result, "testFile");
		});
	});
	context("File without extension", () => {
		it("Should return testFileWithoutExtension", () => {
			const filePath = `testDir${path.sep}otherDir${path.sep}testFileWithoutExtension`;
			const result = extractFileName(filePath);
			equal(result, "testFileWithoutExtension");
		});
	});
	context("Custom extension", () => {
		it(`Should return "Sales"`, () => {
			const result = extractFileName(
				"Sales.profile-meta.xml",
				"profile-meta.xml"
			);
			equal(result, "Sales");
		});
	});
});

describe("filesUtils#findFilesWithExtension", () => {
	context("Files with extension exits", () => {
		it("should return 0", () => {
			return findFilesWithExtension("not-existing-extension").then(
				(filesFound) => {
					equal(filesFound.length, 0);
				}
			);
		});
	});
	context("Files with extension dont exist", () => {
		it("should return 4", () => {
			return findFilesWithExtension("existing-extension.xml").then(
				(filesFound) => {
					equal(filesFound.length, 4);
				}
			);
		});
	});
});
