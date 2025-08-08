// FileUploadButton.jsx
import { useState, useRef } from 'react';
import {upload} from "../api/upload.ts";

const FileUploadButton = ({ onUploadSuccess, onUploadError, initialImage }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(initialImage || '');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // 本地预览
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImage(event.target.result);
            };
            reader.readAsDataURL(file);

            uploadImg(file);
        }
    };

    const uploadImg = async (file) => {
        setIsUploading(true);
        try {
            const response = await upload(file); // 你的上传API
            onUploadSuccess?.(response.data.data); // 将URL传给父组件
        } catch (error) {
            onUploadError?.(error.message);
            console.error('上传错误:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            <div className="flex items-center space-x-4">
                {previewImage ? (
                    <img
                        src={previewImage}
                        alt="预览"
                        className="w-16 h-16 object-cover rounded-md"
                    />
                ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">无图片</span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                    {isUploading ? '上传中...' : '选择图片'}
                </button>
            </div>
        </div>
    );
};

export default FileUploadButton;