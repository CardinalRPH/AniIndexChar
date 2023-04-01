export default class ErrorHandler extends Error {
    constructor(message = "") {
        super(message);
        this.name = "Ani Index Error on :";
    }
}