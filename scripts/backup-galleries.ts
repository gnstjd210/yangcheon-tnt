import prisma from "../lib/prisma";
import fs from "fs";

async function main() {
    console.log("Backing up galleries...");
    const galleries = await prisma.gallery.findMany();
    fs.writeFileSync("scripts/galleries_backup.json", JSON.stringify(galleries, null, 2));
    console.log(`Backed up ${galleries.length} galleries to scripts/galleries_backup.json`);
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });
