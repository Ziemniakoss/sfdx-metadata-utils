import { promises as fsPromises, lstatSync } from "fs";

const path = require("path");


export async function findFilesWithExtension(extension: string, basePath?: string): Promise<string[]> {
	if (basePath == null) {
		basePath = ".";
	}
	const filesAndDirs = await fsPromises.readdir(basePath);
	const files = [];
	for(const fileOrDir of filesAndDirs) {
		const fullPath = `${basePath}${path.sep}${fileOrDir}`
		const fileStats = lstatSync(fullPath);
		if(fileStats.isDirectory()) {
			const filesInRecursiveDir = await findFilesWithExtension(extension, `${basePath}${path.sep}${fileOrDir}`)
			files.push(...filesInRecursiveDir)
		} else if(fileStats.isFile() && fileOrDir.endsWith(extension)){
			files.push(fullPath)
		}
	}
	return Promise.resolve(files);
}
