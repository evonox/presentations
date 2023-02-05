
import axios, { AxiosRequestConfig, AxiosResponse, ResponseType } from "axios";

interface ResolveMethod {
    (response: AxiosResponse<any, any>): void;
}

interface RejectMethod {
    (reason?: any): void;
}

interface PendingRequest {
    request: AxiosRequestConfig;
    successMethod: ResolveMethod;
    errorMethod: RejectMethod;
}

export class SynchNetworkService {

    private pendingRequests: PendingRequest[] = [];
    private isEngineRunning = false;

    async get(url: string, responseType?: ResponseType): Promise<AxiosResponse<any, any>> {
        return new Promise<AxiosResponse<any, any>>((resolve, reject) => {
            const request: AxiosRequestConfig = {
                method: "GET",
                url: url,
                responseType
            };
            this.pendingRequests.push({request, successMethod: resolve, errorMethod: reject});
            this.startRequestEngine();
        });
    }

    async post(url: string, data: any, responseType?: ResponseType): Promise<AxiosResponse<any, any>> {
        return new Promise<AxiosResponse<any, any>>((resolve, reject) => {
            const request: AxiosRequestConfig = {
                method: "POST",
                url: url,
                data: data,
                responseType
            };
            this.pendingRequests.push({request, successMethod: resolve, errorMethod: reject});
            this.startRequestEngine();
        });
    }

    async put(url: string, data: any, responseType?: ResponseType): Promise<AxiosResponse<any, any>> {
        return new Promise<AxiosResponse<any, any>>((resolve, reject) => {
            const request: AxiosRequestConfig = {
                method: "PUT",
                url: url,
                data: data,
                responseType
            };
            this.pendingRequests.push({request, successMethod: resolve, errorMethod: reject});
            this.startRequestEngine();
        });
    }

    async patch(url: string, data: any, responseType?: ResponseType): Promise<AxiosResponse<any, any>> {
        return new Promise<AxiosResponse<any, any>>((resolve, reject) => {
            const request: AxiosRequestConfig = {
                method: "PATCH",
                url: url,
                data: data,
                responseType
            };
            this.pendingRequests.push({request, successMethod: resolve, errorMethod: reject});
            this.startRequestEngine();
        });
    }

    async delete(url: string, responseType?: ResponseType): Promise<AxiosResponse<any, any>> {
        return new Promise<AxiosResponse<any, any>>((resolve, reject) => {
            const request: AxiosRequestConfig = {
                method: "DELETE",
                url: url,
                responseType
            };
            this.pendingRequests.push({request, successMethod: resolve, errorMethod: reject});
            this.startRequestEngine();
        });
    }

    private startRequestEngine() {
        if(this.isEngineRunning === false) {
            this.isEngineRunning = true;
            this.processPendingRequests().then(() => {
                this.isEngineRunning = false;
            });
        }
    }

    private async  processPendingRequests() {
        while(this.pendingRequests.length > 0) {
            const pendingRequest = this.pendingRequests.shift();
            if(pendingRequest === undefined)
                return;
            try {
                const response = await axios.request(pendingRequest.request);
                setTimeout(() => {
                    pendingRequest.successMethod(response);
                })
            }
            catch(e) {
                setTimeout(() => {
                    pendingRequest.errorMethod(e);
                })
            }
        }
    }

}