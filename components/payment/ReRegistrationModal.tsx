'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface ReRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReRegistrationModal({ isOpen, onClose }: ReRegistrationModalProps) {
    const [studentName, setStudentName] = useState('');
    const [classMonth, setClassMonth] = useState('');

    // Payment Options States
    const [category, setCategory] = useState<'soccer' | 'physical'>('soccer');
    const [soccerOption, setSoccerOption] = useState<'1' | '4'>('4');
    const [soccerShuttle, setSoccerShuttle] = useState(false);
    const [physicalOption, setPhysicalOption] = useState<'1' | '1.5'>('1.5');
    const [physicalCount, setPhysicalCount] = useState<number>(1);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateTotalAmount = () => {
        if (category === 'soccer') {
            const base = soccerOption === '1' ? 25000 : 100000;
            const shuttle = soccerShuttle ? 10000 : 0;
            return base + shuttle;
        } else {
            const base = physicalOption === '1' ? 80000 : 100000;
            return base * physicalCount;
        }
    };

    const handlePayment = async () => {
        if (!studentName.trim()) {
            setError('학생 이름을 입력해주세요.');
            return;
        }
        if (!classMonth.trim()) {
            setError('수강월을 입력해주세요. (예: 4월)');
            return;
        }

        setError('');
        setIsLoading(true);

        const calculatedAmount = calculateTotalAmount().toString();

        let itemName = '';
        if (category === 'soccer') {
            itemName = `축구 ${soccerOption === '1' ? '1회권' : '4회권'}${soccerShuttle ? ' + 차량운행' : ''}`;
        } else {
            itemName = `피지컬 ${physicalOption}시간 ${physicalCount}회`;
        }

        try {
            const res = await fetch('/api/payment/kakao/ready', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName, classMonth, amount: calculatedAmount, itemName }),
            });

            const data = await res.json();

            if (data.success && data.redirectUrl) {
                // Redirect user to KakaoPay
                window.location.href = data.redirectUrl;
            } else {
                setError(data.error || '결제 준비 중 오류가 발생했습니다.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setError('서버와 통신할 수 없습니다.');
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm"
            >
                <div className="absolute inset-0" onClick={onClose} />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="bg-sky-500 p-6 text-center text-white relative">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-black tracking-tight mb-1">재수강 결제</h2>
                        <p className="text-sky-100 font-medium text-sm">학생 정보와 수강월을 정확히 입력해주세요.</p>
                    </div>

                    <div className="p-8">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-navy-900 mb-2">학생 이름</label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    placeholder="예: 홍길동"
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-navy-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-navy-900 mb-2">수강 월 (Month)</label>
                                <input
                                    type="text"
                                    value={classMonth}
                                    onChange={(e) => setClassMonth(e.target.value)}
                                    placeholder="예: 4월"
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-navy-900"
                                />
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-bold text-navy-900 mb-2">수강 종목</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            value="soccer"
                                            checked={category === 'soccer'}
                                            onChange={() => setCategory('soccer')}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-sky-500 border-gray-300"
                                        />
                                        <span className="text-gray-700 font-medium">축구</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            value="physical"
                                            checked={category === 'physical'}
                                            onChange={() => setCategory('physical')}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-sky-500 border-gray-300"
                                        />
                                        <span className="text-gray-700 font-medium">피지컬</span>
                                    </label>
                                </div>
                            </div>

                            {/* Options based on category */}
                            {category === 'soccer' ? (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <label className="block text-sm font-bold text-navy-900 mb-2">수강권 선택</label>
                                        <div className="flex flex-col gap-2">
                                            <label className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg border border-gray-200 hover:border-sky-300 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="soccerOption"
                                                        value="1"
                                                        checked={soccerOption === '1'}
                                                        onChange={() => setSoccerOption('1')}
                                                        disabled={isLoading}
                                                        className="w-4 h-4 text-sky-500 border-gray-300 relative select-none"
                                                    />
                                                    <span className="text-gray-700 font-medium">1회권</span>
                                                </div>
                                                <span className="font-bold text-navy-900">25,000원</span>
                                            </label>
                                            <label className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg border border-gray-200 hover:border-sky-300 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="soccerOption"
                                                        value="4"
                                                        checked={soccerOption === '4'}
                                                        onChange={() => setSoccerOption('4')}
                                                        disabled={isLoading}
                                                        className="w-4 h-4 text-sky-500 border-gray-300 relative select-none"
                                                    />
                                                    <span className="text-gray-700 font-medium">4회권</span>
                                                </div>
                                                <span className="font-bold text-navy-900">100,000원</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <label className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg border border-gray-200 hover:border-sky-300 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={soccerShuttle}
                                                    onChange={(e) => setSoccerShuttle(e.target.checked)}
                                                    disabled={isLoading}
                                                    className="w-4 h-4 text-sky-500 rounded border-gray-300 relative select-none"
                                                />
                                                <span className="text-gray-700 font-medium">차량 운행비 추가</span>
                                            </div>
                                            <span className="font-bold text-navy-900">+10,000원</span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <label className="block text-sm font-bold text-navy-900 mb-2">수강 시간 (단가)</label>
                                        <div className="flex flex-col gap-2">
                                            <label className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg border border-gray-200 hover:border-sky-300 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="physicalOption"
                                                        value="1"
                                                        checked={physicalOption === '1'}
                                                        onChange={() => setPhysicalOption('1')}
                                                        disabled={isLoading}
                                                        className="w-4 h-4 text-sky-500 border-gray-300 relative select-none"
                                                    />
                                                    <span className="text-gray-700 font-medium">1시간</span>
                                                </div>
                                                <span className="font-bold text-navy-900">80,000원 <span className="text-xs text-gray-500 font-normal">/ 회</span></span>
                                            </label>
                                            <label className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg border border-gray-200 hover:border-sky-300 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="physicalOption"
                                                        value="1.5"
                                                        checked={physicalOption === '1.5'}
                                                        onChange={() => setPhysicalOption('1.5')}
                                                        disabled={isLoading}
                                                        className="w-4 h-4 text-sky-500 border-gray-300 relative select-none"
                                                    />
                                                    <span className="text-gray-700 font-medium">1.5시간</span>
                                                </div>
                                                <span className="font-bold text-navy-900">100,000원 <span className="text-xs text-gray-500 font-normal">/ 회</span></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <label className="block text-sm font-bold text-navy-900 mb-2">결제 횟수 (최대 10회)</label>
                                        <select
                                            value={physicalCount}
                                            onChange={(e) => setPhysicalCount(Number(e.target.value))}
                                            disabled={isLoading}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-navy-900 font-medium cursor-pointer"
                                        >
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                                <option key={num} value={num}>
                                                    {num}회
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Total Amount Display */}
                            <div className="bg-navy-900 text-white p-4 rounded-xl flex items-center justify-between mb-4 shadow-inner">
                                <span className="font-medium text-sky-200">총 결제 금액</span>
                                <span className="text-xl font-black">{calculateTotalAmount().toLocaleString()}원</span>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg text-center">
                                    {error}
                                </p>
                            )}

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handlePayment}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-xl transition-colors shadow-lg shadow-yellow-400/30 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            결제 준비 중...
                                        </>
                                    ) : (
                                        '카카오페이로 결제하기'
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
