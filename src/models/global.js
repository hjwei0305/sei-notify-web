import router from "umi/router";
import { stringify } from "qs";
import { message } from "antd";
import { getAuthorization, loginNew } from "@/services/api";
import { utils } from "seid";
import constants from "@/utils/constants";

const { storage,constants:appConstants} = utils;
const { CONST_GLOBAL} = appConstants;
const { sessionStorage } = storage;
const { APP_GLOBAL, LOGIN_STATUS } = constants;

export default {
  namespace: "global",
  state: {
    logged: false,
    operateAuthority: [],
    showTenant: false,
    userAuthLoaded: false,
    locationPathName: "/",
    locationQuery: {}
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: "updateState",
          payload: {
            locationPathName: location.pathname,
            locationQuery: location.query
          }
        });
      });
    }
  },
  effects: {
    * getAuthorization({ payload }, { call, put }) {
      const ds = yield call(getAuthorization, payload);
      let logged = false;
      if (ds.success) {
        const authorData = ds.data;
        sessionStorage.set(APP_GLOBAL.CURRENT_USER, authorData[0]);
        sessionStorage.set(APP_GLOBAL.TOKEN, authorData[0].accessToken);
        sessionStorage.set(APP_GLOBAL.POLICY, authorData[0].authorityPolicy);
        sessionStorage.set(APP_GLOBAL.AUTH, authorData[1] || []);
        logged = true;
      } else {
        message.destroy();
        message.error("访问无权限");
        logged = false;
      }
      yield put({
        type: "updateState",
        payload: {
          logged
        }
      });
    },
    * redirectLogin({ payload }, { call, put, select }) {
      const state = yield select(_ => _.global);
      const { locationPathName, locationQuery } = state;
      let location = locationPathName;
      if (location.indexOf("/user/login") !== -1) {
        location = locationQuery.from || "/";
      }
      router.replace({
        pathname: "/user/login",
        search: stringify({
          from: location
        })
      });
    },
    * login({ payload }, { call, put, select }) {
      const state = yield select(_ => _.global);
      const res = yield call(loginNew, payload);
      message.destroy();
      if (res&&res.success) {
        message.success("登录成功");
        sessionStorage.set(APP_GLOBAL.CURRENT_USER, res.data);
        sessionStorage.set(CONST_GLOBAL.TOKEN_KEY, res.data.sessionId);
        const {from} = state.locationQuery;
        if (from && from.indexOf("/user/login") === -1) {
          if (from === "/") {
            router.push("/dashboard");
          }
          else {
            router.push(from);
          }
        } else {
          router.push("/");
        }
      }else{
        message.success("登录失败！");
      }
    }

  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
