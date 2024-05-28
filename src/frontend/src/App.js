// import logo from './logo.svg';
// import './App.css';
import Header from './Header/Header.jsx';
import Footer from './Footer/Footer.jsx';
import Test from './Test-GetSearchAPI.js';
import { useState } from 'react';
import Login from './Login/Login.jsx';

function App() {
  const [isLogin, setIsLogin] = useState(false)

  const handleLogin = () => {
    setIsLogin(true)
  }

  return (
    <>
      {!isLogin && <Login onLogin={handleLogin} />}

      {isLogin && (
        <div>
          <div style={{ with: '100%' }}><Header /></div>
          <br />
          {/* <div><Test /></div> */}
          <br />
          <div style={{ with: '100%' }}><Footer /></div>
        </div >
      )}
    </>

  );
}

export default App;
