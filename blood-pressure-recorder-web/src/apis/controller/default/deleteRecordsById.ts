import request, { type AxiosRequestConfig } from "axios";
import { type DeepRequired } from "../../interface";

export interface DeleteRecordsByIdResult {
}

/**
 * 删除血压记录
 * /records/{id}
 */
export function deleteRecordsById(params: DeleteRecordsByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<DeleteRecordsByIdResult>>(`/records/${params.id}`, config);
}

export interface DeleteRecordsByIdParams {
    id: string;
}
