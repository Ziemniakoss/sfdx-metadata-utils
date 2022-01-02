import { promises as fsPromises, lstatSync } from "fs";

import { sep } from "path";

export async function findFilesWithExtension(
	extension: string,
	basePath?: string
): Promise<string[]> {
	if (basePath == null) {
		basePath = ".";
	}
	const filesAndDirs = await fsPromises.readdir(basePath);
	const files = [];
	for (const fileOrDir of filesAndDirs) {
		const fullPath = `${basePath}${sep}${fileOrDir}`;
		const fileStats = lstatSync(fullPath);
		if (fileStats.isDirectory()) {
			const filesInRecursiveDir = await findFilesWithExtension(
				extension,
				`${basePath}${sep}${fileOrDir}`
			);
			files.push(...filesInRecursiveDir);
		} else if (fileStats.isFile() && fileOrDir.endsWith(extension)) {
			files.push(fullPath);
		}
	}
	return Promise.resolve(files);
}

/**
 * Extract file name from file path
 * @param filePath full file path
 * @param extensionName Override extension detection by providing custom extension name.
 * Usefull for extensions containing multiple dots, like "profile-meta.xml"
 */
export function extractFileName(
	filePath: string,
	extensionName?: string
): string {
	const fullFileName = filePath.includes(sep)
		? filePath.substring(filePath.lastIndexOf(sep) + 1)
		: filePath;
	let lastIndex = fullFileName.length;
	if (extensionName != null) {
		const extensionNameStart = fullFileName.lastIndexOf(
			`.${extensionName}`
		);
		if (extensionNameStart != -1) {
			lastIndex = extensionNameStart;
		}
	} else {
		const lastIndexOfDot = fullFileName.lastIndexOf(".");
		if (lastIndexOfDot > 0) {
			lastIndex = lastIndexOfDot;
		}
	}
	return fullFileName.substring(0, lastIndex);
}
