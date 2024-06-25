import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import ProductManagement from '../components/Staff/ProductManagement.jsx';
import OrderManagement from '../components/Staff/OrderManagement.jsx';
import BlogManagement from '../components/Staff/BlogManagement.jsx';

export function StaffRoutes() {
    return (
        <Routes>
            <Route path='ProductManagement' element={<ProductManagement />} />
            <Route path='OrderManagement' element={<OrderManagement />} />
            <Route path='BlogManagement' element={<BlogManagement />} />
        </Routes>
    )
}
