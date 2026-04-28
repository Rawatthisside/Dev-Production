const ALLOWED_TAGS = new Set([
  "a",
  "blockquote",
  "br",
  "code",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "ul",
]);

const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel"]),
  h1: new Set(["style"]),
  h2: new Set(["style"]),
  h3: new Set(["style"]),
  h4: new Set(["style"]),
  h5: new Set(["style"]),
  h6: new Set(["style"]),
  img: new Set(["src", "alt", "title", "width", "height", "style"]),
  p: new Set(["style"]),
  span: new Set(["style"]),
};

const ALLOWED_STYLE_PROPERTIES = new Set([
  "border-radius",
  "display",
  "font-size",
  "height",
  "margin",
  "margin-left",
  "margin-right",
  "max-width",
  "text-align",
  "width",
]);

const DANGEROUS_BLOCK_TAGS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "option",
  "svg",
  "math",
];

export function sanitizeHtmlContent(input: string) {
  return input
    .replace(/\u0000/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      new RegExp(
        `<(?:${DANGEROUS_BLOCK_TAGS.join("|")})\\b[^>]*>[\\s\\S]*?<\\/(?:${DANGEROUS_BLOCK_TAGS.join("|")})>`,
        "gi",
      ),
      "",
    )
    .replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (fullMatch, rawTagName, rawAttributes) => {
      const tagName = String(rawTagName).toLowerCase();
      const isClosingTag = fullMatch.startsWith("</");

      if (!ALLOWED_TAGS.has(tagName)) {
        return "";
      }

      if (isClosingTag) {
        return `</${tagName}>`;
      }

      const sanitizedAttributes = sanitizeAttributes(
        tagName,
        String(rawAttributes || ""),
      );

      if (tagName === "img" && !sanitizedAttributes.some((attribute) => attribute.name === "src")) {
        return "";
      }

      const attributesMarkup = sanitizedAttributes
        .map(({ name, value }) => ` ${name}="${escapeHtmlAttribute(value)}"`)
        .join("");

      return `<${tagName}${attributesMarkup}>`;
    });
}

function sanitizeAttributes(tagName: string, rawAttributes: string) {
  const allowedAttributes = ALLOWED_ATTRIBUTES[tagName] ?? new Set<string>();
  const sanitizedAttributes: Array<{ name: string; value: string }> = [];
  const attributePattern =
    /([^\s=\/>]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of rawAttributes.matchAll(attributePattern)) {
    const rawAttributeName = match[1];

    if (!rawAttributeName) {
      continue;
    }

    const attributeName = rawAttributeName.toLowerCase();

    if (attributeName.startsWith("on")) {
      continue;
    }

    if (!allowedAttributes.has(attributeName)) {
      continue;
    }

    const rawValue = match[3] ?? match[4] ?? match[5] ?? "";
    const sanitizedValue = sanitizeAttributeValue(
      tagName,
      attributeName,
      rawValue,
    );

    if (!sanitizedValue) {
      continue;
    }

    sanitizedAttributes.push({ name: attributeName, value: sanitizedValue });
  }

  if (tagName === "a") {
    const hrefAttribute = sanitizedAttributes.find(
      (attribute) => attribute.name === "href",
    );

    if (!hrefAttribute) {
      return [];
    }

    const targetAttribute = sanitizedAttributes.find(
      (attribute) => attribute.name === "target",
    );

    if (targetAttribute?.value === "_blank") {
      const relAttribute = sanitizedAttributes.find(
        (attribute) => attribute.name === "rel",
      );

      if (relAttribute) {
        relAttribute.value = "noopener noreferrer";
      } else {
        sanitizedAttributes.push({
          name: "rel",
          value: "noopener noreferrer",
        });
      }
    }
  }

  return sanitizedAttributes;
}

function sanitizeAttributeValue(
  tagName: string,
  attributeName: string,
  rawValue: string,
) {
  const value = rawValue.trim();

  if (!value) {
    return null;
  }

  if (attributeName === "href") {
    return sanitizeUrl(value, { allowAnchor: true, allowRelative: true });
  }

  if (attributeName === "src") {
    return sanitizeUrl(value, { allowAnchor: false, allowRelative: true });
  }

  if (attributeName === "target") {
    return value === "_blank" ? "_blank" : null;
  }

  if (attributeName === "rel") {
    return value
      .split(/\s+/)
      .map((token) => token.toLowerCase())
      .filter((token) => ["noopener", "noreferrer"].includes(token))
      .join(" ");
  }

  if (attributeName === "style") {
    return sanitizeStyle(value);
  }

  if (attributeName === "width" || attributeName === "height") {
    return /^\d{1,4}$/.test(value) ? value : null;
  }

  if (tagName === "img" && (attributeName === "alt" || attributeName === "title")) {
    return value.slice(0, 300);
  }

  return value;
}

function sanitizeUrl(
  value: string,
  {
    allowAnchor,
    allowRelative,
  }: { allowAnchor: boolean; allowRelative: boolean },
) {
  if (allowAnchor && value.startsWith("#")) {
    return value;
  }

  if (allowRelative && value.startsWith("/")) {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (/^mailto:/i.test(value) || /^tel:/i.test(value)) {
    return value;
  }

  return null;
}

function sanitizeStyle(value: string) {
  if (/(expression|url\s*\(|javascript:|@import)/i.test(value)) {
    return null;
  }

  const declarations = value
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean);
  const sanitizedDeclarations: string[] = [];

  for (const declaration of declarations) {
    const separatorIndex = declaration.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const propertyName = declaration
      .slice(0, separatorIndex)
      .trim()
      .toLowerCase();
    const propertyValue = declaration.slice(separatorIndex + 1).trim();

    if (!ALLOWED_STYLE_PROPERTIES.has(propertyName)) {
      continue;
    }

    const sanitizedValue = sanitizeStyleValue(propertyName, propertyValue);

    if (!sanitizedValue) {
      continue;
    }

    sanitizedDeclarations.push(`${propertyName}: ${sanitizedValue}`);
  }

  return sanitizedDeclarations.join("; ");
}

function sanitizeStyleValue(propertyName: string, value: string) {
  const normalizedValue = value.toLowerCase();

  if (propertyName === "text-align") {
    return ["left", "center", "right", "justify"].includes(normalizedValue)
      ? normalizedValue
      : null;
  }

  if (propertyName === "display") {
    return ["block", "inline", "inline-block"].includes(normalizedValue)
      ? normalizedValue
      : null;
  }

  if (
    ["margin", "margin-left", "margin-right"].includes(propertyName) &&
    /^[-\d.%a-z\s]+$/i.test(value)
  ) {
    return value;
  }

  if (
    [
      "font-size",
      "width",
      "height",
      "max-width",
      "border-radius",
    ].includes(propertyName) &&
    /^[-\d.%a-z\s]+$/i.test(value)
  ) {
    return value;
  }

  return null;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
