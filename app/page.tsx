import HeroSplit from '@/components/home/HeroSplit';
import NoticeAndMap from '@/components/home/NoticeAndMap';
import ProgramPreview from '@/components/home/ProgramPreview';
import LessonReviews from '@/components/home/LessonReviews';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSplit />
      <NoticeAndMap />
      <ProgramPreview />
      <LessonReviews />
    </main>
  );
}
