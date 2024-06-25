import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import ProductManagement from '../components/Staff/ProductManagement.jsx';

export function StaffRoutes() {
    return (
        <Routes>
            <Route path='ProductManagement' element={<ProductManagement />} />
        </Routes>
    )
}