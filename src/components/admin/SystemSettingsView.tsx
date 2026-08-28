import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  Building2, 
  HardDrive, 
  Palette, 
  ShieldCheck, 
  AlertTriangle,
  FileJson
} from 'lucide-react';
import { SystemSettings, Award } from '../../types';
import { exportFullBackupJSON } from '../../lib/exportUtils';
import { resetToFactoryDefault } from '../../lib/storage';
import { INITIAL_SETTINGS } from '../../data/mockData';

interface SystemSettingsViewProps {
  settings?: SystemSettings;
  onSaveSettings: (newSettings: SystemSettings) => void;
  awards?: Award[];
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  settings = INITIAL_SETTINGS,
  onSaveSettings,
  awards = []
}) => {
  const [formData, setFormData] = useState<SystemSettings>(settings || INITIAL_SETTINGS);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    exportFullBackupJSON({
      awards,
      settings: formData,
      timestamp: new Date().toISOString()
    });
  };

  const handleResetFactory = () => {
    resetToFactoryDefault();
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              ตั้งค่าระบบและข้อมูลโรงเรียน (System Settings)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              Super Admin Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ปรับแต่งข้อมูลเอกลักษณ์สถานศึกษา การเชื่อมต่อ Google Drive และนโยบายความปลอดภัย
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>บันทึกการตั้งค่าสำเร็จ</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: School Identity */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>1. ข้อมูลอัตลักษณ์สถานศึกษา (School Branding)</span>
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อสถานศึกษา / โรงเรียน
              </label>
              <input
                type="text"
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                คำขวัญ / ปรัชญาสถานศึกษา
              </label>
              <input
                type="text"
                value={formData.schoolMotto}
                onChange={(e) => setFormData({ ...formData, schoolMotto: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  หมายเลขโทรศัพท์
                </label>
                <input
                  type="text"
                  value={formData.schoolPhone}
                  onChange={(e) => setFormData({ ...formData, schoolPhone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  อีเมลทางการ
                </label>
                <input
                  type="email"
                  value={formData.schoolEmail}
                  onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ที่อยู่สถานศึกษา
              </label>
              <input
                type="text"
                value={formData.schoolAddress}
                onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Google Drive & System Policies */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>2. การจัดเก็บ Google Drive และนโยบายระบบ</span>
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อโฟลเดอร์หลักบน Google Drive (Root Folder Name)
              </label>
              <input
                type="text"
                value={formData.driveRootFolderName}
                onChange={(e) => setFormData({ ...formData, driveRootFolderName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                ระบบจะสร้างโฟลเดอร์ย่อยตาม 5 ฝ่ายโดยอัตโนมัติ เช่น ผลงานโรงเรียน/วิชาการ/เกียรติบัตร
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.requireSuperAdminApproval}
                  onChange={(e) => setFormData({ ...formData, requireSuperAdminApproval: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    กำหนดให้ผลงานใหม่ต้องผ่านการอนุมัติจาก Super Admin ก่อนเผยแพร่
                  </p>
                  <p className="text-[10px] text-slate-500">
                    หากเปิดใช้งาน เมื่อ Admin ฝ่ายบันทึกผลงาน จะอยู่ในสถานะ "รอการตรวจสอบ"
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.defaultAllowDownload}
                  onChange={(e) => setFormData({ ...formData, defaultAllowDownload: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    อนุญาตให้บุคคลทั่วไปดาวน์โหลดไฟล์เกียรติบัตรต้นฉบับได้โดยค่าเริ่มต้น
                  </p>
                  <p className="text-[10px] text-slate-500">
                    ผู้ใช้สามารถกดเปิดไฟล์ใน Google Drive และดาวน์โหลดได้
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่าระบบ</span>
          </button>
        </div>
      </form>

      {/* SECTION 3: Backup & Restore */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileJson className="w-4 h-4 text-purple-600" />
          <span>3. สำรองข้อมูลและกู้คืน (Backup & Restore)</span>
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed">
          สามารถดาวน์โหลดสำเนาฐานข้อมูลผลงานทั้งหมดและการตั้งค่าเป็นไฟล์ JSON เพื่อความปลอดภัยในการจัดเก็บ
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลดไฟล์สำรองข้อมูล JSON</span>
          </button>

          <button
            onClick={() => setResetConfirmOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>รีเซ็ตกลับเป็นค่าเริ่มต้นโรงเรียนตัวอย่าง</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                ยืนยันการรีเซ็ตข้อมูลเป็นค่าโรงเรียนตัวอย่าง?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ข้อมูลผลงานและรางวัลที่เพิ่มใหม่จะถูกแทนที่ด้วยข้อมูลผลงานเริ่มต้น 14 รายการ
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleResetFactory}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                ยืนยันรีเซ็ต
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
