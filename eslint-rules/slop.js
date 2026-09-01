const SKIPPED_ATTRIBUTES = new Set(["className", "href", "src", "id", "key"]);

const MODULE_SOURCE_PARENTS = new Set([
  "ImportDeclaration",
  "ImportExpression",
  "ExportNamedDeclaration",
  "ExportAllDeclaration",
]);

const ENTITY = /&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/y;

function isModuleSource(node) {
  const parent = node.parent;
  if (!parent) return false;
  if (MODULE_SOURCE_PARENTS.has(parent.type) && parent.source === node) {
    return true;
  }
  return parent.type === "TSImportType" && parent.argument === node;
}

function isInSkippedAttribute(node) {
  let current = node.parent;
  while (current) {
    if (current.type === "JSXAttribute") {
      return (
        current.name.type === "JSXIdentifier" &&
        SKIPPED_ATTRIBUTES.has(current.name.name)
      );
    }
    if (
      current.type === "JSXElement" ||
      current.type === "JSXFragment" ||
      current.type === "Program"
    ) {
      return false;
    }
    current = current.parent;
  }
  return false;
}

function directOffsets(base) {
  return (index) => base + index;
}

// JSX text arrives decoded (`&mdash;` is already an em dash in `value`), so the
// decoded indices must be walked back to raw source indices for the report loc.
function entityOffsets(raw, value, base) {
  const offsets = new Array(value.length + 1);
  let rawIndex = 0;
  let index = 0;

  while (index < value.length) {
    offsets[index] = base + rawIndex;
    ENTITY.lastIndex = rawIndex;
    const entity = ENTITY.exec(raw);

    if (entity && !value.startsWith(entity[0], index)) {
      const codePoint = value.codePointAt(index);
      const units = codePoint !== undefined && codePoint > 0xffff ? 2 : 1;
      if (units === 2) offsets[index + 1] = base + rawIndex;
      rawIndex += entity[0].length;
      index += units;
    } else {
      rawIndex += 1;
      index += 1;
    }
  }

  offsets[value.length] = base + rawIndex;
  return (i) => offsets[i];
}

function forEachTextNode(context, visit) {
  const sourceCode = context.sourceCode;

  return {
    JSXText(node) {
      const raw = node.raw ?? sourceCode.getText(node);
      const offsetAt =
        raw === node.value
          ? directOffsets(node.range[0])
          : entityOffsets(raw, node.value, node.range[0]);
      visit(node, node.value, offsetAt);
    },
    Literal(node) {
      if (typeof node.value !== "string") return;
      if (isModuleSource(node)) return;
      if (isInSkippedAttribute(node)) return;

      const raw = node.raw ?? sourceCode.getText(node);
      const inner = raw.slice(1, -1);
      visit(
        node,
        node.value,
        inner === node.value ? directOffsets(node.range[0] + 1) : null,
      );
    },
    TemplateElement(node) {
      if (isInSkippedAttribute(node)) return;

      const text = node.value.cooked ?? node.value.raw;
      visit(
        node,
        text,
        node.value.raw === text ? directOffsets(node.range[0] + 1) : null,
      );
    },
  };
}

function report(context, node, offsetAt, start, end, descriptor) {
  if (!offsetAt) {
    context.report({ node, ...descriptor });
    return;
  }

  const sourceCode = context.sourceCode;
  context.report({
    loc: {
      start: sourceCode.getLocFromIndex(offsetAt(start)),
      end: sourceCode.getLocFromIndex(offsetAt(end)),
    },
    ...descriptor,
  });
}

// One pass, one alternative per category. Order matters: the tick and cross
// marks are pictographic too, so they must be offered before the emoji branch,
// which in turn excludes © ® ™.
const SLOP_CHARACTERS =
  /(?<emDash>[\u2014\u2E3A\u2E3B])|(?<arrow>[\u2190-\u21FF\u27A1-\u27BF\u27F0-\u27FF\u2B00-\u2B11])|(?<tickCross>[\u2611\u2705\u2713\u2714\u2717\u2718\u274C])|(?<mathAlphanumeric>[\u{1D400}-\u{1D7FF}])|(?<emoji>(?![\u00A9\u00AE\u2122])[\p{Extended_Pictographic}\p{Regional_Indicator}])/gu;

const noSlopCharactersRule = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      emDash: "Em dash. Use a full stop, comma, colon or brackets.",
      arrow: "Text arrow. Use an icon or plain words.",
      tickCross: "Tick/cross mark. Use an icon or plain words.",
      mathAlphanumeric: "Unicode bold/italic letters.",
      emoji: "Emoji.",
    },
  },
  create(context) {
    return forEachTextNode(context, (node, text, offsetAt) => {
      for (const match of text.matchAll(SLOP_CHARACTERS)) {
        const matched = Object.entries(match.groups).find(
          ([, value]) => value !== undefined,
        );
        if (!matched) continue;

        report(
          context,
          node,
          offsetAt,
          match.index,
          match.index + match[0].length,
          { messageId: matched[0] },
        );
      }
    });
  },
};

