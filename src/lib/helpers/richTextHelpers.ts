type StrapiBlockChild = {
  text?: string;
};

type StrapiBlock = {
  type?: string;
  children?: StrapiBlockChild[];
};

export const descriptionToBlocks = (description: string): StrapiBlock[] => [
  {
    type: "paragraph",
    children: [{ text: description }],
  },
];

export const blocksToText = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((block) => {
        if (!block || typeof block !== "object") {
          return "";
        }

        const blockWithChildren = block as StrapiBlock;
        return (blockWithChildren.children || [])
          .map((child) => (typeof child?.text === "string" ? child.text : ""))
          .join("");
      })
      .filter(Boolean)
      .join("\n");
  }

  if (value && typeof value === "object") {
    const maybeBlock = value as StrapiBlock;
    return (maybeBlock.children || [])
      .map((child) => (typeof child?.text === "string" ? child.text : ""))
      .join("");
  }

  return "";
};
