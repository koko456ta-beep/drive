import { Award, AppUser, ActivityLog, AcademicYear, SystemSettings, DepartmentId } from '../types';
import { INITIAL_AWARDS, INITIAL_USERS, INITIAL_LOGS, INITIAL_ACADEMIC_YEARS, INITIAL_SETTINGS } from '../data/mockData';

const STORAGE_KEYS = {
  AWARDS: 'school_awards_data_v1',
  USERS: 'school_awards_users_v1',
  LOGS: 'school_awards_logs_v1',
  YEARS: 'school_awards_years_v1',
  SETTINGS: 'school_awards_settings_v1',
  CURRENT_USER: 'school_awards_curr_user_v1'
};

// Firestore Error Handler Types required by Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = getStoredCurrentUser();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: true,
      isAnonymous: false,
      tenantId: null,
      providerInfo: [
        {
          providerId: 'password',
          email: currentUser?.email || null
        }
      ]
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Storage Helpers
export function getStoredAwards(): Award[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AWARDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AWARDS, JSON.stringify(INITIAL_AWARDS));
      return INITIAL_AWARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    localStorage.setItem(STORAGE_KEYS.AWARDS, JSON.stringify(INITIAL_AWARDS));
    return INITIAL_AWARDS;
  } catch {
    return INITIAL_AWARDS;
  }
}

export function saveStoredAwards(awards: Award[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AWARDS, JSON.stringify(Array.isArray(awards) ? awards : []));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'awards');
  }
}

export function getStoredUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(Array.isArray(users) ? users : []));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'users');
  }
}

export function getStoredLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  } catch {
    return INITIAL_LOGS;
  }
}

export function addActivityLog(
  user: AppUser,
  action: ActivityLog['action'],
  details: string,
  recordId?: string,
  recordTitle?: string
): ActivityLog {
  const logs = getStoredLogs();
  const newLog: ActivityLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    userId: user?.uid || 'system',
    userName: user?.displayName || 'เจ้าหน้าที่',
    userRole: user?.role || 'academic_admin',
    department: user?.department || 'all',
    action,
    recordId,
    recordTitle,
    details,
    timestamp: new Date().toISOString()
  };
  
  const updated = [newLog, ...(Array.isArray(logs) ? logs : [])];
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'activityLogs');
  }
  return newLog;
}

export function getStoredAcademicYears(): AcademicYear[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.YEARS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.YEARS, JSON.stringify(INITIAL_ACADEMIC_YEARS));
      return INITIAL_ACADEMIC_YEARS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    localStorage.setItem(STORAGE_KEYS.YEARS, JSON.stringify(INITIAL_ACADEMIC_YEARS));
    return INITIAL_ACADEMIC_YEARS;
  } catch {
    return INITIAL_ACADEMIC_YEARS;
  }
}

export function saveStoredAcademicYears(years: AcademicYear[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.YEARS, JSON.stringify(Array.isArray(years) ? years : []));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'academicYears');
  }
}

export function getStoredSettings(): SystemSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { ...INITIAL_SETTINGS, ...parsed };
    }
    return INITIAL_SETTINGS;
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveStoredSettings(settings: SystemSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/system');
  }
}

export function getStoredCurrentUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredCurrentUser(user: AppUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (err) {
    console.error('Failed to set current user', err);
  }
}

export function resetToFactoryDefault(): void {
  localStorage.setItem(STORAGE_KEYS.AWARDS, JSON.stringify(INITIAL_AWARDS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
  localStorage.setItem(STORAGE_KEYS.YEARS, JSON.stringify(INITIAL_ACADEMIC_YEARS));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
}

// Convenience Wrappers for App Components
export const getAwards = getStoredAwards;
export const getUsers = getStoredUsers;
export const getActivityLogs = getStoredLogs;
export const getSystemSettings = getStoredSettings;
export const saveSystemSettings = saveStoredSettings;

export function saveAward(award: Award): void {
  const current = getStoredAwards();
  const index = current.findIndex(a => a.id === award.id);
  let updated: Award[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = award;
  } else {
    updated = [award, ...current];
  }
  saveStoredAwards(updated);
}

export function deleteAward(awardId: string): void {
  const current = getStoredAwards();
  const updated = current.map(a => a.id === awardId ? { ...a, deleted: true, updatedAt: new Date().toISOString() } : a);
  saveStoredAwards(updated);
}

export function saveUser(user: AppUser): void {
  const current = getStoredUsers();
  saveStoredUsers([user, ...current]);
}

export function updateUser(user: AppUser): void {
  const current = getStoredUsers();
  const updated = current.map(u => u.uid === user.uid ? user : u);
  saveStoredUsers(updated);
}

export function logActivity(params: {
  userId: string;
  userName: string;
  userRole: string;
  department: DepartmentId | 'all';
  action: ActivityLog['action'];
  recordId?: string;
  recordTitle?: string;
  details: string;
}): void {
  const current = getStoredLogs();
  const newLog: ActivityLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toISOString(),
    ...params
  };
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([newLog, ...current]));
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'activityLogs');
  }
}

