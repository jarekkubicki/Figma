// figma.showUI(__html__, { width: 360, height: 240 });

figma.ui.onmessage = (msg) => {
  if (msg.type === "rename") {
    const { mode, direction } = msg;
    const selection = figma.currentPage.selection;

    if (selection.length === 0) {
      figma.notify("⚠️ Zaznacz sekcje przed uruchomieniem.");
      figma.closePlugin();
      return;
    }

    figma.loadFontAsync({ family: "Roboto", style: "Regular" }).then(() => {
      for (const section of selection) {
        if (section.type !== "SECTION") continue;

        let children = section.children.filter(
          (node) => node.parent && node.parent.id === section.id
        );

        // sortowanie wg kierunku
        if (direction === "horizontal") {
          children.sort((a, b) => a.x - b.x);
        } else {
          children.sort((a, b) => a.y - b.y);
        }

        // logika sufiksu
        children.forEach((child, index) => {
          const prefix = section.name.trim();
          const number = index + 1;
          let name = "";

          switch (mode) {
            case "PT":
              name = `${prefix}_PT${String(number).padStart(2, "0")}`;
              break;
            case "MODULE":
              name = `${prefix}_module_${number}`;
              break;
          }

          child.name = name;
        });
      }

      figma.notify("✅ Nazwy zostały zaktualizowane!");
      figma.closePlugin();
    });
  }
};
