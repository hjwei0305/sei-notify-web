import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;

const { NOTIFY_SERVER_PATH, } = constants;

/** 获取列表*/
export async function getList(params) {
  const url = `${NOTIFY_SERVER_PATH}/contentTemplate/findAll`;
  return request({
    url,
    method: "GET",
    params: params
  });
}

/** 获取列表*/
export async function save(data) {
  const url = `${NOTIFY_SERVER_PATH}/contentTemplate/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

// 查找这一条消息通知
export async function findOne(params) {
  const url = `${NOTIFY_SERVER_PATH}/contentTemplate/findOne`;
  return request({
    url,
    method: "GET",
    params: { ...params }
  });
}
/** 删除 */
export async function del(params) {
  const url = `${NOTIFY_SERVER_PATH}/contentTemplate/delete/${params.id}`;
  return request({
    url,
    method: "DELETE",
  });
}
