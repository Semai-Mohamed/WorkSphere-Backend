import { Injectable, PipeTransform } from '@nestjs/common';
import { ParseFilePipeBuilder } from '@nestjs/common';

@Injectable()
export class ImageFilePipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    const pipe = new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /(jpg|jpeg|png|gif)$/,
      })
      .addMaxSizeValidator({
        maxSize: 5 * 1024 * 1024,
      })
      .build({
       fileIsRequired: false,
      });

    return pipe.transform(file);
  }
}
