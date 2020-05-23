/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-23 07:59:51
*/
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { NOTIFY_SERVER_PATH, } = constants;
const contextPath = '/group';

/** 保存父表格数据 */
export async function saveParent(data) {
  const url = `${NOTIFY_SERVER_PATH}${contextPath}/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}


/** 保存字表行数据 */
export async function saveChild(data) {
  const url = `${NOTIFY_SERVER_PATH}${contextPath}/addGroupUser`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 删除父亲表格数据 */
export async function delParentRow(params) {
  const url = `${NOTIFY_SERVER_PATH}${contextPath}/delete/${params.id}`;
  return request({
    url,
    method: "DELETE",
  });
}

/** 删除字表格数据 */
export async function delChildRow(params) {
  const url = `${NOTIFY_SERVER_PATH}${contextPath}/removeGroupUser`;
  return request({
    url,
    method: "POST",
    data: params.ids,
  });
}


