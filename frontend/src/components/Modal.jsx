// src/components/Modal.jsx
import { useEffect } from 'react';

const Modal = ({ children, onClose }) => {
    // 阻止背景滚动
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div
                className="fixed inset-0"
                onClick={onClose}
            ></div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Modal;