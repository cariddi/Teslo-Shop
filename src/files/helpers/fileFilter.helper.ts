export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  console.log({ file });

  if (!file) return callback(new Error('file is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'png', 'jpeg', 'gif', 'svg'];

  if (!validExtensions.includes(fileExtension))
    return callback(new Error('file extension is invalid'), false);

  callback(null, true); // 2nd parameter indicates if I accept/reject the received file
};
