"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, Trophy, IndianRupee, Share2, Search, LogOut,
  Plus, Trash2, Edit, Eye, CheckCircle, XCircle, Shield,
  Building2, ChevronDown, X
} from "lucide-react";
import PublicPageGrid from "@/components/PublicPageGrid";

const ADMIN_PASSWORD = "occ@aksharaPassword";
const STORAGE_KEY = "occ_admin";

// TODO: Replace with API call to fetch users
// TODO: Replace with API call to fetch clubs
// TODO: Replace with API call to fetch communities
// TODO: Replace with API call to fetch opportunities
// TODO: Replace with API call to fetch referrals
// TODO: Replace with API call to fetch earnings
// TODO: Replace with API call to fetch memberships

const REFERRAL_STATUSES = ["Pending", "In Review", "Interviewing", "Closed (Won)", "Rejected"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent = false }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] ${accent ? "border-t-8 border-t-brutal-blue" : ""}`}>
      <div className="flex items-center gap-4 mb-3">
        <div className="bg-brutal-blue text-white p-3 border-2 border-black">
          <Icon className="w-6 h-6" />
        </div>
        <span className="font-black uppercase text-sm text-gray-600 tracking-widest">{label}</span>
      </div>
      <div className="text-4xl font-black">{value}</div>
    </div>
  );
}

function SectionPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border-4 border-black border-l-8 border-l-brutal-blue p-8 shadow-[8px_8px_0_0_#000] mb-10">
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-4 border-black pb-4">{title}</h2>
      {children}
    </div>
  );
}

function Badge({ text, color = "black" }: { text: string; color?: string }) {
  const colorMap: Record<string, string> = {
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
    blue: "bg-brutal-blue text-white",
    yellow: "bg-yellow-400 text-black",
    black: "bg-black text-white",
  };
  return (
    <span className={`px-3 py-1 font-black uppercase text-xs border-2 border-black ${colorMap[color] || colorMap.black}`}>
      {text}
    </span>
  );
}

function statusColor(status: string) {
  if (status === "Active" || status === "Closed (Won)") return "green";
  if (status === "Rejected") return "red";
  if (status === "Interviewing" || status === "In Review") return "blue";
  if (status === "Upcoming") return "yellow";
  return "black";
}

// ─── Create Club/Community Modal ──────────────────────────────────────────────

function CreateEntityModal({ type, onClose, onSave }: { type: "club" | "community"; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({ name: "", description: "", category: "", profileImage: "", bannerImage: "" });
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_#1d2cf3] w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b-4 border-black">
          <h3 className="text-2xl font-black uppercase">Create {type === "club" ? "Club" : "Community"}</h3>
          <button onClick={onClose} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {(["name", "description", "category", "profileImage", "bannerImage"] as const).map((field) => (
            <div key={field}>
              <label className="font-black uppercase text-sm block mb-1">{field.replace(/([A-Z])/g, " $1")}</label>
              <input
                className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:border-brutal-blue"
                placeholder={field}
                value={form[field]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="p-6 border-t-4 border-black flex gap-4">
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 bg-black text-white py-3 font-black uppercase border-2 border-black shadow-[4px_4px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Create
          </button>
          <button onClick={onClose} className="flex-1 bg-white py-3 font-black uppercase border-2 border-black hover:bg-brutal-gray transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  // TODO: Replace with API call to fetch referrals
  const [referrals, setReferrals] = useState<any[]>([]);
  // TODO: Replace with API call to fetch earnings
  const [earnings, setEarnings] = useState<any[]>([]);
  // TODO: Replace with API call to fetch clubs
  const [clubs, setClubs] = useState<any[]>([]);
  // TODO: Replace with API call to fetch communities
  const [communities, setCommunities] = useState<any[]>([]);
  // TODO: Replace with API call to fetch opportunities
  const [opportunities, setOpportunities] = useState<any[]>([]);
  // TODO: Replace with API call to fetch users
  const [users, setUsers] = useState<any[]>([]);
  // TODO: Replace with API call to fetch memberships
  const [memberships, setMemberships] = useState<any[]>([]);
  const [modal, setModal] = useState<"club" | "community" | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") setIsAuthed(true);
  }, []);

  const handleLogin = useCallback(() => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsAuthed(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }, [password]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthed(false);
    setPassword("");
  }, []);

  // Search results
  const searchResults = searchQuery.trim().length > 1 ? {
    users: users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())),
    clubs: clubs.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    communities: communities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
  } : null;

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <PublicPageGrid className="min-h-screen bg-brutal-gray flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_#1d2cf3] w-full max-w-md p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-brutal-blue text-white p-3 border-2 border-black">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Admin Access</h1>
          </div>
          <div className="mb-6">
            <label className="font-black uppercase text-sm block mb-2">Password</label>
            <input
              type="password"
              className="w-full border-4 border-black p-4 font-bold text-lg focus:outline-none focus:border-brutal-blue"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          {error && (
            <div className="mb-6 bg-red-500 text-white p-3 border-4 border-black font-black uppercase text-sm">
              {error}
            </div>
          )}
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-4 font-black uppercase text-lg border-4 border-black shadow-[6px_6px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Enter →
          </button>
        </div>
      </PublicPageGrid>
    );
  }

  const tabs = ["overview", "opportunities", "referrals", "earnings", "users", "clubs", "memberships", "search"];

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brutal-gray">
      {modal && (
        <CreateEntityModal
          type={modal}
          onClose={() => setModal(null)}
          onSave={(data) => {
            const newEntry = { id: String(Date.now()), ...data, members: 0, posts: 0 };
            if (modal === "club") setClubs(c => [...c, newEntry]);
            else setCommunities(c => [...c, newEntry]);
          }}
        />
      )}

      {/* Admin Header */}
      <div className="bg-white border-b-8 border-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-brutal-blue text-white p-2 border-2 border-black">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter">OCC Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-black uppercase text-sm whitespace-nowrap border-t-4 border-x-4 border-black transition-colors ${
                activeTab === tab ? "bg-brutal-blue text-white" : "bg-brutal-gray hover:bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <StatCard icon={Users} label="Total Users" value="1,240" accent />
              <StatCard icon={IndianRupee} label="Total Earnings" value="₹2,35,000" accent />
              <StatCard icon={Trophy} label="Opportunities" value="48" accent />
              <StatCard icon={Share2} label="Referrals" value="312" accent />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SectionPanel title="Recent Referrals">
                <div className="space-y-3">
                  {referrals.slice(0, 3).map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 border-2 border-black bg-brutal-gray">
                      <div>
                        <p className="font-black">{r.user}</p>
                        <p className="font-bold text-sm text-gray-600">{r.opportunity}</p>
                      </div>
                      <Badge text={r.status} color={statusColor(r.status)} />
                    </div>
                  ))}
                </div>
              </SectionPanel>
              <SectionPanel title="Pending Earnings">
                <div className="space-y-3">
                  {earnings.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-3 border-2 border-black bg-brutal-gray">
                      <div>
                        <p className="font-black">{e.user}</p>
                        <p className="font-bold text-sm text-gray-600">{e.source}</p>
                      </div>
                      <span className="font-black text-brutal-blue">{e.amount}</span>
                    </div>
                  ))}
                </div>
              </SectionPanel>
            </div>
          </>
        )}

        {/* ── Opportunities ── */}
        {activeTab === "opportunities" && (
          <SectionPanel title="Opportunity Management">
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setOpportunities(o => [...o, { id: String(Date.now()), title: "New Opportunity", vertical: "Hiring", reward: "₹0", status: "Active" }])}
                className="flex items-center gap-2 bg-black text-white px-5 py-3 font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Opportunity
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-4 border-black">
                <thead>
                  <tr className="bg-black text-white">
                    {["Title", "Vertical", "Reward", "Status", "Actions"].map(h => (
                      <th key={h} className="p-4 font-black uppercase text-left text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((op, i) => (
                    <tr key={op.id} className={i % 2 === 0 ? "bg-white" : "bg-brutal-gray"}>
                      <td className="p-4 font-black">{op.title}</td>
                      <td className="p-4 font-bold">{op.vertical}</td>
                      <td className="p-4 font-black text-brutal-blue">{op.reward}</td>
                      <td className="p-4"><Badge text={op.status} color={statusColor(op.status)} /></td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-2 border-2 border-black hover:bg-brutal-blue hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setOpportunities(o => o.filter(x => x.id !== op.id))} className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionPanel>
        )}

        {/* ── Referrals ── */}
        {activeTab === "referrals" && (
          <SectionPanel title="Referral Tracking">
            <div className="overflow-x-auto">
              <table className="w-full border-4 border-black">
                <thead>
                  <tr className="bg-black text-white">
                    {["User", "Opportunity", "Type", "Status", "Reward", "Update"].map(h => (
                      <th key={h} className="p-4 font-black uppercase text-left text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, i) => (
                    <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-brutal-gray"}>
                      <td className="p-4 font-black">{r.user}</td>
                      <td className="p-4 font-bold text-sm">{r.opportunity}</td>
                      <td className="p-4"><Badge text={r.type.replace("_", " ")} color="blue" /></td>
                      <td className="p-4"><Badge text={r.status} color={statusColor(r.status)} /></td>
                      <td className="p-4 font-black text-brutal-blue">{r.reward}</td>
                      <td className="p-4">
                        <select
                          className="border-2 border-black p-2 font-bold text-sm focus:outline-none focus:border-brutal-blue bg-white"
                          value={r.status}
                          onChange={e => setReferrals(prev => prev.map(x => x.id === r.id ? { ...x, status: e.target.value } : x))}
                        >
                          {REFERRAL_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionPanel>
        )}

        {/* ── Earnings ── */}
        {activeTab === "earnings" && (
          <SectionPanel title="Earnings Approval">
            <div className="overflow-x-auto">
              <table className="w-full border-4 border-black">
                <thead>
                  <tr className="bg-black text-white">
                    {["User", "Amount", "Source", "Status", "Actions"].map(h => (
                      <th key={h} className="p-4 font-black uppercase text-left text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((e, i) => (
                    <tr key={e.id} className={i % 2 === 0 ? "bg-white" : "bg-brutal-gray"}>
                      <td className="p-4 font-black">{e.user}</td>
                      <td className="p-4 font-black text-brutal-blue">{e.amount}</td>
                      <td className="p-4 font-bold">{e.source}</td>
                      <td className="p-4"><Badge text={e.status} color={e.status === "Approved" ? "green" : e.status === "Rejected" ? "red" : "yellow"} /></td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => setEarnings(prev => prev.map(x => x.id === e.id ? { ...x, status: "Approved" } : x))} className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white border-2 border-black font-black uppercase text-xs hover:opacity-80 transition-opacity">
                            <CheckCircle className="w-3 h-3" /> Approve
                          </button>
                          <button onClick={() => setEarnings(prev => prev.map(x => x.id === e.id ? { ...x, status: "Rejected" } : x))} className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white border-2 border-black font-black uppercase text-xs hover:opacity-80 transition-opacity">
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionPanel>
        )}

        {/* ── Users ── */}
        {activeTab === "users" && (
          <SectionPanel title="User Management">
            <div className="overflow-x-auto">
              <table className="w-full border-4 border-black">
                <thead>
                  <tr className="bg-black text-white">
                    {["User", "Email", "Earnings", "Referrals", "Actions"].map(h => (
                      <th key={h} className="p-4 font-black uppercase text-left text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className={i % 2 === 0 ? "bg-white" : "bg-brutal-gray"}>
                      <td className="p-4 font-black">{u.name}</td>
                      <td className="p-4 font-bold text-sm text-gray-600">{u.email}</td>
                      <td className="p-4 font-black text-brutal-blue">₹{u.earnings.toLocaleString()}</td>
                      <td className="p-4 font-black">{u.referrals}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1 px-3 py-2 border-2 border-black font-black uppercase text-xs hover:bg-black hover:text-white transition-colors">
                            <Eye className="w-3 h-3" /> View
                          </button>
                          <button className="flex items-center gap-1 px-3 py-2 border-2 border-black font-black uppercase text-xs hover:bg-red-500 hover:text-white transition-colors">
                            Ban
                          </button>
                          <button className="flex items-center gap-1 px-3 py-2 border-2 border-black font-black uppercase text-xs hover:bg-brutal-blue hover:text-white transition-colors">
                            <Shield className="w-3 h-3" /> Admin
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionPanel>
        )}

        {/* ── Clubs ── */}
        {activeTab === "clubs" && (
          <>
            <div className="flex gap-4 mb-8">
              <button onClick={() => setModal("club")} className="flex items-center gap-2 bg-black text-white px-6 py-3 font-black uppercase border-4 border-black shadow-[6px_6px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                <Plus className="w-5 h-5" /> Create Club
              </button>
              <button onClick={() => setModal("community")} className="flex items-center gap-2 bg-white text-black px-6 py-3 font-black uppercase border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                <Building2 className="w-5 h-5" /> Create Community
              </button>
            </div>

            <SectionPanel title="Clubs">
              <div className="overflow-x-auto">
                <table className="w-full border-4 border-black">
                  <thead>
                    <tr className="bg-black text-white">
                      {["Club", "Category", "Members", "Posts", "Actions"].map(h => (
                        <th key={h} className="p-4 font-black uppercase text-left text-sm">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clubs.map((c, i) => (
                      <tr key={c.id} className={i % 2 === 0 ? "bg-white" : "bg-brutal-gray"}>
                        <td className="p-4 font-black">{c.name}</td>
                        <td className="p-4 font-bold">{c.category}</td>
                        <td className="p-4 font-black">{c.members}</td>
                        <td className="p-4 font-black">{c.posts}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="p-2 border-2 border-black hover:bg-brutal-blue hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                            <button className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => setClubs(prev => prev.filter(x => x.id !== c.id))} className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionPanel>

            <SectionPanel title="Communities">
              <div className="overflow-x-auto">
                <table className="w-full border-4 border-black">
                  <thead>
                    <tr className="bg-black text-white">
                      {["Community", "Category", "Members", "Posts", "Actions"].map(h => (
                        <th key={h} className="p-4 font-black uppercase text-left text-sm">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {communities.map((c, i) => (
                      <tr key={c.id} className={i % 2 === 0 ? "bg-white" : "bg-brutal-gray"}>
                        <td className="p-4 font-black">{c.name}</td>
                        <td className="p-4 font-bold">{c.category}</td>
                        <td className="p-4 font-black">{c.members}</td>
                        <td className="p-4 font-black">{c.posts}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="p-2 border-2 border-black hover:bg-brutal-blue hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => setCommunities(prev => prev.filter(x => x.id !== c.id))} className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionPanel>
          </>
        )}

        {/* ── Memberships ── */}
        {activeTab === "memberships" && (
          <SectionPanel title="User Memberships">
            <div className="overflow-x-auto">
              <table className="w-full border-4 border-black">
                <thead>
                  <tr className="bg-black text-white">
                    {["User", "Email", "Clubs", "Communities", "Actions"].map(h => (
                      <th key={h} className="p-4 font-black uppercase text-left text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {memberships.map((m, i) => (
                    <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-brutal-gray"}>
                      <td className="p-4 font-black">{m.user}</td>
                      <td className="p-4 font-bold text-sm text-gray-600">{m.email}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {m.clubs.length > 0 ? m.clubs.map((c: string) => <Badge key={c} text={c} color="blue" />) : <span className="font-bold text-gray-400 text-sm">None</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {m.communities.length > 0 ? m.communities.map((c: string) => <Badge key={c} text={c} color="black" />) : <span className="font-bold text-gray-400 text-sm">None</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1 px-3 py-2 border-2 border-black font-black uppercase text-xs hover:bg-black hover:text-white transition-colors">
                            <Eye className="w-3 h-3" /> View
                          </button>
                          <button className="flex items-center gap-1 px-3 py-2 border-2 border-black font-black uppercase text-xs hover:bg-red-500 hover:text-white transition-colors">
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionPanel>
        )}

        {/* ── Search ── */}
        {activeTab === "search" && (
          <SectionPanel title="Global Search">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                className="w-full border-4 border-black pl-12 pr-4 py-4 font-bold text-lg focus:outline-none focus:border-brutal-blue"
                placeholder="Search users, clubs, communities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            {searchResults ? (
              <div className="space-y-8">
                {/* Users */}
                <div>
                  <h3 className="font-black uppercase text-sm tracking-widest mb-3 text-gray-500">Users ({searchResults.users.length})</h3>
                  {searchResults.users.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.users.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-4 border-2 border-black bg-brutal-gray hover:border-brutal-blue cursor-pointer transition-colors">
                          <div>
                            <p className="font-black">{u.name}</p>
                            <p className="font-bold text-sm text-gray-600">{u.email}</p>
                          </div>
                          <Badge text="User" color="black" />
                        </div>
                      ))}
                    </div>
                  ) : <p className="font-bold text-gray-400 text-sm">No users found</p>}
                </div>

                {/* Clubs */}
                <div>
                  <h3 className="font-black uppercase text-sm tracking-widest mb-3 text-gray-500">Clubs ({searchResults.clubs.length})</h3>
                  {searchResults.clubs.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.clubs.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-4 border-2 border-black bg-brutal-gray hover:border-brutal-blue cursor-pointer transition-colors">
                          <div>
                            <p className="font-black">{c.name}</p>
                            <p className="font-bold text-sm text-gray-600">{c.category} · {c.members} members</p>
                          </div>
                          <Badge text="Club" color="blue" />
                        </div>
                      ))}
                    </div>
                  ) : <p className="font-bold text-gray-400 text-sm">No clubs found</p>}
                </div>

                {/* Communities */}
                <div>
                  <h3 className="font-black uppercase text-sm tracking-widest mb-3 text-gray-500">Communities ({searchResults.communities.length})</h3>
                  {searchResults.communities.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.communities.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-4 border-2 border-black bg-brutal-gray hover:border-brutal-blue cursor-pointer transition-colors">
                          <div>
                            <p className="font-black">{c.name}</p>
                            <p className="font-bold text-sm text-gray-600">{c.category} · {c.members} members</p>
                          </div>
                          <Badge text="Community" color="black" />
                        </div>
                      ))}
                    </div>
                  ) : <p className="font-bold text-gray-400 text-sm">No communities found</p>}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-black uppercase text-gray-400">Start typing to search across the platform</p>
              </div>
            )}
          </SectionPanel>
        )}

      </div>
    </div>
  );
}
