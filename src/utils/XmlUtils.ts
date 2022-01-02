import { promises as fs } from "fs";

const xml2js = require("xml2js");

export class XmlUtils {
	parser = new xml2js.Parser({
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
		const builder = new xml2js.Builder({
			renderOpts: {
				pretty: true,
				indent: "    ",
				newline: "\n",
			},
		});
		const xml = builder.buildObject(json) + "\n";
		return fs.writeFile(filePath, xml);
	}
}
