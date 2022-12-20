import { IValidationErrors } from '../interfaces/validation-errors';

export class ValidationErrors implements IValidationErrors {
	[property: number]: IValidationErrors | string[];
	[property: string]: IValidationErrors | string[];
}
