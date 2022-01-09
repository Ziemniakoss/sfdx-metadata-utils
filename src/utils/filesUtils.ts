import { sep } from "path";
import { promiseFiles} from "node-dir"

/**
 * Find all files in directory and its subdirectories with given extension
 * @param extension extension name, for example "cls".
 * <b>Dont include starting dot(".cls")</b>
 * @param basePath base path of search, by default it's pwd
 */
export async function findFilesWithExtension(
	extension: string,
	basePath = "."
): Promise<string[]> {
	if (basePath == null) {
		basePath = ".";
	}
	return promiseFiles(basePath)
		.then(foundAllFiles => foundAllFiles.filter(file => hasExtension(file, extension)))
}

export async function findFilesWithName(fileName:string, extensionName:string,basePath = "."):Promise<string[]> {
	return promiseFiles(basePath)
		.then(allFiles => allFiles.filter(foundFile => {
			return extractFileName(foundFile,extensionName) ==fileName
		}))
}
/**
 * Check if file has given extension.
 * Multipart extensions are accepted (for example "profile-meta.xml")
 * @param path
 * @param extensionName
 */
export function hasExtension(path:string, extensionName:string) :boolean{
	return path.endsWith(extensionName)
}

/**
 * Extract file name from file path
 * @param filePath full file path
 * @param extensionName Override extension detection by providing custom extension name.
 * Useful for extensions containing multiple dots, like "profile-meta.xml"
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
