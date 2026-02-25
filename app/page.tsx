import HeroSplit from '@/components/home/HeroSplit';
import NoticeAndMap from '@/components/home/NoticeAndMap';
import ProgramPreview from '@/components/home/ProgramPreview';
import LessonReviews from '@/components/home/LessonReviews';
import { getMainPageData } from '@/app/actions/mainPage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data } = await getMainPageData();

  return (
    <main className="min-h-screen">
      <HeroSplit slides={data?.heroImages} quickMenu={data?.quickMenu} />
      <NoticeAndMap />
      <ProgramPreview programs={data?.programs} />
      <LessonReviews />
    </main>
  );
}
