import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../api/axios';



function Signup(){
  const [name, setName]= useState('');
  const [email,setEmail]= useState('');
  const [password,setPassword]= useState('');
  const [error,setError]= useState('');
  const navigate = useNavigate();

  const handleSignup= async() =>{
   try{
      const response= await API.post('/auth/signup',{name,email,password});
      localStorage.setItem('token',response.data.access_token);
      navigate('/uploads');

   }catch(err){
      setError('email already exists');
   }
  }

  return(
   <div>
      <input
      type= "name"
      placeholder= "Name"
      value={name}
      onChange={(e)=> setName(e.target.value)}
      />

      <br />

      <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e)=> setEmail(e.target.value)}
      />

      <br />

      <input
      type= "password"
      placeholder= "Password"
      value={password}
      onChange={(e)=> setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleSignup}>Signup</button>
      {error && <p style={{color:'red'}}>{error}</p>}
      <p>Already have an account? <a href="/login">Login</a></p>


   </div>
  )
}

export default Signup;