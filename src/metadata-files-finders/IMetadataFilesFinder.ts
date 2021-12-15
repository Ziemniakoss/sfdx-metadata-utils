export interface IMetadataFilesFinder {
	findFiles(): Promise<string[]>
}
