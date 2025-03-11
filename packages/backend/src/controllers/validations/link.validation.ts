import { t } from 'elysia';

export const createLinkSchema = t.Object({
  link: t.String({ format: 'uri', default: 'https://example.com' }), // Ensures a valid URI
});

export const idParamSchema = t.Object({
  id: t.String(),
});
