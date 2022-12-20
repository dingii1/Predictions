export interface IValidationErrors {
	[property: string]: string[] | IValidationErrors;
	[property: number]: string[] | IValidationErrors;
};