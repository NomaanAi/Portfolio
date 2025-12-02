import React from 'react';
import {Routes, Route, Link, Navigate} from 'react-router-dom';
import AdminLogin from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectsAdmin from './pages/ProjectsAdmin';
import SkillsAdmin from './pages/SkillsAdmin';
import ContactsAdmin from './pages/ContactsAdmin';
import SocialAdmin from './pages/SocialAdmin';
import HomepageAdmin from './pages/HomepageAdmin';
import AnalyticsAdmin from './pages/AnalyticsAdmin';

const isAuth = () => !!localStorage.getItem('admin_token');

const Protected = ({children}) => isAuth() ? children : <Navigate to='/admin/login' />;

export default function AdminApp(){
  return (
    <div className='p-4 bg-slate-50 min-h-screen'>
      <nav className='mb-4'>
        <Link to='/admin/dashboard' className='mr-2'>Dashboard</Link>
        <Link to='/admin/projects' className='mr-2'>Projects</Link>
        <Link to='/admin/skills' className='mr-2'>Skills</Link>
        <Link to='/admin/contacts' className='mr-2'>Contacts</Link>
        <Link to='/admin/social' className='mr-2'>Social</Link>
        <Link to='/admin/homepage' className='mr-2'>Homepage</Link>
        <Link to='/admin/analytics' className='mr-2'>Analytics</Link>
      </nav>
      <Routes>
        <Route path='login' element={<AdminLogin/>} />
        <Route path='dashboard' element={<Protected><Dashboard/></Protected>} />
        <Route path='projects' element={<Protected><ProjectsAdmin/></Protected>} />
        <Route path='skills' element={<Protected><SkillsAdmin/></Protected>} />
        <Route path='contacts' element={<Protected><ContactsAdmin/></Protected>} />
        <Route path='social' element={<Protected><SocialAdmin/></Protected>} />
        <Route path='homepage' element={<Protected><HomepageAdmin/></Protected>} />
        <Route path='analytics' element={<Protected><AnalyticsAdmin/></Protected>} />
      </Routes>
    </div>
  )
}
