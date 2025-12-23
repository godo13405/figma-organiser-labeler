const _selected = figma.currentPage.selection;
const _baseSize = 8;
const _progressWidth = 400;
const _progressHeight = _baseSize;

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
  // set initials
  const initialsQ = new RegExp(/[A-Z]/, "g");
  const initials = `${user.match(initialsQ)[0]}${user.match(initialsQ)[1]}`;

  // set author data on selected
  _selected.forEach((node) => {
    node.setPluginData("authorFullName", user);
    node.setPluginData("authorInitials", initials);
  });

  return initials;
};

const setTitle = ({ state }) => {
  console.log("🚀 ~ setTitle ~ state:", state);
  // is 1 node at least selected?
  if (_selected.length) {
    if (state.length)
      // only assign a single state
      state = state[0];

    const output = {
      state: `${state.marker} ${state.label}`,
      author: setAuthor(figma.currentUser!.name),
    };

    // loop over selection
    const selection = _selected;
    selection.map((selected) => {
      // let's make sure the name isn't erased. Let's extract it from the name
      const title = selected.name.split(/\] /gm);
      const titleArr = title.slice(title.length - 1, title.length)[0];

      selected.name = `{${output.state}} [${output.author}] ${
        titleArr[0] || selected.name
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

const createProgReport = (arr) => {
  // create container
  const progBar = figma.createFrame();
  progBar.name = "Progress";
  progBar.layoutMode = "HORIZONTAL";
  progBar.layoutAlign = "STRETCH";
  progBar.primaryAxisSizingMode = "FIXED";
  progBar.counterAxisSizingMode = "AUTO";
  progBar.cornerRadius = _baseSize;
  progBar.fills = [
    {
      type: "SOLID",
      color: hexToRgb("#ddd"),
    },
  ];
  progBar.strokes = [
    {
      type: "SOLID",
      color: hexToRgb("#fff"),
    },
  ];
  progBar.itemSpacing = 1;
  progBar.resize(_progressWidth, _progressHeight);

  // get what 100% is by adding the length of all arrays
  const keys = Object.keys(arr);
  let total = 0;
  keys.map((stat) => {
    total += arr[stat].length;
  });

  // set each status and resize it
  keys.map((k) => {
    const status = findStatus(k.replace(/^[^\w]+/, "").trim()) || {
      marker: null,
      label: null,
      color: null,
    };

    const stat = arr[k];
    const ratio = stat.length / total;

    const prog = figma.createFrame();
    prog.name = `${status.marker} ${status.label} ${ratio * 100}%`;
    prog.layoutMode = "HORIZONTAL";
    prog.layoutAlign = "STRETCH";
    prog.primaryAxisSizingMode = "FIXED";
    prog.resize(_progressWidth * ratio, _progressHeight);
    prog.counterAxisSizingMode = "FIXED";
    prog.fills = [
      {
        type: "SOLID",
        color: hexToRgb(status.color),
      },
    ];

    progBar.appendChild(prog);
  });
  return progBar;
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

  const NAME_REGEX = /^\{.*?\}\s\[[A-Z]{2}\]/;

  // find all sections
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

  // create progress report
  headerContainer.appendChild(createProgReport(orgMatches));

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
    container.appendChild(
      await createTextRow(group, {
        size: 18,
        weight: "Semi Bold",
        color: { r: 0.1, g: 0.1, b: 0.1 },
      })
    );

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

interface OptionsArr {
  label: string;
  marker: string;
  color: string;
}

let options: OptionsArr[] = [];

const getOptions = ({
  option = [
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
  ],
  addRemove,
}: {
  option?;
  addRemove?;
} = {}) => {
  // if options is empty, populate with default
  if (!options.length) options.push(...option);

  if (addRemove == "add") {
    options.push(option);
    //   } else if (addRemove == "remove") {
  }

  return options;
};

options = getOptions();

figma.ui.onmessage = ({
  fn = "setTitle",
  state = {
    label: "To Do",
    marker: "⚪️",
  },
}) => {
  switch (fn) {
    default:
      setTitle({ state });
      break;
  }
};

if (figma.command) {
  // if a command was passed as a shortcut
  // process string to match state label
  if (figma.command == "config") {
    figma.showUI(__html__);
    // pass command to the UI
    figma.ui.postMessage({
      type: "command",
      command: figma.command,
    });
    // pass options to the UI
    figma.ui.postMessage({
      type: "options",
      options,
    });
  } else if (figma.command == "report") {
    // can take a while, so set a loading message
    figma.notify(`Generating report…`);

    runReport().then(() => {
      figma.closePlugin();
    });
  } else if (figma.command == "assign-status") {
    figma.showUI(__html__, { width: 200, height: 300 });
    // pass command to the UI
    figma.ui.postMessage({
      type: "command",
      command: figma.command,
    });
    // pass options to the UI
    figma.ui.postMessage({
      type: "options",
      options,
    });
  } else {
    const cmd = figma.command.slice(8, figma.command.length).replace("-", " ");

    // find the state by matching the label
    const state = findStatus(cmd);
    setTitle({ state });
    figma.closePlugin();
  }
}
