const selection = figma.currentPage.selection;

if (selection.length === 0) {
  figma.notify("⚠️ Zaznacz przynajmniej jedną sekcję.");
  figma.closePlugin();
}

figma.loadFontAsync({ family: "Roboto", style: "Regular" }).then(() => {
  for (const section of selection) {
    if (section.type !== "SECTION") continue;

    const children = section.children
      .filter(node => node.parent && node.parent.id === section.id)
      .sort((a, b) => a.x - b.x);

    children.forEach((child, index) => {
      const prefix = section.name.trim();
      const number = String(index + 1).padStart(2, "0");
      child.name = `${prefix}_PT${number}`;
    });
  }

  figma.notify("✅ Nazwy obiektów zostały zmienione");
  figma.closePlugin();
});
