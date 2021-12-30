import {Metadata} from "./Metadata";

export class Profile extends Metadata{
	classAccesses?: ProfileApexClassAccess[]
	tabVisibilities?: ProfileTabVisibility[]
	recordTypeVisibilities?: ProfileRecordTypeVisibility[]
	fieldPermissions?: ProfileFieldLevelSecurity[]
	objectPermissions?: ProfileObjectPermissions[]
}

class ProfileApexClassAccess {
	apexClass: string
	enabled: boolean
}

class ProfileObjectPermissions {
	allowCreate: boolean
	allowDelete: boolean
	allowEdit: boolean
	allowRead: boolean
	modifyAllRecords: boolean
	object: string
	viewAllRecords: boolean
}


class ProfileTabVisibility {
	tab: string
	visibility: "DefaultOff" | "DefaultOn" | "Hidden"
}

class ProfileRecordTypeVisibility{
	default: boolean = false
	personAccountDefault?: boolean
	recordType: string
	visible: boolean
}

class ProfileFieldLevelSecurity {
	editable: boolean
	field: string
	hidden: boolean
	readable: boolean
}
