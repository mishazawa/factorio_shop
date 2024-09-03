import { LUA_PLACEHOLDER_FILENAME } from "@app/constants";
import { LayerAttributes } from "@store/api";
import { AttributeValue } from "@store/factorio-api.types";
import { SpriteObject } from "@store/layers";
import { chain, isArray, isString, last, repeat } from "lodash";

export function generate(
  layers: SpriteObject[],
  parameters: Record<string, LayerAttributes>
) {
  console.log(scriptTemplate(processLayer(layers, parameters)));
}

function processLayer(
  layers: SpriteObject[],
  parameters: Record<string, LayerAttributes>
) {
  return chain(layers)
    .map((s) => processLayerAttributes(parameters[s.id].attributes, s))
    .join("\n")
    .value();
}

function processLayerAttributes(
  attributes: Record<string, AttributeValue>,
  sprite: SpriteObject
) {
  return chain(attributes)
    .thru((v) => addIgnoredAttributes(v, sprite))
    .toPairs()
    .map(([k, v]) => keyValue(k, v))
    .join("\n")
    .thru(wrapTable)
    .value();
}

function addIgnoredAttributes(
  v: Record<string, AttributeValue>,
  s: SpriteObject
) {
  return {
    filename: LUA_PLACEHOLDER_FILENAME.replace("%%%", s.filename),
    ...v,
  };
}

function scriptTemplate(value: string) {
  const layers = `layers = ${wrapTable(value)}`;

  return format(`picture = ${wrapTable(layers)}`);
}

function wrapTable(s: string) {
  return `{\n${s}\n}`;
}

function keyValue(k: string, v: AttributeValue) {
  if (!v) return `${k} = null`;
  return `${k} = ${wrapArray(wrapString(v))}`;
}

function wrapString(v: AttributeValue) {
  if (isString(v)) return `"${v}"`;
  return v;
}

function wrapUndefinedArrayElement(v: string | number | undefined) {
  console.log("aaa", v);
  if (!v) return 0;
  return v;
}

function wrapArray(v: AttributeValue) {
  if (isArray(v)) {
    console.log("222", v);

    return wrapTable(
      [...v].map((v) => wrapString(wrapUndefinedArrayElement(v))).join(", ")
    );
  }
  return v;
}

function addTabs(s: string, n: number = 2) {
  return `${repeat("  ", n)}${s}`;
}

const OPEN_TABLE = "{";
const CLOSE_TABLE = "}";
const COMMA = ",";
const NL = "\n";
// idk
// iterate over lines and add more padding for each depth level
// also add comma after keys where it needed
function format(s: string) {
  const lines = s.split(NL);
  let pad = 0;

  for (let i = 0; i < lines.length; i++) {
    const lastChar = last(lines[i]);
    const nextChar = lines[i + 1];
    if (lastChar === OPEN_TABLE) {
      lines[i] = addTabs(lines[i], pad);
      pad += 1;
      continue;
    }

    if (lastChar === CLOSE_TABLE) {
      pad -= 1;
      lines[i] = addTabs(lines[i], pad);

      if (nextChar && nextChar !== CLOSE_TABLE) {
        lines[i] += COMMA;
      }
      continue;
    }

    lines[i] = addTabs(lines[i], pad);
    if (nextChar !== CLOSE_TABLE) {
      lines[i] += COMMA;
    }
  }

  return lines.join(NL);
}
