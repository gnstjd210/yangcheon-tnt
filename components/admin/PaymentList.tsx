'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Search, FilterX } from 'lucide-react';

type Payment = {
    id: string;
    studentName: string;
    classMonth: string;
    amount: number;
    status: string;
    tid: string | null;
    createdAt: Date;
};

export default function PaymentList({
    initialPayments,
    startDateParam = '',
    endDateParam = ''
}: {
    initialPayments: Payment[];
    startDateParam?: string;
    endDateParam?: string;
}) {
    const router = useRouter();
    const [startDate, setStartDate] = useState(startDateParam);
    const [endDate, setEndDate] = useState(endDateParam);

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);

        router.push(`/admin/payment?${params.toString()}`);
    };

    const handleClearFilter = () => {
        setStartDate('');
        setEndDate('');
        router.push(`/admin/payment`);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-navy-900">결제 장부 관리</h1>
            </div>

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end mb-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">시작일</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">종료일</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleFilter}
                        className="bg-navy-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-navy-800 transition"
                    >
                        <Search size={16} /> 조회
                    </button>
                    {(startDate || endDate) && (
                        <button
                            onClick={handleClearFilter}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition"
                        >
                            <FilterX size={16} /> 초기화
                        </button>
                    )}
                </div>
            </div>

            {/* Ledger Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-navy-900">결제 내역 ({initialPayments.length}건)</h3>
                </div>

                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 font-bold text-sm text-gray-500">
                    <div className="col-span-3">결제 일시</div>
                    <div className="col-span-2">학생 이름</div>
                    <div className="col-span-2">대상 수강월</div>
                    <div className="col-span-3">결제 금액</div>
                    <div className="col-span-2 text-center">상태</div>
                </div>

                {initialPayments.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-medium">
                        조회된 결제 내역이 없습니다.
                    </div>
                ) : (
                    <div>
                        {initialPayments.map((payment) => (
                            <div key={payment.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50 transition text-sm text-navy-900">
                                <div className="col-span-3 text-gray-500">
                                    {format(new Date(payment.createdAt), "yyyy-MM-dd HH:mm:ss")}
                                </div>
                                <div className="col-span-2 font-black">{payment.studentName}</div>
                                <div className="col-span-2 font-medium">{payment.classMonth}</div>
                                <div className="col-span-3 font-bold text-sky-600">
                                    {payment.amount.toLocaleString()}원
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    {payment.status === 'success' ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black tracking-wider">
                                            결제완료
                                        </span>
                                    ) : payment.status === 'pending' ? (
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-black tracking-wider">
                                            대기중
                                        </span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black tracking-wider">
                                            실패/취소
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
