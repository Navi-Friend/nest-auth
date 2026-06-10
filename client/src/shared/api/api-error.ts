import type { AxiosError } from "axios";

export class ApiError extends Error {
    public statusCode: number;
    public error: string;
    public responseMessage: string[];

    constructor(error: AxiosError) {
        super("An error occurred when requesting the server");
        this.name = "ApiError";

        if (error.response?.data) {
            const data = error.response.data as any;

            this.statusCode = data.statusCode || error.response.status;
            this.error = data?.error || error.response.statusText;
            this.responseMessage = Array.isArray(data.message)
                ? data.message
                : [data.message];
        } else {
            this.statusCode = error.response?.status || 500;
            this.responseMessage = ["Connection with server lost"];
            this.error = "Internal server error";
        }
    }
}
