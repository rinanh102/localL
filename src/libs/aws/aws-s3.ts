
import S3, { ClientConfiguration } from "aws-sdk/clients/s3";
import { FILE_ERRORS } from "../../utils/errorMessages";
import { AWS_CONFIG, FileType, STATUS } from '../../utils/const';
import Files from "../../models/files.model";

const s3 = new S3({
  region: AWS_CONFIG.REGION,
  accessKeyId: AWS_CONFIG.ACCESS_KEY,
  secretAccessKey: AWS_CONFIG.SECRET_KEY
} as ClientConfiguration);

export const uploadFileS3 = async ({ file, folder, userId }: any) => {
  try {

    const filePending = await Files.create({ type: folder, status: STATUS.DELETED });
    const keyFile = `${folder}/v-${filePending.id}/${file.originalname}`;

    const params = {
      Bucket: `${AWS_CONFIG.BUCKET_NAME}`,
      Key: keyFile,
      Body: file.buffer,
      ACL: "private",
      ContentType: file.mimetype,
    };

    const reS3 = await s3.upload(params).promise();
    const { key } = reS3 as any;

    // boxing and unboxing SPLASH
    if (folder === FileType.SPLASHS) {
      await Files.update({ status: STATUS.DELETED }, { where: { type: FileType.SPLASHS, status: STATUS.ACTIVE } });
    }

    await filePending.update({
      type: folder,
      name: file.originalname,
      url: AWS_CONFIG.CLOUD_FRONT_ADDRESS + key,
      key: keyFile,
      ownerId: userId,
      status: STATUS.ACTIVE
    });
    return Promise.resolve(filePending);
  } catch (error) {
    return Promise.reject(FILE_ERRORS.UPLOAD_FAIL(error));
  }
}

export const deleteFileS3 = async (keys: any) => {
  try {
    const params = {
      Bucket: `${AWS_CONFIG.BUCKET_NAME}`,
      Delete: {
        Objects: keys,
        Quiet: false,
      },
    };
    await s3.deleteObjects(params).promise();
  } catch (error) {
    return Promise.reject(FILE_ERRORS.DELETE_FAIL(error));
  }
}
