import { Metadata } from "./Metadata";

export interface CustomLabel extends Metadata {
	value: string;
	language: string;
	protected: string;
	shortDescription: string;
}
