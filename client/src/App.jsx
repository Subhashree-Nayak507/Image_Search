import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/auth/index";
import SignUpPage from "./pages/signupPage";
import LoginPage from "./pages/loginPage";
import SearchPage from "./pages/searchPage";


function App() {
  const dispatch = useDispatch();
   const location = useLocation();
  const {  isAuthenticated,user } = useSelector((state) => state.auth);
   console.log("authenticated",isAuthenticated);
   console.log("user",user);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch,location.pathname]);

  return (
    <div>
     <Routes>
        <Route path='/' element={!isAuthenticated ? <LoginPage /> : <Navigate to='/search' />} />
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to='/search' />} />
        <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> : <Navigate to='/search' />} />
        <Route path='/search' element={isAuthenticated ? <SearchPage /> : <Navigate to='/login' />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;