import React from 'react';
import './Header.css';
import { useNavigate } from "react-router-dom";



export function Header({ onLogin }) {
    const navigate = useNavigate();
    const showLogin = (event) => {
        event.preventDefault();
        navigate('/login-register')

    }

    return (
        <header class="header-area header-sticky">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <nav class="main-nav">

                            <a href="index.html" class="logo">
                                Edu Meeting
                            </a>

                            <ul class="nav">
                                <li class="scroll-to-section"><a href="#top" class="active">Home</a></li>
                                <li><a href="meetings.html">Meetings</a></li>
                                <li class="scroll-to-section"><a href="#apply">Apply Now</a></li>
                                <li class="has-sub">
                                    <a href="javascript:void(0)">Pages</a>
                                    <ul class="sub-menu">
                                        <li><a href="meetings.html">Upcoming Meetings</a></li>
                                        <li><a href="meeting-details.html">Meeting Details</a></li>
                                    </ul>
                                </li>
                                <li class="scroll-to-section"><a href="#courses">Courses</a></li>
                                <li class="scroll-to-section"><a href="#contact" onClick={showLogin}>Logout</a></li>
                            </ul>
                            <a class='menu-trigger'>
                                <span>Menu</span>
                            </a>

                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
export default Header;
