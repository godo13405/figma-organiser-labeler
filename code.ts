const _baseSize = 8;
const _progressWidth = 400;
const _progressHeight = _baseSize;

const _frame = { width: 240, height: 400 };

const hexToRgb = (hex) => {
  // Remove leading #
  hex = hex.replace(/^#/, "");

  // Convert 3-digit shorthand
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  return { r, g, b };
};

const _color = {
  background: hexToRgb("#eee"),
  stroke: hexToRgb("#fff"),
};

const setAuthor = (user) => {
  const selected = figma.currentPage.selection;
  // set initials
  const initialsQ = new RegExp(/[A-Z]/, "g");
  const initials = `${user.match(initialsQ)[0]}${user.match(initialsQ)[1]}`;

  // set author data on selected
  selected.forEach((node) => {
    node.setPluginData("authorFullName", user);
    node.setPluginData("authorInitials", initials);
  });

  return initials;
};

const setTitle = ({ state }) => {
  // is 1 node at least selected?
  const selected = figma.currentPage.selection;
  if (selected.length) {
    if (state.length)
      // only assign a single state
      state = state[0];

    const output = {
      state: `${state.marker} ${state.label}`,
      author: setAuthor(figma.currentUser!.name),
    };

    // loop over selection
    const selection = selected;
    selection.map((selected) => {
      // let's make sure the name isn't erased. Let's extract it from the name
      const title = selected.name.split(/\] /gm);
      const titleArr = title.slice(title.length - 1, title.length)[0];

      selected.name = `{${output.state}} [${output.author}] ${
        titleArr || selected.name
      }`;
    });

    figma.notify(`${selection.length} now set to ${output.state}`);
  } else {
    figma.notify("please select at least 1 object");
  }
};

const writeLine = async (node) => {
  const line = figma.createFrame();
  //   line.resize(720, 1024);

  // ✅ Enable Auto Layout
  line.layoutMode = "VERTICAL";
  line.primaryAxisSizingMode = "AUTO";
  line.counterAxisSizingMode = "AUTO";

  // padding
  line.paddingTop = 8;
  line.paddingBottom = 8;
  line.paddingLeft = 8;
  line.paddingRight = 8;
  line.itemSpacing = 8;

  // add selection name
  const name = node.name.replace(/^\{.*?\}\s\[[A-Z]{2}\]/g, "").trim();
  line.appendChild(await createTextRow(name));

  // add author name
  const authorName = `by ${
    node.getPluginData("authorFullName") || "Unknown author"
  }`;

  line.appendChild(
    await createTextRow(authorName, {
      size: 12,
      color: { r: 0.4, g: 0.4, b: 0.4 },
    })
  );

  return line;
};

const createFrame = () => {
  const frame = figma.createFrame();
  frame.name = "Status Report";

  // ✅ Enable Auto Layout
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";

  // padding
  frame.paddingTop = _baseSize * 2;
  frame.paddingBottom = _baseSize * 2;
  frame.paddingLeft = _baseSize * 2;
  frame.paddingRight = _baseSize * 2;
  frame.itemSpacing = _baseSize;

  // Center in viewport
  const center = figma.viewport.center;
  frame.x = center.x - frame.width / 2;
  frame.y = center.y - frame.height / 2;

  frame.cornerRadius = _baseSize * 2;

  frame.fills = [{ type: "SOLID", color: _color.background }];
  frame.strokes = [{ type: "SOLID", color: _color.stroke }];

  return frame;
};

const createTextRow = async (
  text,
  args?: { color?: { r: number; g: number; b: number }; size?; weight? }
) => {
  if (!args) args = {};
  if (!args.color) args.color = { r: 0, g: 0, b: 0 };
  if (!args.size) args.size = 14;
  if (!args.weight) args.weight = "Regular";
  const node = figma.createText();

  await figma.loadFontAsync({
    family: "Inter",
    style: args.weight,
  });

  node.characters = text;
  node.fontSize = args.size;
  node.fills = [{ type: "SOLID", color: args.color }];
  node.layoutAlign = "STRETCH";

  return node;
};

