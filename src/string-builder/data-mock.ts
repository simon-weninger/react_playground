import {
  ContentBlock,
  FunctionElement,
  PlaceholderElement,
  SimplePlaceholder,
  StringBuilderElement as StringBuilderElementNew,
  TextElement,
} from "./classes/AbstractElement";
import { StringBuilderElement } from "./types";
import { generateId } from "./utils";

export const generateArray = (): StringBuilderElement[] => {
  let array: StringBuilderElement[] = [];
  for (let i = 0; i < 100; i++) {
    array = array.concat([
      {
        id: generateId(),
        label: "Text",
        type: "TEXT",
        value: "Text",
      },
      {
        id: generateId(),
        label: "Placeholder",
        type: "PLACEHOLDER",
        placeholderId: "PH1",
      },
      {
        id: generateId(),
        label: "Placeholder",
        type: "OPTIONAL_PLACEHOLDER",
        placeholderId: "PH2",
        stringBefore: '"before":"',
        stringAfter: '",',
      },
      {
        id: generateId(),

        label: "Function",
        type: "FUNCTION",
        value: "SUM",
        childrenId: generateId(),
        children: [
          {
            id: generateId(),
            label: "Text",
            type: "TEXT",
            value: "Text",
          },
        ],
      },
    ]);
  }
  return array;
};

export const generateArrayNew = (): StringBuilderElementNew[] => {
  let array: StringBuilderElementNew[] = [];
  for (let i = 0; i < 100; i++) {
    array = array.concat([
      new TextElement("text"),
      new PlaceholderElement(
        new SimplePlaceholder(generateId(), "Location Href", "Group1", "{{location_href}}"),
        false
      ),
      new PlaceholderElement(new SimplePlaceholder(generateId(), "Timestamp", "Group1", "{{timestamp}}"), true),
      new FunctionElement(generateId(), "MD5"),
      new FunctionElement(generateId(), "Another Function"),
    ]);
  }
  return array;
};

const eventNamePrefix = new SimplePlaceholder(generateId(), "Event Name Prefix", "fb", "{{fb_eventname_prefix}}");
const eventTime = new SimplePlaceholder(generateId(), "Event Time", "fb", "{{event_time}}");
const fbEventId = new SimplePlaceholder(generateId(), "Event Id", "fb", "{{fb_event_id}}");
const href = new SimplePlaceholder(generateId(), "Href", "", "{{window_location_href}}");
const actionSource = new SimplePlaceholder(generateId(), "Action Source", "", "{{action_source}}");
const opt_out = new SimplePlaceholder(generateId(), "Opt Out", "", "{{opt out}}");
const em = new SimplePlaceholder(generateId(), "Email", "", "");
const ph = new SimplePlaceholder(generateId(), "Phone", "", "");
const ge = new SimplePlaceholder(generateId(), "Gender", "", "");
const db = new SimplePlaceholder(generateId(), "Day Of Birth", "", "");
const ln = new SimplePlaceholder(generateId(), "Last Name", "", "");
const fn = new SimplePlaceholder(generateId(), "First Name", "", "");
const ct = new SimplePlaceholder(generateId(), "City", "", "");
const st = new SimplePlaceholder(generateId(), "Street", "", "");
const zp = new SimplePlaceholder(generateId(), "ZIP", "", "");
const country = new SimplePlaceholder(generateId(), "Country", "", "");

export const metaPixelBasicPayload: StringBuilderElementNew[] = [new TextElement('{"partner_agent": "pljentis-1.2",')];

