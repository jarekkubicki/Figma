const selection = figma.currentPage.selection;

if (selection.length === 0) {
  figma.notify("Zaznacz co najmniej jeden Frame.");
  figma.closePlugin();
} else {
  let cleared = 0;

  for (const node of selection) {
    if (node.type === "FRAME") {
      const children = node.children.slice();
      for (const child of children) {
        child.remove();
      }
      cleared++;
    }
  }

  if (cleared > 0) {
    figma.notify(`Wyczyszczono ${cleared} Frame${cleared === 1 ? '' : 'y'} ✅`);
  } else {
    figma.notify("Nie znaleziono żadnych Frame'ów do wyczyszczenia.");
  }

  figma.closePlugin();
}
