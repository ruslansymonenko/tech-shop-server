import { BadRequestException, Injectable } from '@nestjs/common';
import { EnumFoldersNames, IFileResponse } from './file.interface';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FileService {
  async saveFiles(files: Express.Multer.File[], folder: EnumFoldersNames) {
    if (!Object.values(EnumFoldersNames).includes(folder)) {
      throw new BadRequestException(`Invalid folder name: ${folder}`);
    }

    const uploadedFolder = `${path}/uploads/${folder}`;

    await ensureDir(uploadedFolder);

    const response: IFileResponse[] = await Promise.all(
      files.map(async (file) => {
        const originalFileName = `${Date.now()}-${file.originalname}`;

        await writeFile(`${uploadedFolder}/${originalFileName}`, file.buffer);

        return {
          url: `uploads/${folder}/${originalFileName}`,
          name: originalFileName,
        };
      }),
    );

    return response;
  }
}
