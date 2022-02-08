let currentWidgetCount = 1;
let currentSplitterCount = 1;

function widgetCounter() {
  return currentWidgetCount++;
}

function splitterCounter() {
  return currentSplitterCount++;
}

// function uuidv4() {
//   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//     (
//       (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//     ).toString(16)
//   );
// }

export function generateWidget(height, width, split = "vertical", key = widgetCounter()) {
  return {
    key: key,
    split: split,
    panes: [],
    height: height,
    width: width,
    data: "#ffcdd2",
  };
}

export function generateSplitter(
  height,
  width,
  split = "vertical",
  panes = [generateWidget(height, width)]
) {
  return {
    key: `Splitter ${splitterCounter()}`,
    split: split,
    panes: [...panes],
    height: height,
    width: width,
    data: "#ffcdd2",
  };
}
