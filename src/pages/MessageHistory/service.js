/*
* @Author: zp
* @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-12 08:46:38
*/
import { utils } from 'suid';

import { constants, } from '@/utils';

const { request } = utils;

const { NOTIFY_SERVER_PATH, } = constants;

const contextPath = '/messageHistory';

/** 获取一个消息历史 */
export async function getById (params) {
  const url = `${NOTIFY_SERVER_PATH}${contextPath}/findOne`;

  return request({
    url,
    params,
    method: 'GET',
  });
}
