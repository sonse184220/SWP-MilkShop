import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StaffManagement from '../components/Admin/StaffManagement';
import MemberManagement from '../components/Admin/MemberManagement';
import Dashboard from '../components/Admin/Dashboard';
import AdminProfile from '../components/Admin/AdminProfile';


export function AdminRoutes() {
    return (
        <Routes>
            <Route path='StaffManagement' element={<StaffManagement/>} />
            <Route path='MemberManagement' element={<MemberManagement/>} />
            <Route path='Dashboard' element={<Dashboard/>} />
            <Route path='AdminProfile' element={<AdminProfile/>} />

        </Routes>
    )
}
