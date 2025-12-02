import React, {useEffect,useState} from 'react';
import axios from 'axios';
export default function ContactsAdmin(){
  const [contacts,setContacts]=useState([]);
  useEffect(()=>{ axios.get('/api/contacts').then(r=>setContacts(r.data)); },[]);
  const mark=async(id)=>{ await axios.patch('/api/contacts/'+id+'/read'); setContacts(c=>c.map(x=> x._id===id?{...x,isRead:true}:x)); };
  return (
    <div>
      <h2 className='text-lg font-bold'>Contacts</h2>
      <div className='mt-2 space-y-2'>
        {contacts.map(c=> (
          <div key={c._id} className='p-3 bg-white rounded shadow'>
            <div className='flex justify-between'><div className='font-semibold'>{c.name} - {c.email}</div><div>{c.isRead?'Read':'New'}</div></div>
            <div className='mt-2'>{c.message}</div>
            <div className='mt-2'><button onClick={()=>mark(c._id)} className='px-2 py-1 bg-green-600 text-white rounded'>Mark read</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}
