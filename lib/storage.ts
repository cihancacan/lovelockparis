import { supabase } from './supabase';

export async function uploadMediaFile(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('lock-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('lock-media')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

export async function deleteMediaFile(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('lock-media')
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

export function getFileTypeFromMime(mimeType: string): 'photo' | 'video' | 'audio' | null {
  if (mimeType.startsWith('image/')) return 'photo';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return null;
}

export function validateFileSize(file: File): boolean {
  const maxSize = 50 * 1024 * 1024;
  return file.size <= maxSize;
}

export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'video/mp4',
    'audio/mpeg',
    'audio/mp3',
  ];
  return allowedTypes.includes(file.type);
}
