import { convertXML } from "simple-xml-to-json";

// https://github.com/nirgit/simple-xml-to-json/blob/master/src/constants.js
const NODE_TYPE = {
  ATTRIBUTE: "ATTRIBUTE",
  CONTENT: "CONTENT",
  ELEMENT: "ELEMENT",
  ROOT: "ROOT",
} as const;

type XmlNode = ElementNode | AttributeNode | ContentNode;

interface ElementNode {
  type: typeof NODE_TYPE.ELEMENT;
  value: {
    type: string;
    attributes: AttributeNode[];
    children: (ElementNode | ContentNode)[];
  };
}

interface AttributeNode {
  type: typeof NODE_TYPE.ATTRIBUTE;
  value: {
    name: string;
    value: string;
  };
}

interface ContentNode {
  type: typeof NODE_TYPE.CONTENT;
  value: string;
}

export const xmlToJson = (str: string) => {
  try {
    return convertXML(str, {
      convert: (ast) => {
        return buildJSONFromNode(ast as XmlNode)
      },
    })
  } catch (_err) {
    throw new Error(`xmlToJson: ${str}`);
  }
};

const buildJSONFromNode = (node: XmlNode) => {
  if (!node) return {};
  let json = {} as Record<string, unknown>;

  switch (node.type) {
    case NODE_TYPE.ELEMENT: {
      json._tag = node.value.type;

      const attribs = buildAttributes(node.value.attributes);
      if (attribs) {
        json = Object.assign(json, attribs);
      }

      if (node.value.children) {
        json = Object.assign(json, buildChildren(node.value.children));
      }

      break;
    }
    case NODE_TYPE.ATTRIBUTE: {
      const attribNameAndValue = node.value;
      json[attribNameAndValue.name] = attribNameAndValue.value;
      break;
    }
    // case NODE_TYPE.CONTENT: {
    //   return { content: node.value };
    // }
    default: {
      break;
    }
  }

  return json;
};

const buildChildren = (children: (ElementNode | ContentNode)[]) => {
  if (!children || !Array.isArray(children) || children.length === 0) {
    return {};
  }

  const json = {} as Record<string, string> & { children?: object[] };
  const elements = [];

  for (const child of children) {
    if (child.type === "ELEMENT" && isContentChildren(child.value.children)) {
      json[child.value.type] = child.value.children.at(0)?.value ?? "";
    } else if (child.type === "ELEMENT" && isEmptyChildren(child.value.children)) {
      // json[child.value.type] = null;
    } else {
      elements.push(buildJSONFromNode(child));
    }
  }

  if (elements.length) {
    json.children = elements;
  }
  return json;
};

const isEmptyChildren = (children: XmlNode[]): children is ContentNode[] =>
  children && Array.isArray(children) && children.length === 0;

const isContentChildren = (children: XmlNode[]): children is ContentNode[] =>
  children && Array.isArray(children) && children.length === 1 && NODE_TYPE.CONTENT === children.at(0)?.type;

const buildAttributes = (arrayNodes: AttributeNode[]) => {
  if (arrayNodes && Array.isArray(arrayNodes)) {
    const jsonArray = arrayNodes.map(buildJSONFromNode);
    return jsonArray.reduce((agg, j) => Object.assign(agg, j), {});
  }
  return null;
};
