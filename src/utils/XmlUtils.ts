import { promises as fs } from "fs";

const xml2js = require("xml2js");

export class XmlUtils {

	parser = new xml2js.Parser();

	async convertXmlStringToJson(xmlString: string): Promise<any> {
		return this.parser.parseStringPromise(xmlString);
	}

	async readXmlFromFile(filePath: string): Promise<string> {
		return fs.readFile(filePath, "utf-8")
	}

	async writeJsonAsXml(json: any, filePath: string): Promise<null> {
		const builder = new xml2js.Builder({
			renderOpts: {
				pretty: true,
				indent: "    "
			}
		});
		const xml = builder.buildObject(json);
		console.log(xml)
		return Promise.resolve(null)
	}
}
