"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Bell, Palette, Shield, User, Save } from "lucide-react";
import Link from "next/link";
import SiteContainer from "@/components/SiteContainer";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "light" as "light" | "dark",
    notifications: {
      posts: true,
      comments: true,
      clubUpdates: true,
      events: false
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showUniversity: true
    }
  });

  const handleSaveSettings = useCallback(() => {
    // In a real app, this would save to backend
    localStorage.setItem("occ-settings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  }, [settings]);

  return (
    <div className="min-h-screen bg-brutal-gray">
      {/* Header */}
      <div className="bg-white text-black p-12 md:p-24 border-b-8 border-black relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-brutal-blue opacity-5 -skew-x-12 translate-x-1/2"></div>
        <SiteContainer className="relative z-10">
          <Link 
            href="/profile"
            className="inline-flex items-center gap-2 text-brutal-blue font-black uppercase tracking-widest mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Profile
          </Link>
          
          <div className="flex items-center gap-4 text-brutal-blue font-black uppercase tracking-widest mb-6">
            <Shield className="w-6 h-6" /> Account Settings
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter mb-8">
            Settings
          </h1>
          
          <p className="text-2xl font-black max-w-xl border-l-8 border-black pl-8 bg-brutal-gray p-6 shadow-[6px_6px_0_0_#000]">
            Customize your OCC experience and manage your preferences.
          </p>
        </SiteContainer>
      </div>

      {/* Content */}
      <SiteContainer size="narrow" className="py-20">
        <div className="space-y-12">
          {/* Theme Settings */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-4">
              <Palette className="w-8 h-8" />
              <h2 className="text-3xl font-black uppercase tracking-tighter">Theme Preferences</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={settings.theme === "light"}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value as "light" | "dark" })}
                  className="occ-check"
                />
                <span className="font-bold text-lg">Light Mode</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={settings.theme === "dark"}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value as "light" | "dark" })}
                  className="occ-check"
                />
                <span className="font-bold text-lg">Dark Mode (Coming Soon)</span>
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-4">
              <Bell className="w-8 h-8" />
              <h2 className="text-3xl font-black uppercase tracking-tighter">Notifications</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.posts}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, posts: e.target.checked }
                  })}
                  className="occ-check"
                />
                <span className="font-bold text-lg">New Posts in My Clubs</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.comments}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, comments: e.target.checked }
                  })}
                  className="occ-check"
                />
                <span className="font-bold text-lg">Comments on My Posts</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.clubUpdates}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, clubUpdates: e.target.checked }
                  })}
                  className="occ-check"
                />
                <span className="font-bold text-lg">Club Updates & Announcements</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.events}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, events: e.target.checked }
                  })}
                  className="occ-check"
                />
                <span className="font-bold text-lg">Event Reminders</span>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-4">
              <User className="w-8 h-8" />
              <h2 className="text-3xl font-black uppercase tracking-tighter">Privacy</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.profileVisible}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, profileVisible: e.target.checked }
                  })}
                  className="occ-check"
                />
                <span className="font-bold text-lg">Make Profile Visible to Other Students</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.showEmail}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, showEmail: e.target.checked }
                  })}
                  className="occ-check"
                />
                <span className="font-bold text-lg">Show Email Address on Profile</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.showUniversity}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, showUniversity: e.target.checked }
                  })}
                  className="occ-check"
                />
                <span className="font-bold text-lg">Show University on Profile</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button
              onClick={handleSaveSettings}
              className="bg-black text-white px-12 py-6 font-black uppercase text-2xl border-4 border-black shadow-[10px_10px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-4 mx-auto"
            >
              <Save className="w-8 h-8" />
              Save Settings
            </button>
          </div>
        </div>
      </SiteContainer>
    </div>
  );
}
