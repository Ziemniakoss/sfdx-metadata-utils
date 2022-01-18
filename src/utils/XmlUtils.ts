import { promises as fs } from "fs";

import { Parser, Builder } from "xml2js";

/**
 * Boolean from parsed xml.
 *
 * Why? Because xml2Js does not parse boolean values to boolean type.
 */
export type XmlBoolean = "true" | "false" | boolean;

export class XmlUtils {
	parser = new Parser({
		trim: true,
	});

	async convertXmlStringToJson(xmlString: string): Promise<any> {
		return this.parser.parseStringPromise(xmlString);
	}

	async readXmlStringFromFile(filePath: string): Promise<string> {
		return fs.readFile(filePath, "utf-8");
	}

	async readXmlFromFile<T>(filePath: string): Promise<T> {
		return this.readXmlStringFromFile(filePath).then((xmlString) =>
			this.convertXmlStringToJson(xmlString)
		);
	}

	async writeJsonAsXml(json: any, filePath: string): Promise<void> {
		const builder = new Builder({
			renderOpts: {
				pretty: true,
				indent: "    ",
				newline: "\n",
			},
		});
		let xml = builder.buildObject(json);
		// xml-js does not allow to specify if we want standalone in xml definition
		const splitedXml = xml.split("\n");
		splitedXml[0] = `<?xml version="1.0" encoding="UTF-8" ?>`;
		xml = splitedXml.join("\n") + "\n";
		return fs.writeFile(filePath, xml);
	}
}
