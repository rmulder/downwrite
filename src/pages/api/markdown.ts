import { NextApiRequest, NextApiResponse } from "next";
import { markdownToDraft, draftToMarkdown } from "markdown-draft-js";

export default async function markdown(
  { body, query }: NextApiRequest,
  res: NextApiResponse
) {
  const q = !!query && Array.isArray(query) ? query.join("") : query;
  const isFromMarkdown = q === "fromMarkdown";
  if (isFromMarkdown) {
    const { markdown } = body;

    const editorState = markdownToDraft(markdown);

    res.json({ editorState });
  } else {
    const { rawEditorState } = body;

    const md = draftToMarkdown(rawEditorState);
    res.json({ markdown: md });
  }
}