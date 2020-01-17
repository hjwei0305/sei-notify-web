import request from '@/utils/request';
import { apiPrefix } from '@/utils/config';

export default async function queryError(code) {
  return request(`${apiPrefix}/${code}`);
}
