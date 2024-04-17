import request, { type AxiosRequestConfig } from "axios";
import { type DeepRequired } from "../../interface";

export interface PostRecordsResult {
}

/**
 * 新增血压记录
 * /records
 */
export function postRecords(input?: PostRecordsInput, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<PostRecordsResult>>(`/records`, input, config);
}

export interface PostRecordsInput {
    high: number;
    low: number;
    heartRate: number;
    remark?: string;
    location: string;
}
