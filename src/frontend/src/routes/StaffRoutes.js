import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import ProductManagement from '../components/Staff/ProductManagement.jsx';
import OrderManagement from '../components/Staff/OrderManagement.jsx';
import BlogManagement from '../components/Staff/BlogManagement.jsx';
import VoucherManagement from '../components/Staff/VoucherManagement.jsx';
import ReportManagement from '../components/Staff/ReportManagement.jsx';
import StaffProfile from '../components/Staff/StaffProfile.jsx';

export function StaffRoutes() {
    return (
        <Routes>
            <Route path='ProductManagement' element={<ProductManagement />} />
            <Route path='OrderManagement' element={<OrderManagement />} />
            <Route path='BlogManagement' element={<BlogManagement />} />
            <Route path='VoucherManagement' element={<VoucherManagement />} />
            <Route path='ReportManagement' element={<ReportManagement/>} />
            <Route path='StaffProfile' element={<StaffProfile/>} />
        </Routes>
    )
}
