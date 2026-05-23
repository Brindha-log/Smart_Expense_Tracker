import React, { useState, useRef } from 'react';
import { profileService } from '../../services/profileService';
import { useApp } from '../../context/AppContext';

export const ProfileImageUpload: React.FC = () => {
    const { user, login } = useApp();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setError('Only JPG and PNG files are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB.');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const response = await profileService.uploadProfileImage(file);
            if (user) {
                // Update global context
                login({ ...user, profileImage: response.imageUrl });
            }
        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const imageUrl = user?.profileImage ? `https://smart-expense-tracker-youq.onrender.com${user.profileImage}` : null;

    return (
        <div className="flex flex-col items-center sm:items-start gap-4">
            <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-200 flex items-center justify-center relative">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl font-bold text-slate-400">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1 items-center sm:items-start">
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                    Change Photo
                </button>
                <p className="text-xs text-slate-500">JPG or PNG, max 5MB</p>
                {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
            </div>
        </div>
    );
};
