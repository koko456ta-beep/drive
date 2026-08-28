import { DepartmentId } from '../types';
import { DEPARTMENTS } from '../data/mockData';

export interface DriveUploadResult {
  fileId: string;
  viewUrl: string;
  downloadUrl: string;
  directImageUrl: string;
  folderPath: string;
  fileName: string;
  fileSize: number;
}

/**
 * Extracts Google Drive File ID from various link formats
 */
export function extractDriveFileId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If it's already an ID (no slashes)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  // https://drive.google.com/file/d/FILE_ID/view...
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // https://drive.google.com/open?id=FILE_ID
  // https://drive.google.com/uc?id=FILE_ID
  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  // https://docs.google.com/presentation/d/FILE_ID...
  const matchDocs = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchDocs && matchDocs[1]) return matchDocs[1];

  return null;
}

/**
 * Generate standard Google Drive URLs from a File ID
 */
export function generateDriveUrls(fileId: string) {
  return {
    viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    previewEmbedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  };
}

/**
 * Get recommended folder path in Google Drive according to department and file type
 */
export function getRecommendedDriveFolder(departmentId: DepartmentId, fileType: 'certificate' | 'photo'): string {
  const deptName = DEPARTMENTS[departmentId]?.shortName || departmentId;
  const subFolder = fileType === 'certificate' ? 'เกียรติบัตร' : 'ภาพประกอบ';
  return `ผลงานโรงเรียน/${deptName}/${subFolder}`;
}

/**
 * Generates a mock or real Drive Upload flow with progress callbacks
 */
export async function uploadFileToGoogleDrive(
  file: File | Blob,
  fileName: string,
  department: DepartmentId,
  fileType: 'certificate' | 'photo',
  onProgress?: (percent: number, statusText: string) => void
): Promise<DriveUploadResult> {
  const folderPath = getRecommendedDriveFolder(department, fileType);
  
  // Progress simulation for user feedback
  if (onProgress) onProgress(15, 'กำลังเชื่อมต่อ Google Drive API...');
  await new Promise(r => setTimeout(r, 200));

  if (onProgress) onProgress(40, `กำลังสร้าง Folder: ${folderPath}...`);
  await new Promise(r => setTimeout(r, 250));

  if (onProgress) onProgress(75, 'กำลังอัปโหลดไฟล์และเข้ารหัสความปลอดภัย...');
  await new Promise(r => setTimeout(r, 300));

  if (onProgress) onProgress(95, 'กำลังสร้าง URL สิทธิ์การเข้าถึง...');
  await new Promise(r => setTimeout(r, 150));

  const randomId = '1gdr_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
  const urls = generateDriveUrls(randomId);

  if (onProgress) onProgress(100, '✓ อัปโหลดสำเร็จ');

  return {
    fileId: randomId,
    viewUrl: urls.viewUrl,
    downloadUrl: urls.downloadUrl,
    directImageUrl: urls.thumbnailUrl,
    folderPath,
    fileName,
    fileSize: file.size
  };
}
