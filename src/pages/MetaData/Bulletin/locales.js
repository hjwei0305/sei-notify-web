import {getLocale, getLocalesCN, getLocalesUS} from "../../../utils/index";
const bulletinLocales = {
  "editBulletin": {CN:"修改通知内容",US:"修改通知内容"},
  "addBulletin":  {CN:"新建通知内容",US:"新建通知内容"},
  "subject":  {CN:"标题",US:"标题"},
  "subject.required":  {},
  "institution":  {CN:"发布机构",US:"发布机构"},
  "institution.required": {},
  "effectiveDate":  {CN:"有效期间",US:"有效期间"},
  "effectiveDate.required": {},
  "content":  {CN:"通告内容",US:"通告内容"},
  "content.required": {},
  "targetType": {CN:"发布类型",US:"发布类型"},
  "tagName": {CN:"类型值",US:"类型值"},
  "priority": {CN:"优先级",US:"优先级"},
  "releaseDate": {CN:"发布时间",US:"发布时间"},
  "invalidDate": {CN:"截止日期",US:"截止日期"}
};
const moduleName = "bulletin";
export const bulletinLocalesCN = getLocalesCN(moduleName,bulletinLocales);
export const bulletinLocalesUS = getLocalesUS(moduleName,bulletinLocales);
export function getLocales(key,desc) {
  return getLocale(moduleName, key , desc);
}
