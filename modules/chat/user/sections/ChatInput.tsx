'use client';

import React, { useState, useRef } from 'react';
import { PlusCircle, Send, Smile, ShieldCheck, X, Image, FileText, Loader2 } from 'lucide-react';
import { useChatAttachments, isImageFile, AttachmentData } from '@/hooks/useChatAttachments';

interface ChatInputProps {
  onSendMessage: (text: string, attachment?: AttachmentData) => void;
  disabled?: boolean;
  paymentCompleted?: boolean;
  conversationId?: string;
}

interface SelectedFile {
  file: File;
  previewUrl: string | null;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  paymentCompleted = false,
  conversationId
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadFile,
    createPreviewUrl,
    revokePreviewUrl,
    validateFile,
    uploading,
    error: uploadError,
    clearError
  } = useChatAttachments();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    // Create preview for images
    const previewUrl = createPreviewUrl(file);

    setSelectedFile({ file, previewUrl });
    clearError();

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    if (selectedFile?.previewUrl) {
      revokePreviewUrl(selectedFile.previewUrl);
    }
    setSelectedFile(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasMessage = message.trim();
    const hasFile = selectedFile !== null;

    if ((!hasMessage && !hasFile) || disabled || uploading) return;

    let attachmentData: AttachmentData | undefined;

    // Upload file if selected
    if (hasFile && conversationId) {
      const uploadResult = await uploadFile(selectedFile.file, conversationId);
      if (!uploadResult) {
        // Upload failed, error is set in the hook
        return;
      }
      attachmentData = uploadResult;
    }

    // Send message
    onSendMessage(hasMessage ? message : '📎 Sent an attachment', attachmentData);

    // Clear state
    setMessage('');
    handleRemoveFile();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const isDisabled = disabled || uploading;

  return (
    <div className="px-3 py-2 md:px-3 md:py-2 lg:px-4 lg:py-2.5 bg-white border-t border-gray-100 flex-shrink-0">
      {/* Payment Completed Badge */}
      {paymentCompleted && (
        <div className="mb-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <p className="text-xs text-green-700">
            ✓ Payment completed - You can now share contact information
          </p>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="mb-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-xs text-red-700">{uploadError}</p>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mb-2 p-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
          {/* Preview */}
          {selectedFile.previewUrl ? (
            <img
              src={selectedFile.previewUrl}
              alt="Preview"
              className="w-12 h-12 object-cover rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-500" />
            </div>
          )}

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.file.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.file.size / 1024).toFixed(1)} KB
              {isImageFile(selectedFile.file.type) && ' • Image'}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemoveFile}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form className="relative flex items-center gap-2 md:gap-2 lg:gap-3" onSubmit={handleSubmit}>
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Attach File Button */}
        <button
          className="p-2 md:p-2 text-gray-400 hover:text-[#7C2A2A] hover:bg-gray-50 active:bg-gray-100 rounded-full transition-colors flex-shrink-0 disabled:opacity-50"
          type="button"
          title="Attach file"
          onClick={openFilePicker}
          disabled={isDisabled}
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6" />
          )}
        </button>

        <div className="relative flex-grow">
          <input
            className="w-full pl-4 md:pl-4 pr-10 md:pr-10 py-2.5 md:py-2 lg:py-2.5 rounded-xl md:rounded-xl lg:rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#7C2A2A]/10 focus:border-[#7C2A2A]/30 transition-all duration-200 text-sm text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={uploading ? "Uploading..." : (isDisabled ? "Sending..." : "Type your message here...")}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 active:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50"
            type="button"
            title="Add emoji"
            disabled={isDisabled}
          >
            <Smile className="w-5 h-5 md:w-5 md:h-5" />
          </button>
        </div>

        <button
          className="p-2.5 md:p-2 lg:p-2.5 bg-[#7C2A2A] text-white rounded-xl md:rounded-xl hover:bg-[#5e0000] shadow-md shadow-[#7C2A2A]/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          type="submit"
          disabled={(!message.trim() && !selectedFile) || isDisabled}
          title="Send message"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 md:w-5 md:h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5 md:w-5 md:h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
