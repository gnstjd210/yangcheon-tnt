import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
   const data = await prisma.mainPageData.findFirst();
   if (data && data.heroImages) {
      let heroImages = data.heroImages as any;
      if (typeof heroImages === 'string') {
         heroImages = JSON.parse(heroImages);
      }
      if (Array.isArray(heroImages)) {
         heroImages[0].title = "THE BEST PLACE\nFOR YOUR DREAM";
         heroImages[0].subtitle = "양천 TNT FC 2026 Season";
         if (heroImages.length > 1) {
            heroImages[1].title = "PROFESSIONAL\nTRAINING SYSTEM";
            heroImages[1].subtitle = "체계적인 유소년 육성 프로그램";
         }
         await prisma.mainPageData.update({
            where: { id: data.id },
            data: { heroImages: JSON.stringify(heroImages) }
         });
         console.log("Updated Hero Images in DB");
      } else {
         console.log("heroImages is not an array:", heroImages);
      }
   } else {
      console.log("No MainPageData or heroImages in DB");
   }
}
main()
   .then(async () => { await prisma.$disconnect() })
   .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
