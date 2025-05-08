import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/auth/index";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const naviagte= useNavigate();

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      toast.success("Logged in successfully");
      // After successful login
naviagte( "/search");
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-lg lg:max-w-xl bg-white/10 backdrop-blur-xl border border-blue-500/20 shadow-2xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-white text-center tracking-tight">
            Log In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-blue-200 text-sm md:text-base">
                Username
              </Label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/15 text-white border-blue-500/30 focus:border-blue-400 text-base md:text-lg placeholder:text-blue-300/60"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-200 text-sm md:text-base">
                Email
              </Label>
              <div className="relative">
                <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/15 text-white border-blue-500/30 focus:border-blue-400 text-base md:text-lg placeholder:text-blue-300/60"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-200 text-sm md:text-base">
                Password
              </Label>
              <div className="relative">
                <MdPassword className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/15 text-white border-blue-500/30 focus:border-blue-400 text-base md:text-lg placeholder:text-blue-300/60"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 text-base md:text-lg py-6"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  
                  Logging in...
                </div>
              ) : (
                "Log In"
              )}
            </Button>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-center text-sm md:text-base font-medium animate-pulse">
                {error.message}
              </p>
            )}
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-blue-200 text-sm md:text-base">
              Don't have an account?
              <Link to="/signup">Sign Up</Link>
            </p>
    
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;