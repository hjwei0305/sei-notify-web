import { utils } from 'seid';
import {constants} from '../../../utils';

const { request } = utils;

const { LOCAL_PATH, BASIC_PATH } = constants;
//本地线上数据切换
const useMocker = false;

/** 获取计量单位列表*/
export async function getList(params) {
  const url = useMocker?`${LOCAL_PATH}/content/findAll`:
    `${BASIC_PATH}/sei-notify/contentTemplate/findAll`;
  return request({
    url,
    method: "GET",
    params: params
  });
}

/** 计量单位保存 */
export async function save(params) {
  const url = useMocker?`${LOCAL_PATH}/service/unit/save`:
    `${BASIC_PATH}/sei-notify/contentTemplate/save`;
  return request({
    url,
    method: "POST",
    data: { ...params.data }
  });
}
//查找这一条消息通知
export async function findOne(params) {
  const url = `${BASIC_PATH}/sei-notify/contentTemplate/findOne`;
  return request({
    url,
    method: "GET",
    params: { ...params }
  });
}
/** 删除 */
export async function del(params) {
  const url = useMocker?`${LOCAL_PATH}/service/unit/delete`:
    `${BASIC_PATH}/sei-notify/contentTemplate/delete`;
  return request({
    url,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    params:{id:params.id}
  });
}
