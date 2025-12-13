import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import SEO from "../../components/SEO";
import { User, Lock, Save, AlertCircle, CheckCircle } from "lucide-react";



export default function Profile() {
  const { user, setUser } = useAuth(); // We might need to update user context after profile update
  const [activeTab, setActiveTab] = useState("details"); // details | password
  
  // Profile Form
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: "", text: "" });

    try {
      const res = await api.patch(
        "/api/auth/updateMe",
        { name, email },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      if (res.data.status === "success") {
        setProfileMessage({ type: "success", text: "Profile updated successfully!" });
        // Update user in context/localstorage if needed, though checkAuth might handle it on refresh.
        // Better to update manually to reflect changes immediately
        const updatedUser = res.data.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update local storage
        // window.location.reload(); // Simple way to refresh context, or we can expose setUser in context
      }
    } catch (err) {
      setProfileMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to update profile." 
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      setPasswordLoading(false);
      return;
    }

    try {
        const res = await api.patch(
            "/api/auth/updateMyPassword",
            { 
                passwordCurrent: currentPassword,
                password: newPassword,
                passwordConfirm: confirmPassword
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (res.data.status === "success") {
            setPasswordMessage({ type: "success", text: "Password updated! You are logged in with new password." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            // Update token if it was refreshed
            if (res.data.token) {
                 localStorage.setItem("token", res.data.token);
            }
        }
    } catch (err) {
        setPasswordMessage({ 
            type: "error", 
            text: err.response?.data?.message || "Failed to update password." 
        });
    } finally {
        setPasswordLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <SEO title="My Profile | Noman.dev" description="Manage your account." />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-accent/20">
             {user?.name?.charAt(0) || "U"}
        </div>
        <div>
           <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Profile</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your personal information and security.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[250px,1fr] gap-8">
         {/* Sidebar Navigation */}
         <div className="space-y-2">
             <button 
               onClick={() => setActiveTab("details")}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === "details" ? "bg-white dark:bg-slate-800 shadow-sm text-accent ring-1 ring-slate-200 dark:ring-slate-700" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"}`}
             >
                <User size={18} /> Personal Details
             </button>
             <button 
               onClick={() => setActiveTab("password")}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === "password" ? "bg-white dark:bg-slate-800 shadow-sm text-accent ring-1 ring-slate-200 dark:ring-slate-700" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"}`}
             >
                <Lock size={18} /> Security
             </button>
         </div>

         {/* Content Area */}
         <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
             {activeTab === "details" && (
                 <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">Personal Details</h2>
                    
                    {profileMessage.text && (
                        <div className={`p-4 rounded-lg flex items-start gap-3 text-sm ${profileMessage.type === "success" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                            {profileMessage.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {profileMessage.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={profileLoading}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {profileLoading ? "Saving..." : <><Save size={16} /> Save Changes</>}
                    </button>
                 </form>
             )}

             {activeTab === "password" && (
                 <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-lg">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">Change Password</h2>
                    
                    {passwordMessage.text && (
                        <div className={`p-4 rounded-lg flex items-start gap-3 text-sm ${passwordMessage.type === "success" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                            {passwordMessage.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {passwordMessage.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                            <input 
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                                <input 
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                                <input 
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={passwordLoading}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {passwordLoading ? "Updating..." : <><Save size={16} /> Update Password</>}
                    </button>
                 </form>
             )}
         </div>
      </div>
    </motion.div>
  );
}
