import module from "node:module";

const GROUP_ORDER = ["builtin", "external", "internal", "relative"];

function classifyImport(node) {
  const source = node.source.value;

  if (source.startsWith("node:") || module.isBuiltin(source)) {
    return "builtin";
  }
  if (source.startsWith("@/")) {
    return "internal";
  }
  if (source.startsWith("./") || source.startsWith("../") || source === ".") {
    return "relative";
  }
  return "external";
}

function compareAlpha(a, b) {
  return a.source.value.localeCompare(b.source.value, undefined, {
    sensitivity: "base",
  });
}

const importOrderRule = {
  meta: {
    type: "layout",
    fixable: "code",
    schema: [],
    messages: {
      wrongOrder: "Imports are not ordered correctly.",
    },
  },
  create(context) {
    return {
      "Program:exit"(programNode) {
        const sourceCode = context.sourceCode;
        const body = programNode.body;

        const imports = [];
        for (const node of body) {
          if (node.type === "ImportDeclaration") {
            imports.push(node);
          }
        }

        if (imports.length <= 1) return;

        const sorted = [...imports].sort((a, b) => {
          const rankA = GROUP_ORDER.indexOf(classifyImport(a));
          const rankB = GROUP_ORDER.indexOf(classifyImport(b));

          if (rankA !== rankB) return rankA - rankB;
          return compareAlpha(a, b);
        });

        const isCorrect = imports.every((node, i) => node === sorted[i]);

        if (isCorrect) return;

        context.report({
          node: imports[0],
          messageId: "wrongOrder",
          fix(fixer) {
            const importTexts = sorted.map((node) => sourceCode.getText(node));

            return imports.map((node, i) =>
              fixer.replaceText(node, importTexts[i]),
            );
          },
        });
      },
    };
  },
};

const importOrderPlugin = {
  meta: {
    name: "custom-import-order",
    version: "1.0.0",
  },
  rules: {
    "import-order": importOrderRule,
  },
};

export default importOrderPlugin;
