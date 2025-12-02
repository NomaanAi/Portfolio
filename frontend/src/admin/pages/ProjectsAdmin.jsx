import React, {useEffect, useState} from 'react';
import axios from 'axios';
export default function ProjectsAdmin(){
  const [projects,setProjects]=useState([]);
  const [form,setForm]=useState({title:'',description:'',github:'',demo:'',tags:''});
  const fetch=async()=>{ const r=await axios.get('/api/projects'); setProjects(r.data); };
  useEffect(()=>{ fetch(); },[]);
  const create=async(e)=>{ e.preventDefault(); const body={...form,tags:form.tags.split(',').map(s=>s.trim())}; await axios.post('/api/projects', body); setForm({title:'',description:'',github:'',demo:'',tags:''}); fetch(); };
  const remove=async(id)=>{ await axios.delete('/api/projects/'+id); fetch(); };
  return (
    <div>
      <h2 className='text-lg font-bold'>Projects</h2>
      <form onSubmit={create} className='mt-2 space-y-2'>
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder='Title' className='w-full p-2 border rounded' />
        <input value={form.github} onChange={e=>setForm({...form,github:e.target.value})} placeholder='Github URL' className='w-full p-2 border rounded' />
        <input value={form.demo} onChange={e=>setForm({...form,demo:e.target.value})} placeholder='Demo URL' className='w-full p-2 border rounded' />
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder='Description' className='w-full p-2 border rounded' />
        <input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder='tags comma separated' className='w-full p-2 border rounded' />
        <button className='px-4 py-2 bg-green-600 text-white rounded'>Create</button>
      </form>
      <div className='mt-4 space-y-2'>
        {projects.map(p=> (
          <div key={p._id} className='p-3 bg-white rounded shadow flex justify-between'>
            <div>
              <div className='font-semibold'>{p.title}</div>
              <div className='text-sm'>{p.description}</div>
            </div>
            <div className='space-x-2'>
              <button onClick={()=>remove(p._id)} className='px-2 py-1 bg-red-500 text-white rounded'>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
