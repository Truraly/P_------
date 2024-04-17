import request, { type AxiosRequestConfig } from "axios";
import { type DeepRequired } from "../../interface";

export interface GetRecordsAfterByTimestampResult {
}

/**
 * 获取某timestamp之后的血压记录
 * /records/after/{timestamp}
 */
export function getRecordsAfterByTimestamp(params: GetRecordsAfterByTimestampParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<GetRecordsAfterByTimestampResult>>(`/records/after/${params.timestamp}`, config);
}

export interface GetRecordsAfterByTimestampParams {
    timestamp: number;
}
