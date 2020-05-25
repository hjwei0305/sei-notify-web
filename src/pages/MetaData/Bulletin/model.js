import { del, save } from "./service";
import * as services from "./service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'suid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: "bulletin",

  state: {
    list: [],
    rowData: null,
    showModal: false,
    showViewDetail: false,
  },
  effects: {
    * save({ payload, }, { call }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.save-success", defaultMessage: "保存成功" }));
      } else {
        message.error(re.message);
      }

      return re;
    },
    * del({ payload, }, { call }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.delete-success", defaultMessage: "删除成功" }));
      } else {
        message.error(re.message);
      }

      return re;
    },
    * bulletinOpt({ payload, }, { call }) {
      const re = yield call(services[payload.optType], payload.ids, payload.msgCategory);
      message.destroy();
      if (!re.success) {
        message.error(re.message);
      }

      return re;
    }
  }
});
