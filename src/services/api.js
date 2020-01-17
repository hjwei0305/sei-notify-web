import  constants  from "@/utils/constants";
import { utils } from 'seid';

const {request} = utils;
const {SERVER_PATH, BASIC_PATH}  = constants;

/** 获取功能及访问权限*/
export async function getAuthorization(params) {
  const url = `${SERVER_PATH}/auth-service/userAuth/checkAuth`;
  return request({
    url,
    method: "POST",
    data: params,
  });
}
//新的登录方法  BASIC_PATH
export async function loginNew(params) {
  const url = `${BASIC_PATH}/sei-auth/auth/login`;
  params.data.id = "1234";
  if (!Object.keys(params.data).includes("tenantCode")) {
    params.data.tenantCode = "";
  }
  return request({
    url,
    method: "POST",
    data: params.data,
    headers:{needToken:false}
  });
}
/** 登录*/
export async function login(params) {
  const url = `${SERVER_PATH}/auth-service/userAuth/login`;
  params.data.appId = "1234";
  if (!Object.keys(params.data).includes("tenantCode")) {
    params.data.tenantCode = "";
  }
  return request({
    url,
    method: "POST",
    params: params.data
  });
}

/** 退出*/
export async function logout() {
  const url = `${SERVER_PATH}/auth-service/userAuth/logout`;
  return request({
    url,
    method: "POST"
  });
}

