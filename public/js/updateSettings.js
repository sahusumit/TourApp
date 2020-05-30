import axios  from 'axios'
import {showAlert} from './alert'
// type is either data or password
export const updateSettings = async (data, type) =>{
  try{
       const url = 
          type === 'password'
             ? 'http://localhost:4001/api/v1/users/updatePassword'
             : 'http://localhost:4001/api/v1/users/updateData'
      const res = await axios({
          method:'PATCH',
          url,
          data
      });
      console.log(res.data.status)
  if(res.data.status === 'success'){
    showAlert('success',`${type.toUpperCase()} update successfully`);
  }
  }catch(err){
    showAlert('error', err.response.data.message);
  }
};