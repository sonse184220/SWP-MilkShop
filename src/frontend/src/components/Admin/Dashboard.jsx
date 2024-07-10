import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "./Dashboard.css";
import SidebarAdmin from "./SidebarAdmin";
import { GetMonthlyRevenue } from "../../services/admin/getMonthlyRevenue";

const Dashboard = () => {
  const AdminToken = "Bearer " + sessionStorage.getItem("token");

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  const lineData = [
    { name: "23 Nov", revenue: 24000 },
    { name: "24 Nov", revenue: 25000 },
    { name: "25 Nov", revenue: 30000 },
    { name: "26 Nov", revenue: 35000 },
    { name: "27 Nov", revenue: 38000 },
    { name: "28 Nov", revenue: 45000 },
    { name: "29 Nov", revenue: 47000 },
    { name: "30 Nov", revenue: 50000 },
  ];

  const barData = [
    { name: "Jan", revenue: 50000 },
    { name: "Feb", revenue: 40000 },
    { name: "Mar", revenue: 60000 },
    { name: "Apr", revenue: 70000 },
    { name: "May", revenue: 80000 },
    { name: "Jun", revenue: 75000 },
    { name: "Jul", revenue: 85000 },
    { name: "Aug", revenue: 70000 },
    { name: "Sep", revenue: 60000 },
    { name: "Oct", revenue: 50000 },
    { name: "Nov", revenue: 40000 },
    { name: "Dec", revenue: 20000 },
  ];
  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  const handleGetMonthlyRevenue = async () => {
    try {
      const response = await GetMonthlyRevenue(AdminToken);
      if (response.data.monthlyRevenue) {
        setMonthlyRevenue(response.data.monthlyRevenue);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    handleGetMonthlyRevenue();
  }, [])

  return (
    <>
      <div className="row">
        <div className="col-lg-2">
          <SidebarAdmin style={{ width: '100%' }} />
        </div>
        <div className="col-lg-10 dashboard">
          <div className="content-header">
            <h1>Dashboard</h1>
            <header>
              <button className="admin-name" onClick={toggleDropdown}>
                Admin Name
              </button>
              <div ref={dropdownRef} className="dropdown-menu">
                <ul className="dropdownAdmin">
                  <li>
                    <a href="/Admin/AdminProfile">Profile</a>
                  </li>
                  <li>
                    <a href="#">Logout</a>
                  </li>
                </ul>
              </div>
            </header>
          </div>
          {/* <div className="summary">
            <div className="summary-item">
              <h2>$45,678.90</h2>
              <p>+20% month over month</p>
            </div>
            <div className="summary-item">
              <h2>2,405</h2>
              <p>+33% month over month</p>
            </div>
            <div className="summary-item">
              <h2>10,353</h2>
              <p>-8% month over month</p>
            </div>
          </div> */}
          <div className="charts">
            <div className="chart">
              <h3>Revenue Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    // type="monotone"
                    dataKey="totalRevenue"
                    stroke="#8884d8"
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart">
              <h3>Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="top-users">
            <h3>Top Users</h3>
            <ul>
              <li>Helena - email@figmasfakedomain.net</li>
              <li>Oscar - email@figmasfakedomain.net</li>
              <li>Daniel - email@figmasfakedomain.net</li>
              <li>Daniel Jay Park - email@figmasfakedomain.net</li>
              <li>Mark Rojas - email@figmasfakedomain.net</li>
            </ul>
          </div>
          <div className="source-statistics">
            <h3>Source Statistics</h3>
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Sessions</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>website.net</td>
                  <td>4321</td>
                  <td>+84%</td>
                </tr>
                <tr>
                  <td>website.net</td>
                  <td>4033</td>
                  <td>-8%</td>
                </tr>
                <tr>
                  <td>website.net</td>
                  <td>3128</td>
                  <td>+2%</td>
                </tr>
                <tr>
                  <td>website.net</td>
                  <td>2104</td>
                  <td>+33%</td>
                </tr>
                <tr>
                  <td>website.net</td>
                  <td>2003</td>
                  <td>-30%</td>
                </tr>
                <tr>
                  <td>website.net</td>
                  <td>1894</td>
                  <td>+15%</td>
                </tr>
                <tr>
                  <td>website.net</td>
                  <td>405</td>
                  <td>-12%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div >
    </>
  );
};

export default Dashboard;
