import React, {useEffect, useState} from 'react';
import axios from 'axios';
export default function Projects(){
  const [projects, setProjects] = useState([]);
  useEffect(()=>{ axios.get('/api/projects').then(r=>setProjects(r.data)); },[]);
  return (
    <div>
      <h1 className='text-2xl font-bold'>Projects</h1>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
        {projects.map(p=> (
          <div key={p._id} className='p-4 bg-white rounded shadow'>
            <h3 className='font-semibold'>{p.title}</h3>
            <p className='text-sm'>{p.description}</p>
            <div className='mt-2'><a href={p.github} target='_blank' rel='noreferrer'>GitHub</a> | <a href={p.demo} target='_blank' rel='noreferrer'>Live</a></div>
          </div>
        ))}
      </div>
    </div>
  )
}
