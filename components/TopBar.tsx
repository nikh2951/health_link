
import React from 'react';

interface TopBarProps {
  userName: string;
  userEmail: string;
  profilePic: string | null;
  notificationCount: number;
  onProfileClick: () => void;
}

export const TopBar = ({ userName, userEmail, profilePic, notificationCount, onProfileClick }: TopBarProps) => {
  return (
    <div className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/80">
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-[#004D40]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#004D40] focus:bg-white transition-all outline-none"
            placeholder="Search symptoms, doctors, or records..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {notificationCount > 0 && (
              <span className="absolute top-2 right-2.5 w-5 h-5 bg-[#004D40] border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        <div className="h-10 w-px bg-slate-100"></div>

        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 leading-tight">{userName}</p>
            <p className="text-[11px] text-slate-400">{userEmail}</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-[#004D40] transition-all bg-slate-100 flex items-center justify-center">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
