function sortLayers(parent) {
  const unlockedChildren = parent.children.filter(child => !child.locked);
  unlockedChildren.sort((a, b) => b.name.localeCompare(a.name));
  unlockedChildren.forEach((child, index) => {
    parent.insertChild(index, child);
  });
}

const selection = figma.currentPage.selection;

if (selection.length === 0) {
  figma.notify("Please select at least one object with layers to sort.");
  figma.closePlugin();
} else {
  for (const node of selection) {
    if ("children" in node) {
      sortLayers(node);
    }
  }
  figma.notify("Layers sorted A–Z ✅");
  figma.closePlugin();
}
