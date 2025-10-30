import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Injectable } from 'node_modules/@nestjs/common';
import { ConfigService } from 'node_modules/@nestjs/config';

 @Injectable()
 export class CloudinaryStrategy {
    constructor(
        private readonly configService: ConfigService
    ) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_NAME'),
            api_key: this.configService.get('CLOUDINARY_KEY'),
            api_secret: this.configService.get('CLOUDINARY_SECRET')
        });
    }

    async uploadFromUrl(url:string ,publicId?:string):Promise<UploadApiResponse>{
        try {
            return await cloudinary.uploader.upload(url, {
                public_id: publicId
            });
            
        } catch (error) {
            throw new Error(`Cloudinary upload failed: ${error}`);
        }
    }
    
    async uploadFile(file: Express.Multer.File, folder: string){
    return new Promise((resolve) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image', // ensure it's treated as image
        },
        (error, result: UploadApiResponse) => {
          if (error) return error;
          resolve(result.secure_url); // return public URL
        },
      ).end(file.buffer);
    });
  }

    getOptimizedUrl(public_id : string) : string {
        return cloudinary.url(public_id, {
         fetch_format: 'auto',
            quality: 'auto',
        })
    }
    
    getAutoCropUrl(public_id : string , width = 500, height = 500) : string {
        return cloudinary.url(public_id, {
            crop: 'auto',
            gravity: 'auto',
            width: width,
            height: height,
        })
    }
}