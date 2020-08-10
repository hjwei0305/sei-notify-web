/*
* @Author: zp
* @Date:   2020-02-02 11:57:38
 * @Last Modified by: Eason
 * @Last Modified time: 2020-08-10 10:47:20
*/
import {
  delParentRow,
  saveParent,
  saveChild,
  delChildRow,
} from "./service";
import { utils, message } from 'suid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

// semanteme

export default modelExtend(model, {
  namespace: "group",

  state: {
    currPRowData: null,
    currCRowData: null,
    isAddP: false,
    pVisible: false,
    cVisible: false,
  },
  effects: {
    * updatePageState({ payload, }, { put, }) {
      yield put({
        type: "updateState",
        payload,
      });

      return payload;
    },
    * saveChild({ payload }, { call }) {
      const result = yield call(saveChild, payload);
      const { success, message: msg, } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    * saveParent({ payload }, { call }) {
      const result = yield call(saveParent, payload);
      const { success, message: msg, } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    * delPRow({ payload }, { call }) {
      const result = yield call(delParentRow, payload);
      const { message: msg, success, } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    * delCRow({ payload }, { call }) {
      const result = yield call(delChildRow, payload);
      const { message: msg, success, } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
  }
});
