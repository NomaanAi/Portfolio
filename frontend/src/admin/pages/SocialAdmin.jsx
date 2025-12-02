import React, {useEffect,useState} from 'react';
import axios from 'axios';
export default function SocialAdmin(){
  const [data,setData]=useState({});
  useEffect(()=>{ axios.get('/api/social').then(r=>setData(r.data)); },[]);
  const save=async()=>{ await axios.put('/api/social', data); alert('Saved'); };
  return (
    <div>
      <h2 className='text-lg font-bold'>Social Links</h2>
      <div className='mt-2 space-y-2 max-w-lg'>
        <input value={data.github||''} onChange={e=>setData({...data,github:e.target.value})} placeholder='GitHub' className='w-full p-2 border rounded' />
        <input value={data.linkedin||''} onChange={e=>setData({...data,linkedin:e.target.value})} placeholder='LinkedIn' className='w-full p-2 border rounded' />
        <input value={data.twitter||''} onChange={e=>setData({...data,twitter:e.target.value})} placeholder='Twitter' className='w-full p-2 border rounded' />
        <button onClick={save} className='px-4 py-2 bg-green-600 text-white rounded'>Save</button>
      </div>
    </div>
  )
}