const findExistingReport = () => {
  return figma.currentPage.findOne(
    (node) => node.type === "FRAME" && node.name === "Status Report"
  ) as FrameNode;
};

const runReport = async () => {
  let frame = findExistingReport();

  if (!frame) {
    frame = createFrame();
    figma.currentPage.appendChild(frame);
  } else {
    // Clear existing content
    frame.children.forEach((child) => child.remove());
  }

  // ✅ Font must be loaded BEFORE setting characters
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // create container for header
  const headerContainer = figma.createFrame();
  headerContainer.name = "Status Report Header";
  headerContainer.layoutMode = "HORIZONTAL";
  headerContainer.primaryAxisSizingMode = "AUTO";
  headerContainer.counterAxisSizingMode = "AUTO";
  headerContainer.itemSpacing = _baseSize;
  headerContainer.fills = [{ type: "SOLID", color: _color.background }];

  // set report title
  const reportTitle = await createTextRow("Status Report", {
    size: 24,
    weight: "Semi Bold",
  });
  reportTitle.layoutAlign = "MIN";
  headerContainer.appendChild(reportTitle);

  // find all sections
  const NAME_REGEX = /^\{.*?\}\s\[[A-Z]{2}\]/;
  const matches = figma.currentPage.findChildren((node) => {
    return node.type === "SECTION" && NAME_REGEX.test(node.name);
  });

  // go over each match and distribute by status
  const orgMatches = {};

  // create groups per status
  for (const node of matches) {
    // find the status name
    const status = node.name
      .match(/^\{.*?\}/g)![0]
      .replace("{", "")
      .replace("}", "");

    // if it doesn't exist already, create an array under the status name
    if (!orgMatches[status]) {
      orgMatches[status] = [];
    }

    orgMatches[status].push(node);
  }

  frame.appendChild(headerContainer);

  // create reporting container
  const reportContainer = figma.createFrame();
  reportContainer.name = "Report Container";
  reportContainer.layoutMode = "HORIZONTAL";
  reportContainer.primaryAxisSizingMode = "AUTO";
  reportContainer.counterAxisSizingMode = "AUTO";
  reportContainer.itemSpacing = _baseSize;
  reportContainer.counterAxisSpacing = _baseSize;
  reportContainer.fills = [
    {
      type: "SOLID",
      color: _color.background,
    },
  ];

  // create status group
  for (const group of Object.keys(orgMatches)) {
    // get count
    const count = orgMatches[group].length;

    // create group container
    const container = figma.createFrame();
    container.layoutMode = "VERTICAL";
    container.layoutAlign = "STRETCH";
    container.primaryAxisSizingMode = "AUTO";
    container.counterAxisSizingMode = "AUTO";
    container.paddingTop = _baseSize * 2;
    container.paddingBottom = _baseSize * 2;
    container.paddingLeft = _baseSize * 2;
    container.paddingRight = _baseSize * 2;
    container.itemSpacing = _baseSize;
    container.cornerRadius = 8;
    container.fills = [
      {
        type: "SOLID",
        color: hexToRgb("#fff"),
      },
    ];

    // add title
    const title = await createTextRow(group, {
      size: 18,
      weight: "Semi Bold",
      color: { r: 0, g: 0, b: 0 },
    });

    const titleContainer = figma.createFrame();
    titleContainer.layoutMode = "HORIZONTAL";
    titleContainer.layoutAlign = "STRETCH";
    titleContainer.primaryAxisSizingMode = "FIXED";
    titleContainer.counterAxisSizingMode = "AUTO";
    titleContainer.paddingTop = _baseSize;
    titleContainer.paddingBottom = _baseSize;
    titleContainer.paddingLeft = _baseSize;
    titleContainer.paddingRight = _baseSize;
    titleContainer.strokes = [
      {
        type: "SOLID",
        color: hexToRgb("#aaa"),
      },
    ];
    titleContainer.strokeBottomWeight = 1;

    titleContainer.appendChild(title);

    const countText = await createTextRow(`${count}`, {
      size: 18,
      color: { r: 0, g: 0, b: 0 },
    });
    titleContainer.appendChild(countText);

    container.appendChild(titleContainer);
    title.layoutSizingHorizontal = "FILL";

    // add items
    for (const node of orgMatches[group]) {
      const line = await writeLine(node);
      container.appendChild(line);
    }

    reportContainer.appendChild(container);
  }

  frame.appendChild(reportContainer);

  figma.notify(`${matches.length} added to report`);
};

