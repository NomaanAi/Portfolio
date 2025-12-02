import React, {useEffect,useState} from 'react';
import axios from 'axios';
export default function AnalyticsAdmin(){
  const [events,setEvents]=useState([]);
  useEffect(()=>{ axios.get('/api/analytics').then(r=>setEvents(r.data)); },[]);
  return (
    <div>
      <h2 className='text-lg font-bold'>Analytics</h2>
      <ul className='mt-2'>
        {events.map(e=> <li key={e._id} className='p-2 bg-white rounded my-1'>{e.event} - {JSON.stringify(e.meta)}</li>)}
      </ul>
    </div>
  )
}
