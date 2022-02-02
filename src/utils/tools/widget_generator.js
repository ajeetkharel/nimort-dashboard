let currentWidgetCount = 1;
let currentSplitterCount = 1;

function widgetCounter() {
  return currentWidgetCount++;
}

function splitterCounter() {
  return currentSplitterCount++;
}

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
