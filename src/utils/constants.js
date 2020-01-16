import { base } from '../../public/app.config.json';

const BASE_DOMAIN = '/';

const GATEWAY = 'mobileapi-gateway';

const APP_BASE = base;

const LOCAL_PATH = process.env.NODE_ENV !== 'production' ? '/mocker.api' : `../${APP_BASE}`;

const SERVER_PATH =
  process.env.NODE_ENV !== 'production' ? '/mocker.api' : `${BASE_DOMAIN}${GATEWAY}`;
/** 计量单位功能项*/
const UNIT_BTN_KEY = {
  "CREATE": "BDM_AM_BTN_ASSET_UNIT_CREATE",
  "EDIT": "BDM_AM_BTN_ASSET_UNIT_EDIT",
  "DELETE": "BDM_AM_BTN_ASSET_UNIT_DELETE"
};
const RICHEDITOR_TOOL = ['undo', 'redo', 'separator','font-size', 'line-height', 'letter-spacing', 'separator','text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator','superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator','headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator','link', 'hr', 'separator', 'separator','clear']
export default {
  APP_BASE,
  LOCAL_PATH,
  SERVER_PATH,
  UNIT_BTN_KEY,
  RICHEDITOR_TOOL
};
