function extractTheme(tokens) {
  const result = {};

  for (const key in tokens) {
    const token = tokens[key];
    const value = token?.value;
    result[key] = value;
  }

  return result;
}

function extractColorTheme(obj, prefix = "") {
  const result = {};

  for (const key in obj) {
    const value = obj[key];

    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === "object" && "value" in value) {
      result[newKey] = value.value;
    } else if (typeof value === "object") {
      Object.assign(result, extractColorTheme(value, newKey));
    }
  }

  return result;
}

function extractTypographyTheme(typographyTokens) {
  const utilities = {};

  for (const category in typographyTokens) {
    const weights = typographyTokens[category];
    for (const weight in weights) {
      const token = weights[weight];
      const style = token?.original?.value || token?.value;
      if (!style || typeof style !== "object") continue;

      const className = `.${category}-${weight}`;

      utilities[className] = {
        fontSize: `${style.fontSize}px`,
        lineHeight: `${style.lineHeight}px`,
        letterSpacing: `${style.letterSpacing}px`,
        fontWeight: `${style.fontWeight}`,
      };
    }
  }

  return utilities;
}

module.exports = { extractTheme, extractColorTheme, extractTypographyTheme };