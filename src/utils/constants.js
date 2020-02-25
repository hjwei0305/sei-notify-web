import { utils } from 'seid';

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
const UNIT_BTN_KEY = {
  "CREATE": "BDM_AM_BTN_ASSET_UNIT_CREATE",
  "EDIT": "BDM_AM_BTN_ASSET_UNIT_EDIT",
  "DELETE": "BDM_AM_BTN_ASSET_UNIT_DELETE"
};

export { CONST_GLOBAL, UNIT_BTN_KEY };

export const AUTH_SERVER_PATH = '/sei-auth';

export const NOTIFY_SERVER_PATH = '/sei-notify';

export const GATEWAY_CONTEXTPATH = '/api-gateway';

export const BASE_URL = getBaseUrl();
