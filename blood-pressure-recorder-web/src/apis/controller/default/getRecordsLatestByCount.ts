import request, { type AxiosRequestConfig } from "axios";
import { type DeepRequired } from "../../interface";

export interface GetRecordsLatestByCountResult {
}

/**
 * 获取前x条血压记录
 * /records/latest/{count}
 */
export function getRecordsLatestByCount(params: GetRecordsLatestByCountParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<GetRecordsLatestByCountResult>>(`/records/latest/${params.count}`, config);
}

export interface GetRecordsLatestByCountParams {
    count: number;
}
