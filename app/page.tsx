import HeroSplit from '@/components/home/HeroSplit';
import NoticeAndMap from '@/components/home/NoticeAndMap';
import ProgramPreview from '@/components/home/ProgramPreview';
import LessonReviews from '@/components/home/LessonReviews';
import { getMainPageData } from '@/app/actions/mainPage';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data } = await getMainPageData();

  // Fetch top 3 latest notices
  const recentNotices = await prisma.notice.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      createdAt: true,
    }
  });

  return (
    <main className="min-h-screen">
      <HeroSplit slides={data?.heroImages} quickMenu={data?.quickMenu} />
      <NoticeAndMap notices={recentNotices} />
      <ProgramPreview programs={data?.programs} />
      <LessonReviews />
    </main>
  );
}
