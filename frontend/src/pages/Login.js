import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../api/axios';


function Login(){
  const [email,setEmail]= useState('');
  const [password,setPassword]= useState('');
  const [error,setError]= useState('');
  const navigate = useNavigate();

  const handleLogin =async() => {
   try {
      const response= await API.post('/auth/login', {email,password});
      localStorage.setItem('token',response.data.access_token);
      navigate('/uploads');
   }catch(err){
    setError('Invalid email or password');

   }
  };

  return (
    <div>
      <h1>Login</h1>
      <input 
      type= "email"
      placeholder= "Email"
      value= {email}
      onChange={(e)=> setEmail(e.target.value)}
      />
      <br />
      <input
      type= "password"
      placeholder="Password"
      value={password}
      onChange={(e)=> setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleLogin}>Login</button>
      {error && <p style={{color:'red'}}>{error}</p>}
      <p>Don't have an account? <a href="Signup">Sign up</a></p>
    </div>
  );
  
}

export default Login;