import { utils } from 'seid';
import {constants} from '../../../utils';

const { request } = utils;

const { LOCAL_PATH, BASIC_PATH } = constants;
//本地线上数据切换
const useMocker = true;

/** 获取列表*/
export async function getList(params) {
  const url = useMocker?`${LOCAL_PATH}/notify-service/bulletin/findByPage`:
    `${BASIC_PATH}/sei-notify/bulletinMsg/findBulletinByPage4User`;
  // const url = `${LOCAL_PATH}/notify-service/bulletin/findByPage`;
  return request({
    url,
    method: "POST",
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
