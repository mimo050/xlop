import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { env } from '../src/config/env';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.count();
  if (adminExists === 0) {
    const passwordHash = await bcrypt.hash(env.adminPassword, 10);
    await prisma.user.create({ data: { email: env.adminEmail, passwordHash } });
    console.log('Seeded admin user');
  }

  const certs = [
    { name: 'Etisalat - Emirates Telecommunications Corporation', status: 'active', provider: 'Etisalat' },
    { name: 'Custom Enterprise Cert', status: 'active', provider: 'Custom' }
  ];
  for (const cert of certs) {
    await prisma.certificate.upsert({ where: { name: cert.name }, update: cert, create: cert });
  }

  const apps = [
    { displayName: 'Feather', slug: 'Feather_v2.4.0', version: '2.4.0', price: 999 },
    { displayName: 'GBox', slug: 'GBox_v5.7.6', version: '5.7.6', price: 1099 },
    { displayName: 'ScarletAlpha', slug: 'ScarletAlpha', version: '1.0.0', price: 899 },
    { displayName: 'SignTest_签名测试', slug: 'SignTest_签名测试_v1.0', version: '1.0', price: 699 },
    { displayName: '轻松签_Esign', slug: '轻松签_Esign_v4.8.2', version: '4.8.2', price: 799 },
    { displayName: '轻松签_Esign', slug: '轻松签_Esign_v5.0.2', version: '5.0.2', price: 899 }
  ];

  const uploadDir = path.resolve(process.cwd(), 'uploads', 'ipas');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  for (const app of apps) {
    const filePath = path.join(uploadDir, `${app.slug}.ipa`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `Placeholder IPA for ${app.slug}`);
    }
    await prisma.app.upsert({
      where: { slug: app.slug },
      update: { ...app, filePath, status: 'active' },
      create: { ...app, filePath, status: 'active' }
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
