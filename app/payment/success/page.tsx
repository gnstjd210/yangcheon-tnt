'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const pgToken = searchParams.get('pg_token');

    const [status, setStatus] = useState<'loading' | 'success' | 'fail'>(pgToken ? 'loading' : 'fail');
    const [errorMessage, setErrorMessage] = useState(pgToken ? '' : '유효하지 않은 결제 요청입니다. (pg_token 없음)');

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
                <div className="text-center font-bold text-navy-900 animate-pulse">
                    결제를 승인하고 있습니다... 잠시만 기다려주세요.
                </div>
            </div>
        );
    }

    if (status === 'fail') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100">
                    <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-navy-900 mb-3 tracking-tight">결제 승인 실패</h1>
                    <p className="text-gray-500 mb-8 font-medium">{errorMessage}</p>
                    <Link href="/" className="bg-navy-900 text-white font-bold py-4 px-6 rounded-xl w-full block hover:bg-navy-800 transition-colors shadow-lg">
                        돌아가서 다시 결제하기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-black text-navy-900 mb-3 tracking-tight">결제 완료</h1>
                <p className="text-gray-500 mb-8 font-medium">재수강 결제가 정상적으로 처리되었습니다.</p>
                <Link href="/" className="bg-sky-500 text-white font-bold py-4 px-6 rounded-xl w-full block hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/30">
                    메인으로 돌아가기
                </Link>
            </div>
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
