import { CertificateModel } from '../models/CertificateModel';
import { Certificate } from '@prisma/client';

export const CertificateService = {
  getActiveCertificates(): Promise<Certificate[]> {
    return CertificateModel.findActive();
  },
  getAllCertificates(): Promise<Certificate[]> {
    return CertificateModel.findAll();
  },
  createCertificate(data: Partial<Certificate>) {
    return CertificateModel.create({
      name: data.name || 'Unnamed',
      provider: data.provider,
      status: data.status || 'inactive',
      maxDevices: data.maxDevices,
      usedDevicesCount: data.usedDevicesCount ?? 0,
      expiresAt: data.expiresAt,
      filePath: data.filePath,
      notes: data.notes
    });
  },
  updateCertificate(id: string, data: Partial<Certificate>) {
    return CertificateModel.update(id, data);
  },
  findById(id: string) {
    return CertificateModel.findById(id);
  }
};
