// Główny kod pluginu
figma.showUI(`<script>window.close();</script>`); // Zamknięcie okna UI (jeśli nie jest potrzebne)

// Pobierz wszystkie wybrane elementy
const selection = figma.currentPage.selection;

// Sprawdź, czy wybrano jakieś elementy
if (selection.length === 0) {
  figma.notify("Please select an instance, frame, or component.");
  figma.closePlugin();
} else {
  // Iteruj przez wybrane elementy
  for (const node of selection) {
    if (node.type === "INSTANCE" || node.type === "FRAME" || node.type === "COMPONENT") {
      // Pobierz wszystkie dzieci (layers) elementu
      const children = node.children;

      if (children.length > 0) {
        // Użyj nazwy ostatniego layera
        const lastLayer = children[children.length - 1];
        const lastLayerName = lastLayer.name;

        // Znajdź rodzica elementu (sekcję)
        const parentSection = node.parent && node.parent.name ? node.parent.name : "No Section";

        // Stwórz nową nazwę w formacie: nazwa_ostatniego_layera / nazwa_sekcji _ nazwa_ostatniego_layera
        const newName = `${lastLayerName}/${parentSection}_${lastLayerName}`;

        // Ustaw nazwę elementu
        node.name = newName;

        figma.notify(`${node.type} renamed to: ${newName}`);
      } else {
        figma.notify(`Selected ${node.type.toLowerCase()} has no layers.`);
      }
    } else {
      figma.notify("Please select an instance, frame, or component.");
    }
  }

  // Zamknij plugin
  figma.closePlugin();
}
