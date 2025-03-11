import { t } from 'elysia';

export const createItemSchema = t.Object({
  name: t.String(),
  type: t.Union([t.Literal('folder'), t.Literal('file')]),
  parentId: t.Optional(t.String()),
  content: t.Optional(t.String()),
});

export const updateFileContentSchema = t.Object({
  content: t.String(),
});

export const renameItemSchema = t.Object({
  name: t.String(),
});

export const idParamSchema = t.Object({
  id: t.String(),
});
