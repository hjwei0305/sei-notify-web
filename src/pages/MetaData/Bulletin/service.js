import { utils } from 'seid';
import {constants} from '@/utils';

const { request } = utils;

const { NOTIFY_SERVER_PATH, } = constants;

/** 获取列表*/
export async function getList(params) {
  const url = `${NOTIFY_SERVER_PATH}/bulletin/findByPage`;
  return request({
    url,
    method: "POST",
    data: params
  });
}


export async function save(data) {
  const url = `${NOTIFY_SERVER_PATH}/bulletin/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}
