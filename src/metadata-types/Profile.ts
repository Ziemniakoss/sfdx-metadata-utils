import { XmlBoolean } from "../utils/XmlUtils";

export interface Profile {
	Profile: {
		classAccesses?: ProfileApexClassAccess[];
		objectPermissions?: ProfileObjectPermissions[];
		description?: [string];
	};
}

class ProfileApexClassAccess {
	apexClass: [string];
	enabled: [XmlBoolean];
}

export class ProfileObjectPermissions {
	allowCreate?: [XmlBoolean];
	allowDelete?: [XmlBoolean];
	allowEdit?: [XmlBoolean];
	allowRead?: [XmlBoolean];
	modifyAllRecords?: [XmlBoolean];
	object?: [string];
	viewAllRecords?: [XmlBoolean];
}
