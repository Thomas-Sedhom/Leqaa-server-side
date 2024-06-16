export class BadRequestException extends Error {
    status: number;

    constructor(message: string, status: number = 400) {
        super(message);
        this.name = 'BadRequestException';
        this.status = status;
    }
}