import { useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/authcontext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", { email, password });
        login(res.data.token);
        window.location.href = res.data.user.role === "provider" ? "/provider-dashboard" : "/";
      } else {
        await api.post("/auth/register", { name, email, password, role });
        setIsLogin(true);
        setError("Account created. Please login.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white text-gray-500 max-w-[360px] w-full mx-4 p-6 py-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">{isLogin ? "Login" : "Sign Up"}</h2>
        
        {!isLogin && (
          <>
            <input type="text" placeholder="Name" className="w-full border p-2 mb-3 rounded" value={name} onChange={(e) => setName(e.target.value)} required />
            <select className="w-full border p-2 mb-3 rounded" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">I am a Customer</option>
              <option value="provider">I am a Service Provider</option>
            </select>
          </>
        )}

        <input type="email" placeholder="Email" className="w-full border p-2 mb-3 rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full border p-2 mb-6 rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="text-red-500 text-xs mb-3 text-center">{error}</p>}

        <button disabled={loading} className="w-full bg-orange-500 py-2.5 rounded text-white font-medium">
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don’t have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-orange-500 underline">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;