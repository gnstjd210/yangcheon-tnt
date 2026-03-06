'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { RotateCcw, AlertCircle } from 'lucide-react';
import { restorePayment } from '@/app/actions/payment-admin';

type Payment = {
    id: string;
    studentName: string;
    classMonth: string;
    amount: number;
    status: string;
    tid: string | null;
    createdAt: Date;
    deletedAt: Date | null;
};

export default function PaymentTrashList({
    initialPayments,
}: {
    initialPayments: Payment[];
}) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleRestore = async (id: string, name: string) => {
        if (!window.confirm(`[${name}] 회원의 결제 내역을 장부로 원상 복구하시겠습니까?`)) {
            return;
        }

        setIsSaving(true);
        const res = await restorePayment(id);
        setIsSaving(false);

        if (res.success) {
            router.refresh();
        } else {
            alert(res.error || '복구 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-red-700 flex items-center gap-2">
                    <AlertCircle size={24} />
                    결제 장부 휴지통
                </h1>
            </div>

            <div className="bg-red-50 text-red-800 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm border border-red-100">
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-600" />
                <div>
                    <h4 className="font-bold text-sm mb-1">데이터 영구 삭제 안내</h4>
                    <p className="text-xs">
                        이곳에 보관된 결제 내역은 <strong>각각 삭제된 시점으로부터 7일(168시간) 후 자정</strong>에 시스템에 의해 영구 삭제됩니다. 잘못 삭제된 데이터가 있다면 즉시 복구해 주세요.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-navy-900">삭제된 내역 ({initialPayments.length}건)</h3>
                </div>

                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 font-bold text-sm text-gray-500 min-w-[800px]">
                    <div className="col-span-3">삭제된 일시</div>
                    <div className="col-span-2">학생 이름</div>
                    <div className="col-span-2">대상 수강월</div>
                    <div className="col-span-2">결제 금액</div>
                    <div className="col-span-1 text-center">상태</div>
                    <div className="col-span-2 text-center">관리</div>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {initialPayments.length === 0 ? (
                            <div className="p-12 text-center text-gray-400 font-medium">
                                휴지통이 비어 있습니다.
                            </div>
                        ) : (
                            <div>
                                {initialPayments.map((payment) => (
                                    <div key={payment.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50 transition text-sm text-gray-500">
                                        <div className="col-span-3 text-red-500 font-medium flex flex-col">
                                            <span>삭제: {payment.deletedAt ? format(new Date(payment.deletedAt), "yyyy-MM-dd HH:mm") : '-'}</span>
                                            <span className="text-xs text-gray-400">결제: {format(new Date(payment.createdAt), "yyyy-MM-dd")}</span>
                                        </div>
                                        <div className="col-span-2 font-black line-through">{payment.studentName}</div>
                                        <div className="col-span-2 font-medium line-through">{payment.classMonth}</div>
                                        <div className="col-span-2 font-bold text-gray-400 line-through">
                                            {payment.amount.toLocaleString()}원
                                        </div>
                                        <div className="col-span-1 flex justify-center opacity-50">
                                            {payment.status === 'success' ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold">성공</span>
                                            ) : payment.status === 'pending' ? (
                                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold">대기</span>
                                            ) : (
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold">실패</span>
                                            )}
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <button
                                                onClick={() => handleRestore(payment.id, payment.studentName)}
                                                disabled={isSaving}
                                                className="px-3 py-1.5 bg-navy-900 text-white hover:bg-navy-800 rounded-lg transition text-xs font-bold flex items-center gap-1.5 shadow-sm"
                                                title="복구하기"
                                            >
                                                <RotateCcw size={14} /> 복구
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
