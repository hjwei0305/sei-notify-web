import { del, getList, save } from "./service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'seid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: "bulletin",

  state: {
    list: [],
    rowData: null,
    showModal: false
  },
  effects: {
    * queryList({ payload }, { call, put }) {
      const ds = yield call(getList, payload);
      if (ds.success) {
        yield put({
          type: "updateState",
          payload: {
            list: ds.data
          }
        });
      } else {
        throw ds;
      }
    },
    * save({ payload, callback }, { call }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.save-success", defaultMessage: "保存成功" }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * del({ payload, callback }, { call }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.delete-success", defaultMessage: "删除成功" }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    }
  }
});
