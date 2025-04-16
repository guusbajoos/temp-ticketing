import axios from '../api';

export const baseHTTP = async (
  method = 'get',
  versionApi,
  moduleApi,
  urlApi,
  queryApi,
  body
) => {
  if (method === 'get') {
    return axios.get(`${urlApi}/${versionApi}/${moduleApi}${queryApi}`);
  } else if (method === 'post') {
    return axios.post(`${urlApi}/${versionApi}${moduleApi}`, body);
  } else if (method === 'put') {
    return axios.put(`${urlApi}/${versionApi}/${moduleApi}`, body);
  } else if (method === 'patch') {
    return axios.patch(`${urlApi}/${versionApi}/${moduleApi}`, body);
  } else if (method === 'delete') {
    return axios.delete(`${urlApi}/${versionApi}/${moduleApi}`);
  }
};

export const POST = async (versionApi, moduleApi, urlApi, body) => {
  return baseHTTP('post', versionApi, urlApi, moduleApi, {}, body);
};

export const GET = async (versionApi, moduleApi, urlApi, query, body) => {
  return baseHTTP('get', versionApi, moduleApi, urlApi, query, body);
};

export const PUT = async (versionApi, moduleApi, urlApi, body) => {
  return baseHTTP('put', versionApi, moduleApi, urlApi, body);
};

export const PATCH = async (versionApi, moduleApi, urlApi, body) => {
  return baseHTTP('patch', versionApi, moduleApi, urlApi, body);
};

export const DELETE = async (versionApi, moduleApi, urlApi) => {
  return baseHTTP('delete', versionApi, moduleApi, urlApi);
};

// export const UPLOAD = async (versionApi, moduleApi,urlApi, payload) => {
//   const formData = new FormData();

//   if (payload.promotion_id !== null) {
//     formData.append('promotion_id', payload.promotion_id);
//   }
//   formData.append('object_purpose', payload.object_purpose);
//   formData.append('object_file', payload.object_file);

//   return baseHTTP('post', versionApi, moduleApi,urlApi, formData, true);
// };
