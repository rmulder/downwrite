import format from "date-fns/format";

export const createMarkdown = (
  title: string,
  content: string,
  date?: Date
): string => `
---
title: ${title}
${date && `dateAdded: ${format(date, "DD MMMM YYYY")}`}
---

${content}
`;
