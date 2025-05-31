import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await login(formData);
      alert("Login successful!");
      console.log("Login response:", response);
      navigate("/Home"); // or any route after successful login
    } catch (error: any) {
      console.error("Login error:", error);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed";
      alert(msg);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: 'url("/public/background.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-center mb-8">
        <h1 className="text-white text-5xl font-bold">NextPath</h1>
      </div>

      <div className="w-full max-w-sm">
        <div
          className="backdrop-blur-sm rounded-2xl p-8 shadow-lg relative"
          style={{
            background: "transparent",
            border: "2px solid transparent",
            borderRadius: "1rem",
          }}
        >
          {/* Gradient Border */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "2px",
              borderRadius: "1rem",
              background:
                "linear-gradient(135deg, rgba(156, 39, 176, 0.8), rgba(33, 150, 243, 0.8), rgba(156, 39, 176, 0.8))",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
              zIndex: -1,
            }}
          />

          <h2 className="text-white text-3xl font-semibold text-center mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 border-none"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 border-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <a
                href="#"
                className="text-blue-400 text-sm hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-transparent border-2 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-500/10 transition-all duration-200 mt-2 border-transparent hover:border-blue-500 hover:text-blue-200"
            >
              Sign in
            </button>

            {/* Register Link */}
            <div className="text-center text-white text-sm mt-4">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-400 hover:underline hover:text-blue-300 bg-transparent"
              >
                Register for free
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