export const metaPixelPayload: StringBuilderElementNew[] = [
  new TextElement('"data":'),
  // new TextElement("[", ""),
  new TextElement("[", "orange"),
  // new TextElement("{", ""),
  new TextElement("{", "blue"),
  new PlaceholderElement(eventNamePrefix, false, '"event_name":"', 'CustomizeProduct"'),
  new TextElement(","),
  new PlaceholderElement(eventTime, false, '"event_time":"', '"'),
  new TextElement(","),
  new PlaceholderElement(fbEventId, false, '"event_id":"', '"'),
  new TextElement(","),
  new PlaceholderElement(href, false, '"event_source_url":"', '"'),
  new TextElement(","),
  new PlaceholderElement(actionSource, false, '"action_source":"', '"'),
  new TextElement(","),
  new PlaceholderElement(opt_out, true, '"opt_out":"', '",'),
  new TextElement('"user_data":'),
  // new TextElement("{", ""),
  new TextElement("{", "#00d200"),
  new ContentBlock([
    new PlaceholderElement(em, true, '"em":"', '",'),
    new PlaceholderElement(ph, true, '"ph":"', '",'),
    new PlaceholderElement(ge, true, '"ge":"', '",'),
    new PlaceholderElement(db, true, '"db":"', '",'),
    new PlaceholderElement(ln, true, '"ln":"', '",'),
    new PlaceholderElement(fn, true, '"fn":"', '",'),
    new PlaceholderElement(ct, true, '"ct":"', '",'),
    new PlaceholderElement(st, true, '"st":"', '",'),
    new PlaceholderElement(zp, true, '"zp":"', '",'),
    new PlaceholderElement(country, true, '"country":"', '",'),
    new PlaceholderElement(
      new SimplePlaceholder(generateId(), "Subscription ID", "", ""),
      true,
      '"subscription_id":"',
      '",'
    ),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Lead ID", "", ""), true, '"lead_id":"', '",'),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "FB Login ID", "", ""), true, '"fb_login_id":"', '",'),
    new PlaceholderElement(
      new SimplePlaceholder(generateId(), "External ID", "", ""),
      true,
      '"fb_external_id":"',
      '",'
    ),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Click ID", "", ""), true, '"fbc":"', '",'),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Browser ID", "", ""), true, '"fbp":"', '",'),
    new TextElement('"client_ip_address":"'),
    new FunctionElement(generateId(), "Anonymize", [
      new PlaceholderElement(new SimplePlaceholder(generateId(), "Client IP Address", "", ""), false),
    ]),
    new TextElement('",'),
    new TextElement('"client_user_agent":"'),
    new FunctionElement(generateId(), "Anonymize", [
      new PlaceholderElement(new SimplePlaceholder(generateId(), "Client User Agent", "", ""), false),
    ]),
    new TextElement('"'),
  ]),
  // new TextElement("}", ""),
  new TextElement("}", "#00d200"),
  new TextElement(","),
  new TextElement('"custom_data":'),
  // new TextElement("{", ""),
  new TextElement("{", "red"),
  new ContentBlock([
    new TextElement('"jentis":"true"'),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Custom Parameters", "", ""), false),
    new PlaceholderElement(
      new SimplePlaceholder(generateId(), "Content Category", "", ""),
      true,
      ',"content_category":"',
      '"'
    ),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Content Name", "", ""), true, ',"content_name":"', '"'),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Currency", "", ""), true, ',"currency":"', '"'),
    new PlaceholderElement(
      new SimplePlaceholder(generateId(), "Predicted Lifetime Value", "", ""),
      true,
      ',"predicted_ltv":"',
      '"'
    ),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Value", "", ""), true, ',"value":"', '"'),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Content Type", "", ""), true, ',"content_type":"', '"'),
    new TextElement(","),
    new TextElement('"content_ids":'),
    // new TextElement("[", ""),
    new TextElement("[", "violet"),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Product IDs", "", ""), false),
    // new TextElement("]", ""),
    new TextElement("]", "violet"),
    new TextElement(","),
    new TextElement('"contents":'),
    // new TextElement("[", ""),
    new TextElement("[", "violet"),
    new PlaceholderElement(new SimplePlaceholder(generateId(), "Product Info", "", ""), false),
    new TextElement("]", "violet"),
    // new TextElement("]", ""),
  ]),
  // new TextElement("}", ""),
  new TextElement("}", "red"),
  // new TextElement("}", ""),
  new TextElement("}", "blue"),
  // new TextElement("]", ""),
  new TextElement("]", "orange"),
  new TextElement("}"),
];
