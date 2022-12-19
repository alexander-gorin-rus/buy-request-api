export const schemaFormData = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: 'The file to upload',
      },
    },
  },
};

export const BUCKET_NAME = {
  AVATAR: 'avatar',
  PRODUCT: 'product',
  OFFER: 'offer',
  REQUEST: 'request',
  MESSAGE: 'message',
};
