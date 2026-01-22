'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

// =====================================================
// TYPES
// =====================================================

export interface AttachmentData {
    url: string;
    name: string;
    size: string;
    type: string;
}

export interface UploadProgress {
    uploading: boolean;
    progress: number;
    error: string | null;
}

// Allowed file types based on bucket configuration
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOC_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Format file size to human readable string
 */
function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get proper MIME type for file extension
 */
function getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const mimeMap: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return mimeMap[ext] || 'application/octet-stream';
}

/**
 * Check if file is an image
 */
export function isImageFile(type: string): boolean {
    return ALLOWED_IMAGE_TYPES.includes(type);
}

// =====================================================
// HOOK: useChatAttachments
// =====================================================

/**
 * Hook for uploading chat attachments to Supabase Storage
 * 
 * @returns Object with upload functions and states
 */
export function useChatAttachments() {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    /**
     * Validate file before upload
     */
    const validateFile = useCallback((file: File): string | null => {
        // Check file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return `File type not allowed. Allowed: Images (JPEG, PNG, GIF, WebP), PDF, Word documents`;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`;
        }

        return null; // No errors
    }, []);

    /**
     * Upload a file to Supabase Storage
     */
    const uploadFile = useCallback(
        async (file: File, conversationId: string): Promise<AttachmentData | null> => {
            if (!user) {
                setError('User must be authenticated');
                return null;
            }

            // Validate file
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return null;
            }

            try {
                setUploading(true);
                setProgress(0);
                setError(null);

                // Generate unique file path
                const timestamp = Date.now();
                const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
                const filePath = `${conversationId}/${user.id}/${timestamp}.${fileExt}`;

                // Get proper MIME type
                const contentType = getMimeType(file.name);

                // Upload to Supabase Storage
                const { data, error: uploadError } = await supabase.storage
                    .from('chat-attachments')
                    .upload(filePath, file, {
                        contentType,
                        upsert: false,
                    });

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    throw new Error(uploadError.message);
                }

                setProgress(100);

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('chat-attachments')
                    .getPublicUrl(data.path);

                const attachmentData: AttachmentData = {
                    url: urlData.publicUrl,
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: contentType,
                };

                return attachmentData;
            } catch (err: any) {
                console.error('Error uploading attachment:', err);
                setError(err.message || 'Failed to upload file');
                return null;
            } finally {
                setUploading(false);
            }
        },
        [user, supabase, validateFile]
    );

    /**
     * Create a preview URL for a file (for local display before upload)
     */
    const createPreviewUrl = useCallback((file: File): string | null => {
        if (!isImageFile(file.type)) {
            return null; // Only create preview for images
        }
        return URL.createObjectURL(file);
    }, []);

    /**
     * Revoke a preview URL to free memory
     */
    const revokePreviewUrl = useCallback((url: string) => {
        URL.revokeObjectURL(url);
    }, []);

    return {
        uploadFile,
        createPreviewUrl,
        revokePreviewUrl,
        validateFile,
        uploading,
        progress,
        error,
        clearError: () => setError(null),
    };
}
