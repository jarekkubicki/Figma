async function loadPlugin() {
  try {
    // 1. Pobierz i załaduj UI
    const uiRes = await fetch("https://raw.githubusercontent.com/jarekkubicki/Figma/refs/heads/main/BEN_S/Bens_universal_renamer/Bens-universal-renamer/ui.html");
    const html = await uiRes.text();
    figma.showUI(html, { width: 360, height: 240 });

    // 2. Ustaw handler wiadomości po załadowaniu UI
    figma.ui.onmessage = async (msg) => {
      if (msg.type === "rename") {
        const { mode, direction } = msg;
        const selection = figma.currentPage.selection;

        if (selection.length === 0) {
          figma.notify("⚠️ Zaznacz sekcje przed uruchomieniem.");
          figma.closePlugin();
          return;
        }

        await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

        for (const section of selection) {
          if (section.type !== "SECTION") continue;

          let children = section.children.filter(
            (node) => node.parent && node.parent.id === section.id
          );

          if (direction === "horizontal") {
            children.sort((a, b) => a.x - b.x);
          } else {
            children.sort((a, b) => a.y - b.y);
          }

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
      }
    };
  } catch (err) {
    figma.notify("❌ Błąd ładowania pluginu.");
    console.error("Błąd:", err);
  }
}

loadPlugin();
