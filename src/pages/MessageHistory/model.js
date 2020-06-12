/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-06-12 10:31:57
 */
import { message } from 'antd';
import { utils } from 'suid';
import { getById } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'messageHistory',

  state: {
    rowData: null,
    modalVisible: false,
    showViewDetail: false,
  },
  effects: {
    *getById({ payload }, { call }) {
      const result = yield call(getById, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (!success) {
        message.error(msg);
      }

      return result;
    },
  },
});
