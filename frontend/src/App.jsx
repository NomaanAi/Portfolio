import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminApp from './admin/AdminApp';

export default function App(){
  return (
    <div className='min-h-screen'>
      <nav className='p-4 bg-white shadow-sm'>
        <Link to='/' className='mr-4'>Home</Link>
        <Link to='/projects' className='mr-4'>Projects</Link>
        <Link to='/contact' className='mr-4'>Contact</Link>
        <Link to='/admin' className='text-sm text-blue-600'>Admin</Link>
      </nav>
      <main className='p-6'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/admin/*' element={<AdminApp />} />
        </Routes>
      </main>
    </div>
  )
}
