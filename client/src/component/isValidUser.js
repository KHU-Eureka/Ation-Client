import axios from 'axios';

const isValidUser = async ({token}) => {
    const { data: result } = await axios.get(
      process.env.REACT_APP_SERVER_HOST+'/api/auth', {
        headers: {
          Authorization: "Bearer " + token
            }
          }
    )
    return result;
}

export default isValidUser;