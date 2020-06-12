import { utils } from 'suid';
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

/** 查看消息 */
export async function view(ids, category) {
  const url = `${NOTIFY_SERVER_PATH}/message/detail?msgId=${ids[0]}&category=${category}`;
  return request({
    url,
    method: "GET",
  });
}

/** 获取通告信息 */
export async function getBulletin(id) {
  const url = `${NOTIFY_SERVER_PATH}/bulletin/getBulletin?id=${id}`;
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

/** 标记选中消息为已读 */
export async function readSelected(data) {
  const url = `${NOTIFY_SERVER_PATH}/message/readSelected`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 标记选中消息为未读 */
export async function unreadSelected(data) {
  const url = `${NOTIFY_SERVER_PATH}/message/unreadSelected`;
  return request({
    url,
    method: "POST",
    data,
  });
}

