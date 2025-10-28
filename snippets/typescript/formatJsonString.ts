export const formatJsonString = (maybeJsonString: string, space = 2) => {
  const firstChar = maybeJsonString[0];
  const lastChar = maybeJsonString[maybeJsonString.length - 1];
  if ((firstChar === "[" && lastChar === "]") || (firstChar === "{" && lastChar === "}")) {
    try {
      const parsedJson = JSON.parse(maybeJsonString);
      return JSON.stringify(parsedJson, null, space);
    } catch (_error) {
      return maybeJsonString;
    }
  }
  return maybeJsonString;
};
