import { utils } from 'seid';
import {constants} from '@/utils';

const { request } = utils;

const { NOTIFY_SERVER_PATH, } = constants;

export async function save(data) {
  const url = `${NOTIFY_SERVER_PATH}/bulletin/saveBulletin`;
  return request({
    url,
    method: "POST",
    data,
  });
}

export async function del(data) {
  const url = `${NOTIFY_SERVER_PATH}/bulletin/deleteBulletin`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 查看通告信息 */
export async function view(ids) {
  const url = `${NOTIFY_SERVER_PATH}/bulletin/getBulletin?id=${ids[0]}`;
  return request({
    url,
    method: "GET",
  });
}

/** 发布通告信息 */
export async function release(data) {
  const url = `${NOTIFY_SERVER_PATH}/bulletin/releaseBulletin`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 撤销通告信息 */
export async function cancel(data) {
  const url = `${NOTIFY_SERVER_PATH}/bulletin/cancelBulletin`;
  return request({
    url,
    method: "POST",
    data,
  });
}
