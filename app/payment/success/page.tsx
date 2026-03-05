import Link from 'next/link';

export default function PaymentSuccessPage() {
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
