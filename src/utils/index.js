import { formatMessage } from "umi-plugin-react/locale";
import constants from './constants';
//key 值
export  function getLocale(moduleName,key,desc) {
  //配置唯一key值，加上moduleName为前缀
  let localeObj = {};
  key = moduleName + "." + key;
  localeObj.id = key;
  localeObj.defaultMessage = desc;
  return formatMessage(localeObj);
}
function getLocalesCN(moduleName, LocalesObj) {
  let newLocaleObj = {};
  for(let key of Object.keys(LocalesObj)){
    let withModulekey = moduleName + "." + key;
    newLocaleObj[withModulekey] = LocalesObj[key].CN;
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
    let withModulekey = moduleName + "." + key;
    newLocaleObj[withModulekey] = LocalesObj[key].US;
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
