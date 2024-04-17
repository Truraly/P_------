import request, { type AxiosRequestConfig } from "axios";
import { type DeepRequired } from "../../interface";

export interface PutRecordsByTimestampResult {
}

/**
 *  修改血压记录
 * /records/{timestamp}
 */
export function putRecordsByTimestamp(params: PutRecordsByTimestampParams, input?: PutRecordsByTimestampInput, config?: AxiosRequestConfig) {
    return request.put<DeepRequired<PutRecordsByTimestampResult>>(`/records/${params.timestamp}`, input, config);
}

export interface PutRecordsByTimestampParams {
    timestamp: string;
}

export interface PutRecordsByTimestampInput {
    high: number;
    low: number;
    heartRate: number;
    remark?: string;
    location: string;
}
