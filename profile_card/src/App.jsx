import React, {useEffect} from 'react';
import './App.css'
import Sidebar from './Components/Sidebar/Sidebar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Profile from './Pages/Profile/Profile'
import Forget_pass from './Pages/Passwords/Forget_pass';
import Reset_pass from './Pages/Passwords/Reset_pass';
import Home from './Pages/Home/Home';
import Kid from './Pages/Clothes/Kid/Kid';
import Man from './Pages/Clothes/Man/Man'
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
import BlockU from './Pages/Admin/BlockUsers/BlockU';
import {useLocation} from 'react-router-dom'
import Home_login from './Pages/Home/Home_login';
import Woman from './Pages/Clothes/Woman/Woman';
import Update_pass from './Pages/Passwords/Update_pass';
import { useDispatch } from 'react-redux';
import { fetchUserDetails } from './Slice/userSlice';


function App() {
  
  // const location = useLocation()
  // const hideSidebar = location.pathname === '/Admin-panel'
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUserDetails())
  }, [dispatch])

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
              <Route path='/admin/block' element={<BlockU />} />
              <Route path='/auth/home' element={<Home_login />} />
              <Route path='/forget-password' element={<Forget_pass />} />
              <Route path='/change-password/:token' element={<Reset_pass />} />

              <Route path='/profile' element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
              <Route path='/category/kids' element={<ProtectedRoute> <Kid /> </ProtectedRoute>} />
              <Route path='/category/men' element={<ProtectedRoute> <Man /> </ProtectedRoute>} />
              <Route path='/category/women' element={<ProtectedRoute> <Woman /> </ProtectedRoute>} />
              <Route path='/cart' element = {<ProtectedRoute> <Cart /> </ProtectedRoute>} />
              <Route path='/update-password' element = {<ProtectedRoute> <Update_pass /> </ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </Provider>
  )
}

export default App
