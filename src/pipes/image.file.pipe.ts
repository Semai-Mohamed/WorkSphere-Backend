import { Injectable, HttpStatus, PipeTransform } from '@nestjs/common';
import { ParseFilePipeBuilder } from '@nestjs/common';

@Injectable()
export class ImageFilePipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    const pipe = new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /(jpg|jpeg|png|gif)$/, // allow multiple image types
      })
      .addMaxSizeValidator({
        maxSize: 5 * 1024 * 1024, // 5 MB
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });

    return pipe.transform(file);
  }
}
