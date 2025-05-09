import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/auth/index";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const naviagte= useNavigate();

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(formData)).unwrap();
      toast.success("Account created successfully");
      naviagte("/search");
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="w-full flex justify-center items-center py-4 sm:py-6 md:py-8">
        <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white/10 backdrop-blur-xl border border-blue-500/20 shadow-2xl overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4 md:pb-6">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-200 text-center tracking-tight">
              Sign Up in  ImageSearch Pro
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-900/30 pr-2 sm:pr-3">
            <form className="flex flex-col gap-3 sm:gap-4 md:gap-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-blue-200 text-xs sm:text-sm">
                  Email
                </Label>
                <div className="relative">
                  <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 text-sm sm:text-base" size={18} />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-9 sm:h-10 text-sm sm:text-base bg-white/15 text-white border-blue-500/30 focus:border-blue-400 placeholder:text-blue-300/60"
                    required
                  />
                </div>
              </div>

              {/* Username and Full Name Inputs */}
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2 flex-1">
                  <Label htmlFor="username" className="text-blue-200 text-xs sm:text-sm">
                    Username
                  </Label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 text-sm sm:text-base" size={16} />
                    <Input
                      id="username"
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 h-9 sm:h-10 text-sm sm:text-base bg-white/15 text-white border-blue-500/30 focus:border-blue-400 placeholder:text-blue-300/60"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2 flex-1 mt-3 xs:mt-0">
                  <Label htmlFor="fullName" className="text-blue-200 text-xs sm:text-sm">
                    Full Name
                  </Label>
                  <div className="relative">
                    <MdDriveFileRenameOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 text-sm sm:text-base" size={18} />
                    <Input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="Full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10 h-9 sm:h-10 text-sm sm:text-base bg-white/15 text-white border-blue-500/30 focus:border-blue-400 placeholder:text-blue-300/60"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="password" className="text-blue-200 text-xs sm:text-sm">
                  Password
                </Label>
                <div className="relative">
                  <MdPassword className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 text-sm sm:text-base" size={18} />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 h-9 sm:h-10 text-sm sm:text-base bg-white/15 text-white border-blue-500/30 focus:border-blue-400 placeholder:text-blue-300/60"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base h-9 sm:h-10 md:h-11"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Signing up...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Error Message */}
              {error && (
                <p className="text-red-400 text-center text-xs sm:text-sm font-medium animate-pulse">
                  {error.message}
                </p>
              )}
            </form>

            {/* Sign In Link */}
            <div className="mt-4 sm:mt-5 md:mt-6 text-center">
              <p className="text-blue-200 text-xs sm:text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-300 underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;