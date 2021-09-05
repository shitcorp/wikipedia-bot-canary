export const version1 = {
  id: '/ConfigVersion1',
  type: 'object',
  properties: {
    version: { type: 'integer', minimum: 1, maximum: 1 },
    config: {
      type: 'object',
      properties: {
        lang: { type: 'string', enum: ['de', 'en'] }
      }
    }
  }
};