const SLOP_PHRASES = {
  parallelism: [
    /\bnot just\b/gi,
    /\bmore than just\b/gi,
    /\bisn['’]?t (just|about|only)\b/gi,
    /\b(it|that|this)(['’]s| is) not (about|just|only)\b/gi,
    /\b(it|that|this)(['’]s| is)(n['’]?t)? not\b[^.!?]{1,60}[,;:\u2014]\s*(it|that|this)(['’]s| is)\b/gi,
  ],
  "vapid opener": [
    /\bin today['’]s (fast-paced|ever-changing|digital|modern|world|landscape|economy|climate)\b/gi,
    /\bas technology continues to evolve\b/gi,
    /\bcontinues to evolve\b/gi,
    /\bat the end of the day\b/gi,
    /\bin this day and age\b/gi,
    /\bever-evolving\b/gi,
    /\bfast-paced world\b/gi,
  ],
  "unearned profundity": [
    /\bhere['’]s the thing\b/gi,
    /\bhere['’]s the kicker\b/gi,
    /\bsomething shifted\b/gi,
    /\beverything changed\b/gi,
    /\bthe truth is\b/gi,
    /\bthe reality is\b/gi,
    /\blet['’]s be honest\b/gi,
    /\blet['’]s be clear\b/gi,
    /\bmake no mistake\b/gi,
    /\bthe bottom line\b/gi,
    /\bplot twist\b/gi,
    /\bspoiler alert\b/gi,
  ],
  "slop vocabulary": [
    /\bdelv(e|es|ed|ing)\b/gi,
    /\bunpack(s|ed|ing)?\b/gi,
    /\bascertain(s|ed|ing)?\b/gi,
    /\bmultifaceted\b/gi,
    /\btapestry\b/gi,
    /\blandscapes?\b/gi,
    /\bnavigat(e|es|ed|ing)\b/gi,
    /\bleverag(e|es|ed|ing)\b/gi,
    /\brobust\b/gi,
    /\bseamless(ly)?\b/gi,
    /\belevat(e|es|ed|ing)\b/gi,
    /\bempower(s|ed|ing|ment)?\b/gi,
    /\bgame[- ]chang(er|ers|ing)\b/gi,
    /\bcutting[- ]edge\b/gi,
    /\bunlock(s|ed|ing)?\b/gi,
    /\bjourneys?\b/gi,
    /\bharness(es|ed|ing)?\b/gi,
    /\bstreamlin(e|es|ed|ing)\b/gi,
    /\bdive into\b/gi,
    /\bdeep[- ]dive\b/gi,
    /\bdiscover(s|ed|ing|y)?\b/gi,
    /\bready to\b/gi,
    /\bwhether you(['’]re| are)\b/gi,
    /\bultimately\b/gi,
    /\bsimply put\b/gi,
    /\bit['’]s worth noting\b/gi,
    /\bit['’]s important to note\b/gi,
    /\bin conclusion\b/gi,
  ],
};

const noSlopPhrasesRule = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      slopPhrase: 'Slop phrase "{{text}}" ({{label}}). Say it plainly.',
    },
  },
  create(context) {
    return forEachTextNode(context, (node, text, offsetAt) => {
      for (const [label, patterns] of Object.entries(SLOP_PHRASES)) {
        for (const pattern of patterns) {
          for (const match of text.matchAll(pattern)) {
            report(
              context,
              node,
              offsetAt,
              match.index,
              match.index + match[0].length,
              { messageId: "slopPhrase", data: { text: match[0], label } },
            );
          }
        }
      }
    });
  },
};

const TERMINATORS = new Set([".", "!", "?", ":"]);
// Punctuation and operators that no prose clause carries; their presence means
// the "sentence" is really code.
const CODE_SHAPED = /[=(){}[\];<>/\\"*&|`$]/;
const MEANINGFUL_SIBLINGS = new Set([
  "JSXElement",
  "JSXFragment",
  "JSXExpressionContainer",
]);

function isTerminator(text, index) {
  if (!TERMINATORS.has(text[index])) return false;
  const next = text[index + 1];
  return next === undefined || /\s/.test(next);
}

function countWords(clause) {
  return clause.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word))
    .length;
}

function nextSentenceEndsInQuestion(text, index) {
  for (let i = index + 1; i < text.length; i += 1) {
    const character = text[i];
    if (character === "?") return true;
    if (character === "." || character === "!") return false;
  }
  return false;
}

// The hook keeps running in the next JSX child, so a trailing question mark on
// a JSXText counts only when a sibling follows it.
function hasFollowingSibling(node) {
  const parent = node.parent;
  const children = parent?.children;
  if (!Array.isArray(children)) return false;

  return children
    .slice(children.indexOf(node) + 1)
    .some(
      (sibling) =>
        MEANINGFUL_SIBLINGS.has(sibling.type) ||
        (sibling.type === "JSXText" && sibling.value.trim() !== ""),
    );
}

const noFragmentQuestionsRule = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      fragmentQuestion:
        "Fragment question hook ('Not sure? …'). State it plainly instead.",
    },
  },
  // A `?` is a hook only when the clause before it is a short, prose-shaped
  // fragment and something follows, so `cond ? a : b` and real questions stay out.
  create(context) {
    return forEachTextNode(context, (node, text, offsetAt) => {
      let clauseStart = 0;

      for (let index = 0; index < text.length; index += 1) {
        if (!isTerminator(text, index)) continue;

        const clause = text.slice(clauseStart, index);
        const rest = text.slice(index + 1);
        const followed =
          rest.trim() !== "" ||
          (node.type === "JSXText" && hasFollowingSibling(node));

        if (
          text[index] === "?" &&
          countWords(clause) >= 1 &&
          countWords(clause) <= 3 &&
          !CODE_SHAPED.test(clause) &&
          followed &&
          !nextSentenceEndsInQuestion(text, index)
        ) {
          report(context, node, offsetAt, index, index + 1, {
            messageId: "fragmentQuestion",
          });
        }

        clauseStart = index + 1;
      }
    });
  },
};

const slopPlugin = {
  meta: {
    name: "custom-slop",
    version: "1.0.0",
  },
  rules: {
    "no-slop-characters": noSlopCharactersRule,
    "no-slop-phrases": noSlopPhrasesRule,
    "no-fragment-questions": noFragmentQuestionsRule,
  },
};

export default slopPlugin;
