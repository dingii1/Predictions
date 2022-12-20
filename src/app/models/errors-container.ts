export class ErrorsContainer {
	general: string[];

	[property: string]: string[];

	constructor() {
		this.general = [];
	}
}