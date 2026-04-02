'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { Check, XCircle } from 'lucide-react';

function formatAmount(num: number) {
    if (!num) return '0';
    return num.toLocaleString();
}

function formatDate(isoString: string) {
    if (!isoString) return '';
    const d = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const pgToken = searchParams.get('pg_token');

    const [status, setStatus] = useState<'loading' | 'success' | 'fail'>(pgToken ? 'loading' : 'fail');
    const [errorMessage, setErrorMessage] = useState(pgToken ? '' : '유효하지 않은 결제 요청입니다. (pg_token 없음)');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [paymentData, setPaymentData] = useState<any>(null);

    useEffect(() => {
        if (!pgToken) return;

        const approvePayment = async () => {
            try {
                const res = await fetch('/api/payment/kakao/approve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pg_token: pgToken })
                });

                const data = await res.json();
                if (data.success) {
                    setPaymentData(data.data);
                    setStatus('success');
                } else {
                    setStatus('fail');
                    setErrorMessage(data.error || '결제 승인에 실패했습니다.');
                }
            } catch {
                setStatus('fail');
                setErrorMessage('서버와의 통신에 실패했습니다.');
            }
        };

        approvePayment();
    }, [pgToken]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-20 h-20 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-6"></div>
                    <div className="font-bold text-navy-900 text-xl animate-pulse">
                        결제를 안전하게 승인하고 있습니다...
                    </div>
                    <p className="text-gray-500 mt-2 text-sm">잠시만 기다려주세요, 화면을 닫지 마세요.</p>
                </div>
            </div>
        );
    }

    if (status === 'fail') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100"
                >
                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <XCircle size={48} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black text-navy-900 mb-3 tracking-tight">결제 승인 실패</h1>
                    <p className="text-gray-500 mb-8 font-medium">{errorMessage}</p>
                    <Link href="/" className="bg-navy-900 text-white font-black py-4 px-6 rounded-xl w-full block hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 active:scale-95">
                        돌아가서 다시 결제하기
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl max-w-md w-full text-center border border-gray-100"
            >
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.1 }}
                    className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                >
                    <Check size={48} strokeWidth={3} />
                </motion.div>
                
                <h1 className="text-2xl md:text-3xl font-black text-navy-900 mb-2 tracking-tight">
                    결제가 정상적으로<br/>완료되었습니다.
                </h1>
                <p className="text-gray-500 mb-8 font-medium">안전하게 결제가 처리되었습니다.</p>
                
                {/* Receipt Box */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-50 rounded-2xl p-6 mb-8 mt-2 border border-gray-200 shadow-sm text-left relative overflow-hidden"
                >
                    {/* Decorative saw-tooth top (optional, can just use rounded box) */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDQsOCA4LDAiIGZpbGw9IiNmOWZhZmIiLz48L3N2Zz4=')] repeat-x"></div>

                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between py-3 border-b border-gray-200 border-dashed">
                            <span className="text-gray-500 font-bold text-sm">결제 상품명</span>
                            <span className="text-navy-900 font-bold text-sm text-right max-w-[60%]">{paymentData?.item_name || '-'}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200 border-dashed">
                            <span className="text-gray-500 font-bold text-sm">결제 일시</span>
                            <span className="text-navy-900 font-bold text-sm">{formatDate(paymentData?.approved_at)}</span>
                        </div>
                        <div className="flex justify-between py-4 mt-1 items-end">
                            <span className="text-gray-700 font-black text-base">총 결제 금액</span>
                            <span className="text-sky-500 font-black text-2xl">{formatAmount(paymentData?.amount?.total)}원</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col gap-3"
                >
                    <Link href="/" className="bg-navy-900 text-white font-black py-4 px-6 rounded-xl w-full block hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 active:scale-95">
                        홈으로 돌아가기
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
