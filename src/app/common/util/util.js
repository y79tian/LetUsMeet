export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function createDataTree(dataset) {
  let map = Object.create(null);

  dataset.forEach((a) => (map[a.id] = { ...a, childNodes: [] }));

  let dataTree = [];

  dataset.forEach((a) => {
    if (a.parentId) map[a.parentId].childNodes.push(map[a.id]);
    else dataTree.push(map[a.id]);
  });

  return dataTree;
}