const findStatus = (statName) => {
  const out = options.filter(({ label }) => label == statName);

  if (out.length) {
    return out[0];
  }
};

const optionsDefault = [
  {
    label: "Done",
    marker: "🟢",
    color: "#00C200",
  },
  {
    label: "To Do",
    marker: "⚪️",
    color: "#fafafa",
  },
  {
    label: "In Progress",
    marker: "🟡",
    color: "#FFD700",
  },
  {
    label: "Design Review",
    marker: "🎨",
    color: "#E79800",
  },
  {
    label: "Code Review",
    marker: "💠",
    color: "#4a90dfff",
  },
  {
    label: "Placeholder",
    marker: "🪧",
    color: "#bbb",
  },
  {
    label: "QA",
    marker: "🔎",
    color: "#555",
  },
  {
    label: "Blocked",
    marker: "🔴",
    color: "#EC0000",
  },
];

const getOptions = (option = optionsDefault) => {
  // check for previously saved options
  const _options = []; // JSON.parse(figma.root.getPluginData("options"));

  // if an empty array is passed, reset options to this function's default
  if (!option.length) {
    option = optionsDefault;
    figma.notify("Statuses reset to default");
  } else if (_options && _options.length) {
    option = _options;
  }

  // update stored satuses
  figma.root.setPluginData("options", JSON.stringify(option));
  return option;
};

const figmaCommand = (command) => {
  switch (command) {
    case "config":
    case "assign":
      figma.showUI(__html__, { width: _frame.width, height: _frame.height });
      // fire initial selection logic
      figma.ui.postMessage({
        type: "selection",
        options: figma.currentPage.selection,
      });

      // pass command to the UI
      figma.ui.postMessage({
        type: "command",
        command: command,
      });
      // pass options to the UI
      figma.ui.postMessage({
        type: "options",
        options,
      });
      figma.ui.postMessage({
        type: "selection",
        options: figma.currentPage.selection,
      });
      // keep up with selection
      figma.on("selectionchange", () => {
        figma.ui.postMessage({
          type: "selection",
          options: figma.currentPage.selection,
        });
      });
      break;
    case "report":
      // can take a while, so set a loading message
      figma.notify(`Generating report…`);

      runReport().then(() => {
        figma.closePlugin();
      });
      break;
    default:
      setTitle({
        state: findStatus(command.slice(8, command.length).replace("-", " ")),
      });
      figma.closePlugin();
      break;
  }
};

const options = getOptions();

figma.ui.onmessage = ({
  fn,
  state,
  options,
}: { fn?; state?; options? } = {}) => {
  if (!state)
    state = {
      label: "To Do",
      marker: "⚪️",
    };
  switch (fn) {
    case "reset":
      figmaCommand(figma.command);
      break;
    case "resetOptions":
      options = getOptions([]);
      figmaCommand(figma.command);
      break;
    case "saveChanges":
      figma.root.setPluginData("options", JSON.stringify(options));
      figmaCommand(figma.command);
      figma.notify(`Changes saved`);
      break;
    default:
      setTitle({ state });
      break;
  }
};

if (figma.command) {
  figmaCommand(figma.command);
}
