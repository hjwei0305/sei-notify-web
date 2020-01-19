import pwa from './en-US/pwa';
import notifyContent from "./en-US/notifyContent";
import {bulletinLocalesCN} from "../pages/MetaData/Bulletin/locales/locales";

export default {
  "app.request.error": "Interface request exception",
  ...pwa,
  ...notifyContent,
  ...bulletinLocalesCN,
};
