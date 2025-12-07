import { prisma } from '../db/client';
import { Certificate, Prisma } from '@prisma/client';

export const CertificateModel = {
  findActive(): Promise<Certificate[]> {
    return prisma.certificate.findMany({ where: { status: 'active' }, orderBy: { createdAt: 'desc' } });
  },
  findAll(): Promise<Certificate[]> {
    return prisma.certificate.findMany({ orderBy: { createdAt: 'desc' } });
  },
  create(data: Prisma.CertificateCreateInput): Promise<Certificate> {
    return prisma.certificate.create({ data });
  },
  update(id: string, data: Prisma.CertificateUpdateInput): Promise<Certificate> {
    return prisma.certificate.update({ where: { id }, data });
  },
  findById(id: string): Promise<Certificate | null> {
    return prisma.certificate.findUnique({ where: { id } });
  }
};
