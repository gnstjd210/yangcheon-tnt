'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { getAvailableClasses, submitTrialRegistration } from '@/app/actions/registration';

interface TrialClassModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TrialClassModal({ isOpen, onClose }: TrialClassModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [availableClasses, setAvailableClasses] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        age: '8', // Default to middle of range
        desiredClass: '',
        consultationMethod: '전화상담',
        awarenessPath: '친구추천',
        awarenessPathOther: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Fetch classes when modal opens
            getAvailableClasses().then(classes => {
                setAvailableClasses(classes);
                if (classes.length > 0) {
                    setFormData(prev => ({ ...prev, desiredClass: classes[0] }));
                } else {
                    setFormData(prev => ({ ...prev, desiredClass: '상담 후 결정' }));
                }
            });

        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('phone', formData.phone);
        submitData.append('age', formData.age);
        submitData.append('desiredClass', formData.desiredClass);
        submitData.append('consultationMethod', formData.consultationMethod);

        const finalAwareness = formData.awarenessPath === '기타'
            ? `기타: ${formData.awarenessPathOther}`
            : formData.awarenessPath;
        submitData.append('awarenessPath', finalAwareness);

        const result = await submitTrialRegistration(submitData);

        setIsLoading(false);
        if (result.success) {
            setIsSuccess(true);
        } else {
            setErrorMessage(result.message || "신청 중 오류가 발생했습니다.");
        }
    };

    const handleClose = () => {
        setIsSuccess(false);
        setErrorMessage('');
        onClose();
        setFormData({
            name: '',
            phone: '',
            age: '8',
            desiredClass: '',
            consultationMethod: '전화상담',
            awarenessPath: '친구추천',
            awarenessPathOther: ''
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 3 && value.length <= 7) {
            value = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
        } else if (value.length > 7) {
            value = value.replace(/(\d{3})(\d{3,4})(\d{1,4})/, '$1-$2-$3');
        }

        setFormData(prev => ({ ...prev, phone: value }));
    };

    const AGE_OPTIONS = Array.from({ length: 9 }, (_, i) => i + 5); // 5 to 13
    const CONSULTATION_OPTIONS = ['전화상담', '축구교실방문', '메세지상담'];
    const AWARENESS_OPTIONS = ['친구추천', '인터넷', 'SNS', '블로그', '기타'];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white/95 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-white/20">
                            {/* Header */}
                            <div className="bg-navy-900 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white tracking-tight">체험 수업 신청</h2>
                                <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
                                {isSuccess ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="bg-green-100 p-4 rounded-full text-green-600 mb-2"
                                        >
                                            <CheckCircle size={56} />
                                        </motion.div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold text-navy-900">체험수업신청을 완료하였습니다.</h3>
                                            <p className="text-gray-500">
                                                담당자가 확인 후 입력하신 연락처로<br />
                                                빠르게 연락드리겠습니다.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            className="w-full bg-navy-900 text-white font-bold py-3 rounded-xl hover:bg-navy-800 transition-all shadow-lg"
                                        >
                                            확인
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                                        {/* Error Message */}
                                        {errorMessage && (
                                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium text-center">
                                                {errorMessage}
                                            </div>
                                        )}

                                        {/* Basic Info */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-navy-900 block">이름</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    autoComplete="off"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all text-sm"
                                                    placeholder="신청자 성함"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-navy-900 block">연락처</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    autoComplete="off"
                                                    value={formData.phone}
                                                    onChange={handlePhoneChange}
                                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all text-sm"
                                                    placeholder="010-0000-0000"
                                                    maxLength={13}
                                                />
                                            </div>
                                        </div>

                                        {/* Child Age */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-navy-900 block">자녀 나이 (5세~13세)</label>
                                            <select
                                                name="age"
                                                value={formData.age}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all text-sm appearance-none"
                                            >
                                                {AGE_OPTIONS.map(age => (
                                                    <option key={age} value={age}>{age}세</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Desired Class */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-navy-900 block">희망 수업</label>
                                            <select
                                                name="desiredClass"
                                                required
                                                value={formData.desiredClass}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all text-sm appearance-none"
                                            >
                                                <option value="" disabled>수업을 선택해주세요</option>
                                                {availableClasses.map((cls, idx) => (
                                                    <option key={idx} value={cls}>{cls}</option>
                                                ))}
                                                <option value="상담 후 결정">상담 후 결정</option>
                                            </select>
                                        </div>

                                        {/* Consultation Method */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-navy-900 block">상담 희망 방법</label>
                                            <div className="flex flex-wrap gap-3">
                                                {CONSULTATION_OPTIONS.map(option => (
                                                    <label key={option} className={`flex-1 min-w-[100px] text-center px-3 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all border ${formData.consultationMethod === option
                                                        ? 'bg-navy-900 text-white border-navy-900'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-navy-900 hover:text-navy-900'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="consultationMethod"
                                                            value={option}
                                                            checked={formData.consultationMethod === option}
                                                            onChange={handleChange}
                                                            className="hidden"
                                                        />
                                                        {option}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Awareness Path */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-navy-900 block">알게 된 경로</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {AWARENESS_OPTIONS.map(option => (
                                                    <label key={option} className={`text-center px-2 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all border ${formData.awarenessPath === option
                                                        ? 'bg-navy-900 text-white border-navy-900'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-navy-900 hover:text-navy-900'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="awarenessPath"
                                                            value={option}
                                                            checked={formData.awarenessPath === option}
                                                            onChange={handleChange}
                                                            className="hidden"
                                                        />
                                                        {option}
                                                    </label>
                                                ))}
                                            </div>
                                            {formData.awarenessPath === '기타' && (
                                                <input
                                                    type="text"
                                                    name="awarenessPathOther"
                                                    value={formData.awarenessPathOther}
                                                    onChange={handleChange}
                                                    placeholder="경로를 입력해주세요"
                                                    className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-navy-900"
                                                    autoComplete="off"
                                                />
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" /> : '체험 수업 신청하기'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
