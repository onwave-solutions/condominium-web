import Aws from "aws-sdk";
import { lookup, extension } from "mime-types";
import { ReadStream } from "fs";
import { v4 } from "uuid";

import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";

export class IS3File {
  file?: File;
  abort?: () => void;
  name?: string;
  url?: string;
  type?: string;
  loading?: boolean;
  loaded?: number;
  total?: number;
  reject?: () => void;
}

const {
  REACT_APP_access_key: awsAccessKey,
  REACT_APP_secret_key: awsSecretKey,
  REACT_APP_bucket_name: awsS3Bucket
} = process.env;

export interface IUploadToS3 {
  file: File;
  is3File: IS3File;
  onProgress?: (progress: ManagedUpload.Progress, reject: () => void) => void;
}
const s3 = new Aws.S3({
  accessKeyId: awsAccessKey,
  maxRetries: 3,
  secretAccessKey: awsSecretKey
});

export function prebuildUpload(file: File): IS3File {
  const { type } = file;
  const ext: string = extension(type) as string;
  const name =
    file.name.replace(".", "_") + "_" + v4() + (ext ? "." + ext : "");

  return {
    name,
    type,
    file,
    total: file.size,
    loaded: 0,
    loading: true
  };
}

export function uploadToS3(options: IUploadToS3): Promise<IS3File> {
  const { file, onProgress, is3File } = options;
  let count = 0;
  return new Promise<IS3File>((resolve, reject) => {
    const upload = () => {
      const uploaded = s3
        .upload(
          {
            Key: is3File.name!,
            Bucket: awsS3Bucket!,
            Body: file
          },
          (err: Error, resp: ManagedUpload.SendData) => {
            if (err) {
              if (count === 3) {
                reject(err);
              }
              count++;
              upload();
            }
            if (!resp) {
              return reject();
            }
            return resolve({
              ...is3File,
              abort: uploaded.abort,
              loading: false,
              url: resp.Location
            });
          }
        )
        .on("httpUploadProgress", (progress: ManagedUpload.Progress) => {
          if (onProgress) {
            onProgress(progress, () => uploaded.abort());
          }
        });
    };
    upload();
  });
}
