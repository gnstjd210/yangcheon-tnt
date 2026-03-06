'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Search, FilterX, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { softDeletePayment, updatePayment } from '@/app/actions/payment-admin';

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
    const [isSaving, setIsSaving] = useState(false);

    // Edit Modal State
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
    const [editFormData, setEditFormData] = useState({ studentName: '', classMonth: '' });

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

    const handleOpenEdit = (payment: Payment) => {
        setEditingPayment(payment);
        setEditFormData({
            studentName: payment.studentName,
            classMonth: payment.classMonth,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingPayment) return;
        setIsSaving(true);
        const res = await updatePayment(editingPayment.id, editFormData);
        setIsSaving(false);

        if (res.success) {
            setEditingPayment(null);
            router.refresh();
        } else {
            alert(res.error || '수정 중 오류가 발생했습니다.');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`[${name}] 회원의 결제 내역을 삭제하시겠습니까?\n이 데이터는 '선택된 휴지통'으로 이동되며 나중에 복구할 수 있습니다.`)) {
            return;
        }

        setIsSaving(true);
        const res = await softDeletePayment(id);
        setIsSaving(false);

        if (res.success) {
            router.refresh();
        } else {
            alert(res.error || '삭제 중 오류가 발생했습니다.');
        }
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

                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 font-bold text-sm text-gray-500 min-w-[800px]">
                    <div className="col-span-3">결제 일시</div>
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
                                조회된 결제 내역이 없습니다.
                            </div>
                        ) : (
                            <div>
                                {initialPayments.map((payment) => (
                                    <div key={payment.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-50 last:border-0 hover:bg-bg-50 transition text-sm text-navy-900">
                                        <div className="col-span-3 text-gray-500">
                                            {format(new Date(payment.createdAt), "yyyy-MM-dd HH:mm:ss")}
                                        </div>
                                        <div className="col-span-2 font-black">{payment.studentName}</div>
                                        <div className="col-span-2 font-medium">{payment.classMonth}</div>
                                        <div className="col-span-2 font-bold text-sky-600">
                                            {payment.amount.toLocaleString()}원
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            {payment.status === 'success' ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold">
                                                    성공
                                                </span>
                                            ) : payment.status === 'pending' ? (
                                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold">
                                                    대기
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold">
                                                    실패
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-2 flex justify-center gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(payment)}
                                                disabled={isSaving}
                                                className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded transition"
                                                title="수정"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(payment.id, payment.studentName)}
                                                disabled={isSaving}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                title="삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingPayment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-navy-900">결제 정보 수정</h3>
                            <button onClick={() => setEditingPayment(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="bg-orange-50 text-orange-800 p-3 rounded-lg text-xs flex items-start gap-2 mb-2">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                <p><strong>주의:</strong> 금액과 결제 상태는 데이터 정합성을 위해 임의로 수정할 수 없습니다.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">학생 이름</label>
                                <input
                                    type="text"
                                    value={editFormData.studentName}
                                    onChange={(e) => setEditFormData({ ...editFormData, studentName: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">대상 수강월</label>
                                <input
                                    type="text"
                                    value={editFormData.classMonth}
                                    onChange={(e) => setEditFormData({ ...editFormData, classMonth: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                    placeholder="예: 2026년 3월 클래스"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                            <button
                                onClick={() => setEditingPayment(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition"
                                disabled={isSaving}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition"
                            >
                                {isSaving ? '저장 중...' : '변경 내용 저장'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
