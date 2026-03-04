import fs from 'fs';

const users = fs.readFileSync('app/admin/(dashboard)/users/page.tsx', 'utf8'); // Not working because I didn't change directory
