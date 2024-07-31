import {
  Controller,
  HttpCode,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumFoldersNames } from './file.interface';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files'))
  @Auth()
  @Post('upload')
  async saveFiles(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: EnumFoldersNames,
  ) {
    return this.fileService.saveFiles(files, folder);
  }
}
