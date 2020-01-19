import { formatMessage } from "umi-plugin-react/locale";
import {message} from "antd"
import constants from './constants';
//key 值
export  function getLocale(modelueName,key,desc) {
  //配置唯一key值，加上moduleName为前缀
  let localeObj = {};
  key = modelueName + "." + key;
  localeObj.id = key;
  localeObj.defaultMessage = desc;
  return formatMessage(localeObj);
}
function getLocalesCN(moduleName, LocalesObj) {
  let newLocaleObj = {};
  for(let key of Object.keys(LocalesObj)){
    key = moduleName + "." + key;
    newLocaleObj[key] = LocalesObj[key].CN;
    if(!newLocaleObj[key]){
      //自动加上校验的多语言
      if(key.includes("required")||key.includes("require")){
        let lastIndex = key.lastIndexOf(".");
        let newKey = key.substring(0,lastIndex);
        newLocaleObj[key] =  LocalesObj[newKey].CN+"不能为空！";
      }
    }
  }
  return newLocaleObj;
}
function getLocalesUS(moduleName, LocalesObj) {
  let newLocaleObj = {};
  for(let key of Object.keys(LocalesObj)){
    key = moduleName + "." + key;
    newLocaleObj[key] = LocalesObj[key].US;
    if(!newLocaleObj[key]){
      //自动加上校验的多语言
      if(key.includes("required")||key.includes("require")){
        let lastIndex = key.lastIndexOf(".");
        let newKey = key.substring(0,lastIndex);
        newLocaleObj[key] =  LocalesObj[newKey].US+" couldn't been null!";
      }
    }
  }
  return newLocaleObj;
}
export {
  getLocalesCN,
  getLocalesUS,
  constants,
};
