export default function AdminDashboard() {
    return (
        <div>
            <h2 className="text-3xl font-bold text-navy-900 mb-8">대시보드</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-bold mb-2">총 공지사항</h3>
                    <p className="text-4xl font-black text-navy-900">3</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-bold mb-2">등록된 후기</h3>
                    <p className="text-4xl font-black text-navy-900">30</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-bold mb-2">신규 문의</h3>
                    <p className="text-4xl font-black text-sky-500">0</p>
                </div>
            </div>

            <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center text-gray-400">
                차트 또는 최근 활동 내역 영역 준비 중...
            </div>
        </div>
    );
}
