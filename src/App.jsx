import { useEffect } from "react"
import "./App.css"
// Redux
import { Provider, useDispatch, useSelector } from "react-redux"
// React Router
import { Route, Routes, useNavigate } from "react-router-dom"

// Components
import Navbar from "./components/Common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"

import MyProfile from "./components/core/Dashboard/MyProfile"
import MyHistory from "./components/core/Dashboard/UserDashboard"
import Settings from "./components/core/Dashboard/Settings"

import Cart from "./components/core/Dashboard/Cart"
import About from "./pages/About"

import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"
import ForgotPassword from "./pages/ForgotPassword"

// import  AddCategory  from "./components/core/Dashboard/AdminDashboard/addCategory"
// import MyCategories from "./components/core/Dashboard/AdminDashboard/myCategories"
// import EditCategory from "./components/core/Dashboard/ProviderDashboard/Edit/indexCategory"



import ProviderStat from "./components/core/Dashboard/ProviderStat"

import AddService from "./components/core/Dashboard/AddService/index"
import EditService from "./components/core/Dashboard/EditService"
import MyServices from "./components/core/Dashboard/MyServices"

// import Add from "./components/core/Dashboard/ProviderDashboard/Add"
// import AddProduct from "./components/core/Dashboard/ProviderDashboard/Add/AddProduct"
// import EditProduct from "./components/core/Dashboard/ProviderDashboard/Edit/indexProduct"


// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail"

import { getUserDetails } from "./services/operations/profileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        {/* Private Route - for Only Logged in User */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
        
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />
      
          {/* Route only for Instructors */}
          {user?.accountType === ACCOUNT_TYPE.PROVIDER && (
            <>
              
            </>
          )}

 
        </Route>

     
          {/* Route only for Students */}
          {user?.accountType === ACCOUNT_TYPE.USER && (
            <>
              <Route
                path="dashboard/my-history"
                element={<MyHistory />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )}
          
          {/* Route only for Admins */}
          {user?.accountType === ACCOUNT_TYPE.ADMIN && (
            {/* <>
              <Route path="/dashboard/add-category" element={<AddCategory />} />
              <Route path="/dashboard/my-categories" element={<MyCategories/>} />
              <Route path="/dashboard/edit-category/:id" element={<EditCategory/>} />
            </> */}
          )} 

          {/* Route only for Providers */}
          {user?.accountType === ACCOUNT_TYPE.PROVIDER && (
            <>

              <Route path="dashboard/provider-stat" element={<ProviderStat />} />

              <Route path="/dashboard/add" element={<Add />} />{/*
              <Route path="/dashboard/add-product" element={<AddProduct/> } />
              <Route path="/dashboard/edit-product/:id" element={<EditProduct/>} /> */}

              <Route path="dashboard/my-services" element={<MyServices />} />
              <Route path="dashboard/add-service" element={<AddService />} />
              <Route path="dashboard/edit-service/:serviceId" element={<EditService />}
              />
            </>
          )} 
       
        {/* 404 Page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App;