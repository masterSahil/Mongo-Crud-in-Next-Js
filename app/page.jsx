"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, LayoutDashboard, Settings, Search, Bell, 
  Plus, Edit2, Trash2, X, Moon, Sun, MoreVertical 
} from "lucide-react";

export default function SaasDashboard() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", age: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- API INTEGRATION ---
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) setUsers(data.user || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/users/${editingId}` : "/api/users";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        closeModal();
        fetchUsers();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchUsers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // --- UI HANDLERS ---
  const openModal = (user = null) => {
    if (user) {
      setFormData({ username: user.username, email: user.email, age: user.age });
      setEditingId(user._id);
    } else {
      setFormData({ username: "", email: "", age: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ username: "", email: "", age: "" });
    setEditingId(null);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0B0E14] text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-[#11151F] border-r border-white/5 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <span className="font-bold text-white tracking-tighter">NX</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">Nexus.io</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[{ name: "Dashboard", icon: LayoutDashboard, active: true }].map((item) => (
            <button key={item.name} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.active ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <item.icon size={20} className={item.active ? "text-indigo-400" : ""} />
              <span className="font-medium">{item.name}</span>
              {item.active && <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full" />}
            </button>
          ))}
        </nav>
        <div className="p-4">
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 p-4 rounded-xl">
            <p className="text-xs text-indigo-200 font-medium">Pro Plan Active</p>
            <p className="text-[10px] text-slate-400 mt-1">10,000 / 50,000 requests</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-full w-1/5 rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* 2. TOP NAVBAR */}
        <header className="h-20 bg-[#0B0E14]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search users, emails..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#11151F] border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=4f46e5" alt="Profile" className="w-9 h-9 rounded-full ring-2 ring-white/10" />
              <div className="hidden md:block text-sm">
                <p className="font-semibold text-white">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Users Overview</h2>
              <p className="text-slate-400 mt-1">Manage your team members and their account permissions here.</p>
            </div>
            <button 
              onClick={() => openModal()} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all"
            >
              <Plus size={18} /> <span>Add User</span>
            </button>
          </div>

          {/* 3. STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Total Users", value: users.length, trend: "+12%", color: "text-blue-400" },
              { label: "Active Now", value: Math.ceil(users.length * 0.8), trend: "+5%", color: "text-emerald-400" },
              { label: "New This Week", value: "24", trend: "+18%", color: "text-purple-400" }
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={stat.label} 
                className="bg-[#11151F] border border-white/5 p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users size={64} />
                </div>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                <div className="flex items-baseline space-x-3 mt-2">
                  <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
                  <span className={`text-sm font-medium ${stat.color}`}>{stat.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 4. USER TABLE */}
          <div className="bg-[#11151F] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-semibold">User</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-semibold">Email</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-semibold">Age</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-semibold">Status</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-400 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <motion.tr 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ delay: index * 0.05 }}
                          key={user._id} 
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}&backgroundColor=1e293b`} className="w-10 h-10 rounded-full" alt="avatar" />
                              <span className="text-slate-200 font-medium">{user.username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-400">{user.email}</td>
                          <td className="py-4 px-6 text-slate-400">{user.age}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span> Active
                            </span>
                          </td>
                          <td className="py-4 px-6 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(user)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(user._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <Users size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium text-slate-300">No users found</p>
                            <p className="text-sm">Try adjusting your search or add a new user.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer (Visual) */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-slate-400">
              <span>Showing {filteredUsers.length} results</span>
              <div className="flex space-x-1">
                <button className="px-3 py-1 rounded-md hover:bg-white/5 text-slate-500">Prev</button>
                <button className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium">1</button>
                <button className="px-3 py-1 rounded-md hover:bg-white/5">2</button>
                <button className="px-3 py-1 rounded-md hover:bg-white/5">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. MODAL FORM */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#11151F] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Edit User Profile" : "Add New User"}
                </h2>
                <button onClick={closeModal} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Username</label>
                  <input
                    type="text" name="username" value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="johndoe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Age</label>
                  <input
                    type="number" name="age" value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="25"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-slate-300 font-medium hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex justify-center items-center">
                    {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : (editingId ? "Save Changes" : "Create User")}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Global Styles for scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}