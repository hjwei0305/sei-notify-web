import {del, findOne, getList, save} from "./service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'suid';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: "notifyContent",

  state: {
    list: [],
    rowData: null,
    showModal: false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp("/metaData/notifyContent", location.pathname)) {
          dispatch({
            type: "queryList"
          });
        }
      });
    }
  },
  effects: {
    * editNotify({payload},{ call, put}){
      const ds = yield call(findOne,payload);
      console.log("fsdafsa",ds);
      if(ds.success){
        yield put({
          type: "updateState",
          payload: {
            showModal: true,
            rowData: ds.data,
          }
        });
      } else {
        throw ds;
      }
    },
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
    }
  }
});
