import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/auth/index";
import SignUpPage from "./pages/signupPage";
import LoginPage from "./pages/loginPage";
import SearchPage from "./pages/searchPage";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, authChecked } = useSelector((state) => state.auth);

  // Check authentication status on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loading state until auth check is complete
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/search" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/search" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/search" replace /> : <SignUpPage />}
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/search" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;