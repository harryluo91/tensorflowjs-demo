import apiRequest from '../utils/apiUtils';

const login = ({username, password}) => {
  return apiRequest({
    url:    `/login`,
    method: 'POST',
    data: {
      username,
      password
    }
  });
}

const authService = {
  login
}

export default authService;