export class Result {
    constructor(isSuccess, data, error) {
        this.isSuccess = isSuccess;
        this.data = data;
        this.error = error;
    }

    static success(data) {
        return new Result(true, data, null);
    }

    static failure(error) {
        return new Result(false, null, error);
    }
}