import axios from "../utils/request"

export const upload = async (file: File) => {
    const formData = new FormData();
    // 更明确的字段名（与后端@Files()装饰器匹配）
    formData.append('files', file); // Midway默认接收的字段是'files'

    return axios.post("/api/image", formData, {
        headers: {
                        'Content-Type': 'multipart/form-data',
                        // 可以添加认证头等（如果需要）
                        // 'Authorization': `Bearer ${token}`
                    },
    })
    // try {
    //     const response = await axios.post('/api/image', formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //             // 可以添加认证头等（如果需要）
    //             // 'Authorization': `Bearer ${token}`
    //         },
    //         // 添加上传进度监控（可选）
    //         // onUploadProgress: (progressEvent) => {
    //         //     const percentCompleted = Math.round(
    //         //         (progressEvent.loaded * 100) / progressEvent.total
    //         //     );
    //         //     console.log(`上传进度: ${percentCompleted}%`);
    //         // }
    //     });
    //
    //     // 更完整的响应处理
    //     if (response.data && response.data.code === 200) {
    //         return response.data.data; // 直接返回URL字符串
    //     }
    //     throw new Error(response.data?.message || '上传失败');
    // } catch (error) {
    //     console.error('上传错误:', error);
    //     throw error; // 重新抛出错误以便调用方处理
    // }
};