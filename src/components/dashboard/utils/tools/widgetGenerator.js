export function uuidv4() {
  return ([1e3] + 0).replace(/[018]/g, (c) =>
    (
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}


export function generateWidget(title, size=100, split = "vertical", key = uuidv4()) {
  return {
    title: title,
    key: key,
    split: split,
    panes: [],
    size: size,
    data: "#ffcdd2",
  };
}

export function generateSplitter(
  title,
  widgetSize,
  size=100,
  split = "vertical",
  panes = [generateWidget(title, widgetSize)]
) {
  return {
    key: uuidv4(),
    split: split,
    panes: [...panes],
    size: Math.round(size),
    data: "#ffcdd2",
  };
}
