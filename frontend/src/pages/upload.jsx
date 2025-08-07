import { useState, useRef } from 'react';
import { upload } from '../api/upload';

const FileUploadButton = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            uploadImg(e.target.files[0]);
        }
    };

    const uploadImg = async (file) => {
        setIsUploading(true);
        setUploadResult('');

        try {
            const response = await upload(file);
            console.log("after upload", response);
            setUploadResult(`上传成功！文件URL: ${response.data}`);
        } catch (error) {
            setUploadResult(`上传失败: ${error.message}`);
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

            <button
                onClick={triggerFileInput}
                disabled={isUploading}
                className={`px-4 py-2 rounded-md text-white font-medium
          ${isUploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {isUploading ? '上传中...' : '选择文件并上传'}
            </button>

            {uploadResult && (
                <div className={`mt-3 p-3 rounded ${uploadResult.includes('成功') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {uploadResult}
                </div>
            )}

            {isUploading && (
                <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 animate-pulse"
                            style={{ width: '50%' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploadButton;