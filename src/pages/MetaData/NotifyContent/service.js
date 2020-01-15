import { utils } from 'seid';
import {constants} from '../../../utils';

const { request } = utils;

const { LOCAL_PATH } = constants;

/** 获取计量单位列表*/
export async function getList(params) {
  const url = `${LOCAL_PATH}/content/findAll`;
  return request({
    url,
    method: "GET",
    data: params
  });
}

/** 计量单位保存 */
export async function save(params) {
  const url = `${LOCAL_PATH}/service/unit/save`;
  return request({
    url,
    method: "POST",
    data: { ...params.data }
  });
}

/** 计量单位删除 */
export async function del(params) {
  const url = `${LOCAL_PATH}/service/unit/delete`;
  return request({
    url,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    data: params.id
  });
}
