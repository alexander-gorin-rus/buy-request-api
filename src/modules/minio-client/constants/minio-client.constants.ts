export const typesFile = [
  'jpeg',
  'png',
  'jpg',
  'bmp',
  'mp4',
  'quicktime',
  'x-msvideo',
];

export const quantities = {
  BYTES: 1000000,
  MULLTISECONDS: 60000,
};

export const filesCount = {
  TOTAL: 10,
  VIDEO_QUANTITY: 2,
  IMAGE_QUANTITY: 10,
};

export const imageErrorType = {
  MAX_FILE_PX_RANGE: 'MAX_FILE_PX_RANGE',
  MAX_FILE_SIZE: 'MAX_FILE_SIZE',
};

export const imageFileParams = {
  TYPES: ['jpeg', 'png', 'jpg', 'bmp'],
  NUMBER_PX_MAX: 33.2,
  HEIGHT_MAX_SIZE_PX: 4320,
  WIDTH_MAX_SIZE_PX: 7680,
  MIN_SIZE_PX: 200,
  FILE_SIZE_MAX_BYTES: 5000000, // 5MB
};

export const avatarImageParams = {
  WIDTH_MAX_SIZE_PX: 200,
  HEIGHT_MAX_SIZE_PX: 200,
};

export const productImageParams = {
  WIDTH_MAX_SIZE_PX: 1080,
  HEIGHT_MAX_SIZE_PX: 1080,
};

export const videoFileParams = {
  TYPES: ['mp4', 'quicktime', 'x-msvideo'],
  DURATION_MAX_MULLTISECONDS: 300000, // (300 000 millisec / 60 000)  = 5 min
  MAX_FILE_SIZE_MIN_BYTES: 100000000, // (100 000 000 byte / 1 000 000) = 100 MB
};

export const widthRage = [
  imageFileParams.MIN_SIZE_PX,
  imageFileParams.WIDTH_MAX_SIZE_PX,
];

export const heightRange = [
  imageFileParams.MIN_SIZE_PX,
  imageFileParams.WIDTH_MAX_SIZE_PX,
];
