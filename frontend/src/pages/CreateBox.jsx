// src/pages/CreateBox.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBox } from '../api/box';
import FileUploadButton from "../components/upload.jsx";

const CreateBoxPage = () => {
    const navigate = useNavigate();
    const [box, setBox] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 100,
        coverImage: '',
        items: []
    });

    const [currentItem, setCurrentItem] = useState({
        name: '',
        rarity: 'common',
        image: '',
        probability: 10
    });

    const [errors, setErrors] = useState({});
    // const coverInputRef = useRef(null);
    // const itemImageInputRef = useRef(null);

    const handleBoxChange = (e) => {
        const { name, value } = e.target;
        setBox(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        }));
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({
            ...prev,
            [name]: name === 'probability' ? Number(value) : value
        }));
    };
// use upload btn
    // 统一处理图片上传成功
    const handleUploadSuccess = (field, imageUrl) => {
        if (field === 'coverImage') {
            setBox(prev => ({ ...prev, coverImage: imageUrl }));
        } else {
            setCurrentItem(prev => ({ ...prev, image: imageUrl }));
        }
    };

    // 统一处理上传错误
    const handleUploadError = (error) => {
        console.error('图片上传失败:', error);
        // 可以在这里添加全局错误提示
    };



    const addItem = () => {
        if (!currentItem.name || !currentItem.image) {
            setErrors(prev => ({
                ...prev,
                item: '请填写完整物品信息'
            }));
            return;
        }

        setBox(prev => ({
            ...prev,
            items: [...prev.items, { ...currentItem }]
        }));

        setCurrentItem({
            name: '',
            rarity: 'common',
            image: '',
            probability: 10
        });
        setErrors(prev => ({ ...prev, item: '' }));
    };

    const removeItem = (index) => {
        setBox(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!box.name) newErrors.name = '请输入盲盒名称';
        if (!box.description) newErrors.description = '请输入描述';
        if (box.price <= 0) newErrors.price = '价格必须大于0';
        if (!box.coverImage) newErrors.coverImage = '请上传封面图';
        if (box.items.length === 0) newErrors.items = '至少添加一个物品';

        const totalProbability = box.items.reduce((sum, item) => sum + item.probability, 0);
        if (totalProbability !== 100) {
            newErrors.probability = '所有物品的概率总和必须等于100%';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()){
            console.log("not userful")
            return}




        try {
            console.log("原始数据:", {
                name: box.name,
                description: box.description,
                price: box.price,
                stock: box.stock,
                items: box.items,
                coverImage: box.coverImage,
            });


            const response = await createBox({
                name: box.name,
                description: box.description,
                price: box.price,
                stock: box.stock,
                coverImage: box.coverImage,
                items: box.items
            });
            console.log("after createbox", response);
            if (response.data.success) {
                alert('盲盒创建成功！');
                navigate('/boxes');
            }
        } catch (error) {
            console.error('创建盲盒失败:', error);
            alert('创建盲盒失败，请重试');
        }
    };



    return (
        <div className="flex mt-6 px-6 py-8 text-black min-h-screen min-w-screen bg-blue-100">

            <form onSubmit={handleSubmit} className="space-y-6 w-1/2 ml-10">
                {/* 盲盒基本信息 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">盲盒信息</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                盲盒名称 *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={box.name}
                                onChange={handleBoxChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                价格 *
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">¥</span>
                                <input
                                    type="number"
                                    name="price"
                                    min="0"

                                    value={box.price}
                                    onChange={handleBoxChange}
                                    className={`w-full pl-8 pr-3 py-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </div>
                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                描述 *
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                value={box.description}
                                onChange={handleBoxChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                库存数量
                            </label>
                            <input
                                type="number"
                                name="stock"
                                min="1"
                                value={box.stock}
                                onChange={handleBoxChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                封面图片 *
                            </label>

                            <FileUploadButton
                                onUploadSuccess={(url) => handleUploadSuccess('coverImage', url)}
                                onUploadError={handleUploadError}
                                initialImage={box.coverImage}
                            />
                            {errors.coverImage && <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>}
                        </div>
                    </div>
                </div>

                {/* 盲盒物品 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">盲盒物品</h2>

                    {errors.items && <p className="mb-4 text-sm text-red-600">{errors.items}</p>}
                    {errors.probability && <p className="mb-4 text-sm text-red-600">{errors.probability}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                物品名称
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={currentItem.name}
                                onChange={handleItemChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                稀有度
                            </label>
                            <select
                                name="rarity"
                                value={currentItem.rarity}
                                onChange={handleItemChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="common">普通</option>
                                <option value="uncommon">罕见</option>
                                <option value="rare">稀有</option>
                                <option value="epic">史诗</option>
                                <option value="legendary">传说</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                概率 (%)
                            </label>
                            <input
                                type="number"
                                name="probability"
                                min="1"
                                max="100"
                                value={currentItem.probability}
                                onChange={handleItemChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                物品图片
                            </label>
                            <FileUploadButton
                                onUploadSuccess={(url) => handleUploadSuccess('itemImage', url)}
                                onUploadError={handleUploadError}
                                initialImage={currentItem.image}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={addItem}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        添加物品
                    </button>

                    {/* 已添加物品列表 */}
                    {box.items.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium mb-3">已添加物品 ({box.items.length})</h3>
                            <div className="space-y-3">
                                {box.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 object-cover rounded-md"
                                            />
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {item.rarity} - {item.probability}%
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            删除
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        创建盲盒
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBoxPage;