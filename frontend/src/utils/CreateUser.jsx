import axios from 'axios';
import jwt_decode from "jwt-decode";

export const createOrGetUser = async (response, addUser) => {
  const decoded = jwt_decode(response.credential);

  const { name, picture, sub } = decoded;

      const user = {
        _id: sub,
        _type: 'user',
        userName: name,
        image: picture
    }


    addUser(user);

    axios.post('http://localhost:3000/api/auth', user);
};


//  const responseGoogle = (response) =>{
//     console.log(response);
//     let profileObj = jwt_decode(response.credential);
//     console.log(profileObj);
//     localStorage.setItem('user', JSON.stringify(profileObj));
//     const { sub, name, picture } = profileObj;
//     const doc = {
//         _id: sub,
//         _type: 'user',
//         userName: name,
//         image: picture
//     };
//     client.createIfNotExists(doc).then(() => {
//       navigate('/', { replace: true });
//       console.log('login created')
//     });
//   };
