import React, {useState} from 'react';
import axios from 'axios';

export default function Login(){
  const [form,setForm] = useState({email:'',password:''});
  const [err,setErr]=useState(null);
  const submit=async(e)=>{
    e.preventDefault();
    try{
      const res = await axios.post('/api/auth/login', form, { withCredentials: true });
      // we don't receive token by default in cookie - store flag
      localStorage.setItem('admin_token','1');
      window.location.href='/admin/dashboard';
    }catch(e){
      setErr(e.response?.data?.message||'Login failed');
    }
  };
  return (
    <div className='max-w-md bg-white p-6 rounded shadow'>
      <h2 className='text-xl font-bold mb-4'>Admin Login</h2>
      <form onSubmit={submit} className='space-y-2'>
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder='Email' className='w-full p-2 border rounded' />
        <input type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder='Password' className='w-full p-2 border rounded' />
        <button className='px-4 py-2 bg-blue-600 text-white rounded'>Login</button>
        {err && <p className='text-red-600'>{err}</p>}
      </form>
    </div>
  )
}
