import React, {useEffect,useState} from 'react';
import axios from 'axios';
export default function HomepageAdmin(){
  const [data,setData]=useState({});
  useEffect(()=>{ axios.get('/api/homepage').then(r=>setData(r.data)); },[]);
  const save=async()=>{ await axios.put('/api/homepage', data); alert('Saved'); };
  return (
    <div>
      <h2 className='text-lg font-bold'>Homepage</h2>
      <div className='mt-2 space-y-2 max-w-2xl'>
        <input value={data.heroTitle||''} onChange={e=>setData({...data,heroTitle:e.target.value})} placeholder='Hero Title' className='w-full p-2 border rounded' />
        <input value={data.heroSubtitle||''} onChange={e=>setData({...data,heroSubtitle:e.target.value})} placeholder='Hero Subtitle' className='w-full p-2 border rounded' />
        <textarea value={data.aboutText||''} onChange={e=>setData({...data,aboutText:e.target.value})} placeholder='About' className='w-full p-2 border rounded' />
        <button onClick={save} className='px-4 py-2 bg-green-600 text-white rounded'>Save</button>
      </div>
    </div>
  )
}
