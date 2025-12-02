import React, {useEffect,useState} from 'react';
import axios from 'axios';
export default function SkillsAdmin(){
  const [skills,setSkills]=useState([]);
  const [name,setName]=useState('');
  useEffect(()=>{ axios.get('/api/skills').then(r=>setSkills(r.data)); },[]);
  const add=async()=>{ await axios.post('/api/skills',{name}); setName(''); const r=await axios.get('/api/skills'); setSkills(r.data); };
  return (
    <div>
      <h2 className='text-lg font-bold'>Skills</h2>
      <div className='mt-2'>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder='Skill name' className='p-2 border rounded mr-2' />
        <button onClick={add} className='px-3 py-2 bg-blue-600 text-white rounded'>Add</button>
      </div>
      <ul className='mt-3'>
        {skills.map(s=> <li key={s._id} className='p-2 bg-white rounded my-1'>{s.name}</li>)}
      </ul>
    </div>
  )
}
