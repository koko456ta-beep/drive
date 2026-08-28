import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles, 
  Building2, 
  Users, 
  Coins, 
  Key, 
  User, 
  Lock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { AppUser, DepartmentId } from '../types';
import { INITIAL_USERS, DEPARTMENTS } from '../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AppUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const found = INITIAL_USERS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() || 
           u.email.toLowerCase() === username.trim().toLowerCase()
    );

    if (found) {
      onLogin(found);
      onClose();
    } else {
      setError('ไม่พบบัญชีผู้ใช้นี้ (ทดลองกดเลือกบัญชีสาธิตด้านล่างได้ทันที)');
    }
  };

  const handleSelectQuickAccount = (user: AppUser) => {
    onLogin(user);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                เข้าสู่ระบบเจ้าหน้าที่
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                สำหรับผู้ดูแลระบบและคณะทำงานทั้ง 5 ฝ่าย
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Quick Demo One-Click Logins */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                เลือกสิทธิ์เข้าใช้งานทันที (One-Click Demo)
              </span>
              <span className="text-[11px] text-blue-600 font-semibold">
                กดเพื่อเข้าใช้งาน
              </span>
            </div>

            <div className="space-y-2">
              {/* Super Admin */}
              <button
                id="login-quick-super-admin"
                onClick={() => handleSelectQuickAccount(INITIAL_USERS[0])}
                className="w-full text-left p-3 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    SA
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">
                      Super Admin (ผู้อำนวยการ / ผู้ดูแลสูงสุด)
                    </p>
                    <p className="text-[11px] text-indigo-700">
                      จัดการได้ทุกฝ่าย, เพิ่มผู้ใช้, อนุมัติผลงาน, ดูรายงานรวม
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* 5 Department Admins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {INITIAL_USERS.slice(1).map((usr) => {
                  const dept = DEPARTMENTS[usr.department];
                  return (
                    <button
                      key={usr.uid}
                      id={`login-quick-${usr.username}`}
                      onClick={() => handleSelectQuickAccount(usr)}
                      className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-white transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: dept?.color }} 
                        />
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 text-xs truncate">
                            Admin {dept?.shortName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {usr.displayName.split(' ')[0]}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-4 text-xs text-slate-400">หรือ กรอกชื่อผู้ใช้</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} className="space-y-3.5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ชื่อผู้ใช้งาน หรือ อีเมล
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="เช่น super_admin หรือ academic_admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบ</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
