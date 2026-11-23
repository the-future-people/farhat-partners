// Farhat Trade Partners (24 Nov 2026): partners.farhatprintingpress.com.
//   /           log in, then the application's progress or the dashboard
//   /register   the direct registration link
//   /forgot     a new password by a code to the phone
//   /new        send a new job

import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './Home.jsx'
import Apply from './Apply.jsx'
import Forgot from './Forgot.jsx'
import NewJob from './NewJob.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Apply />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/new" element={<NewJob />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
