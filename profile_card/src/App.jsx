import React from 'react';
import './App.css'
import Sidebar from './Components/Sidebar/Sidebar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Profile from './Pages/Profile/Profile'
// import Toggle_form from './Pages/Login/Toggle_form';
import Home from './Pages/Home/Home';
import Kid from './Pages/Clothes/Kid/Kid';
import Login from './Pages/Login/Login';
import Cart from './Pages/Cart/Cart';
import Email from './Pages/Email/Email'
import { Provider } from 'react-redux';
import store from './Store/store';
import { ToastContainer } from 'react-toastify';
import VerifyMfa from './Pages/Mfa/VerifyMfa';
import SetupMfa from './Pages/Mfa/SetupMfa';
import ProtectedRoute from './Components/ProtectedRoute';
import AdHome from './Pages/Admin/Home/AdHome';
import Modify from './Pages/Admin/Shop-list/Modify';
import {useLocation} from 'react-router-dom'

function App() {
  
  // const location = useLocation()
  // const hideSidebar = location.pathname === '/Admin-panel'

  return (
    <Provider store= {store}>
       <Router>
          <div>
            <Sidebar />
            <ToastContainer />
            <Routes>
              <Route path='/' element={<Home />} />
              
              <Route path='/login' element={<Login />} />
              <Route path='/Verify-Email' element={<Email />} />
              <Route path='/verify-mfa' element={<VerifyMfa />} />
              <Route path='/setup-mfa' element={<SetupMfa />} />
              <Route path='/Admin-panel' element={<AdHome />} />
              <Route path='/admin/modify' element={<Modify />} />

              <Route path='/profile' element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
              <Route path='/category/kids' element={<ProtectedRoute> <Kid /> </ProtectedRoute>} />
              <Route path='/cart' element = {<ProtectedRoute> <Cart /> </ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </Provider>
  )
}

export default App
