import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function Home(){
  const [home, setHome] = useState(null);
  useEffect(()=>{ axios.get('/api/homepage').then(r=>setHome(r.data)); },[]);
  return (
    <div>
      <h1 className='text-3xl font-bold'>{home?.heroTitle || 'Hi, I am Developer'}</h1>
      <p className='mt-2'>{home?.heroSubtitle}</p>
      <section className='mt-6'>
        <h2 className='text-xl font-semibold'>About</h2>
        <p>{home?.aboutText}</p>
      </section>
    </div>
  )
}
