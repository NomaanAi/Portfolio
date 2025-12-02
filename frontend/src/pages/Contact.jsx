import React, {useState} from 'react';
import axios from 'axios';
export default function Contact(){
  const [form, setForm] = useState({name:'',email:'',message:''});
  const [ok, setOk] = useState(null);
  const submit = async (e)=>{
    e.preventDefault();
    try{ await axios.post('/api/contacts', form); setOk(true); setForm({name:'',email:'',message:''}); }catch(e){ setOk(false); }
  };
  return (
    <div className='max-w-lg'>
      <h1 className='text-xl font-bold'>Contact</h1>
      <form onSubmit={submit} className='mt-4 space-y-2'>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder='Name' className='w-full p-2 border rounded' />
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder='Email' className='w-full p-2 border rounded' />
        <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder='Message' className='w-full p-2 border rounded' />
        <button className='px-4 py-2 bg-blue-600 text-white rounded'>Send</button>
        {ok === true && <p className='text-green-600'>Sent</p>}
        {ok === false && <p className='text-red-600'>Failed</p>}
      </form>
    </div>
  )
}
