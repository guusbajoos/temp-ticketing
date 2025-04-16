import { POST } from './api.datasource';

const Login = async (payload) => {
  return await POST('', 'auth', 'signin', payload);
};

export default { Login };
