"use client";

import { Phone, Calendar, ClipboardCheck, Dumbbell, CalendarDays, RefreshCcw } from "lucide-react";

export default function PhysicalProcessPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-20 pb-32">
            <div className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-3xl md:text-5xl font-black text-navy-900 leading-tight">
                    체계적이고 과학적인,<br />
                    <span className="text-sky-600">TSA 물리 평가 & 트레이닝 시스템</span>
                </h2>
                <div className="w-16 h-1.5 bg-navy-900 mx-auto mt-8 mb-8"></div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    내 몸을 제대로 이해하는 것이 건강한 변화의 시작입니다.<br />
                    최고의 피지오 트레이너가 체계적인 시스템을 통해 당신만을 위한 운동의 방향을 잡아드립니다.
                </p>
            </div>

            {/* Timeline UI */}
            <div className="relative mt-20 before:absolute before:inset-0 before:ml-6 md:before:ml-[50%] md:before:-translate-x-px before:h-full before:w-1 before:bg-gradient-to-b before:from-sky-500 before:via-navy-900 before:to-gray-200">

                {/* Step 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 animate-in fade-in duration-700 delay-100">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-sky-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Phone size={20} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 ml-4 md:ml-0 md:group-odd:mr-12 md:group-even:ml-12">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full">STEP 01</span>
                            <h3 className="text-xl font-bold text-navy-900">상담 예약 신청</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            유선 전화 혹은 홈페이지 등록을 통해 편하신 시간대로 피지컬 트레이닝 및 검사 예약을 신청합니다.
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 animate-in fade-in duration-700 delay-200">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-navy-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Calendar size={20} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 ml-4 md:ml-0 md:group-odd:mr-12 md:group-even:ml-12">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full">STEP 02</span>
                            <h3 className="text-xl font-bold text-navy-900">상담 일정 확정</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            고객센터에서 접수 순서대로 연락을 드려 전담 트레이너 배정과 함께 방문 상담 일정을 최종 확정해 드립니다.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 animate-in fade-in duration-700 delay-300">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-sky-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <ClipboardCheck size={20} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 ml-4 md:ml-0 md:group-odd:mr-12 md:group-even:ml-12">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full">STEP 03</span>
                            <h3 className="text-xl font-bold text-navy-900">검사 및 평가 진행</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            자세평가와 움직임 평가를 통해 자세 불균형의 정도, 근육 불균형 및 관절의 기능 상태에 대해 과학적으로 평가합니다.
                        </p>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 animate-in fade-in duration-700 delay-500">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-navy-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Dumbbell size={20} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 ml-4 md:ml-0 md:group-odd:mr-12 md:group-even:ml-12">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full">STEP 04</span>
                            <h3 className="text-xl font-bold text-navy-900">플랜 수립 & 트레이닝</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            평가 결과를 기반으로 불균형을 해결하고 바른 자세를 교정 및 유지할 수 있는 개인 맞춤형 트레이닝을 설계하고 목표를 공유합니다.
                        </p>
                    </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 animate-in fade-in duration-700 delay-700">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-sky-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <CalendarDays size={20} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 ml-4 md:ml-0 md:group-odd:mr-12 md:group-even:ml-12">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full">STEP 05</span>
                            <h3 className="text-xl font-bold text-navy-900">트레이닝 일정 조율</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            정규 트레이닝 스케줄은 회원님의 라이프스타일을 고려하여 담당 트레이너와 함께 가장 효과적인 주기로 예약합니다.
                        </p>
                    </div>
                </div>

                {/* Step 6 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 animate-in fade-in duration-700 delay-1000">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-navy-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <RefreshCcw size={20} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 ml-4 md:ml-0 md:group-odd:mr-12 md:group-even:ml-12">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full">STEP 06</span>
                            <h3 className="text-xl font-bold text-navy-900">홈 프로그램 & 일지 공유</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            센터 밖 일상에서도 관리 가능한 홈 운동 프로그램을 제공하며, 1:1 지속적인 맞춤 관리를 위해 트레이닝 일지를 공유합니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
