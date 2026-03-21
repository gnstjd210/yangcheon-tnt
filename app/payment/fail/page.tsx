import Link from 'next/link';

export default async function PaymentFailPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
    const resolvedParams = await searchParams;
    const reason = resolvedParams.reason;
    let errorMessage = '결제 과정에 문제가 발생했거나 취소되었습니다.';
    
    if (reason === 'cancelled') {
        errorMessage = '사용자가 결제를 취소했습니다.';
    } else if (reason === 'failed') {
        errorMessage = '결제에 실패했습니다. 카카오페이에 문의해주세요.';
    } else if (reason === 'approve_failed') {
        errorMessage = '결제 승인 과정에서 오류가 발생했습니다.';
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100">
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-black text-navy-900 mb-3 tracking-tight">결제 취소/실패</h1>
                <p className="text-gray-500 mb-8 font-medium">{errorMessage}</p>
                <Link href="/" className="bg-navy-900 text-white font-bold py-4 px-6 rounded-xl w-full block hover:bg-navy-800 transition-colors shadow-lg">
                    돌아가서 다시 결제하기
                </Link>
            </div>
        </div>
    );
}
