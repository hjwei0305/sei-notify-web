import { utils } from 'suid';

const { NODE_ENV, MOCK } = process.env;

const { CONST_GLOBAL } = utils.constants;

const getBaseUrl = function () {
  if (NODE_ENV !== 'production') {
    if (MOCK === 'yes') {
      return '/mocker.api'
    } else {
      return '/service.api'
    }
  }
  return GATEWAY_CONTEXTPATH;
}
/** 计量单位功能项*/
const BULLETIN_BTN_KEY = {
  "ADD": "ADD",
  "EDIT": "EDIT",
  "DELETE": "DELETE",
  "VIEW": "VIEW",
  "CANCEL": "CANCEL",
  "RELEASE": "RELEASE",
};

export const PRIORITY_OPT = [{
  label: '高',
  value: 'High',
},{
  label: '紧急',
  value: 'Urgent',
},{
  label: '一般',
  value: 'General',
}];

export const TARGETTYPE_OPT = [{
  label: '组织机构',
  value: 'ORG',
},{
  label: '群组',
  value: 'GROUP',
}]

export { CONST_GLOBAL, BULLETIN_BTN_KEY };

export const AUTH_SERVER_PATH = '/sei-auth';

export const NOTIFY_SERVER_PATH = '/sei-notify';

export const GATEWAY_CONTEXTPATH = '/api-gateway';

export const BASE_URL = getBaseUrl();
