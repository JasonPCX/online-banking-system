import { getReasonPhrase } from 'http-status-codes';

export class HttpError extends Error {
    constructor(status, title, message, instance, context) {
        super(message);
        this.name = 'HttpError';
        this.title = title ?? getReasonPhrase(status);
        this.status = status;
        this.instance = instance;
        this.context = context;
    }

    toProblemDetails() {
        return {
            title: this.title,
            message: this.message,
            instance: this.instance,
            context: this.context,
        }
    }
}