figma.showUI(__html__, { width: 300, height: 220 });

figma.ui.onmessage = (msg) => {
  if (msg.type === 'find-layers') {
    const searchTerm = msg.name.toLowerCase();
    const searchInSelection = msg.inSelection;
    const matchingNodes = [];

    // Funkcja rekurencyjna
    function search(node) {
      if ("children" in node) {
        for (const child of node.children) {
          search(child);
        }
      }

      if (
        node.name &&
        node.name.toLowerCase().includes(searchTerm)
      ) {
        matchingNodes.push(node);
      }
    }

    // Gdzie szukać?
    if (searchInSelection) {
      if (figma.currentPage.selection.length === 0) {
        figma.notify("Brak zaznaczenia.");
        figma.closePlugin();
        return;
      }

      for (const selectedNode of figma.currentPage.selection) {
        search(selectedNode);
      }
    } else {
      search(figma.currentPage);
    }

    if (matchingNodes.length > 0) {
      figma.currentPage.selection = matchingNodes;
      figma.viewport.scrollAndZoomIntoView(matchingNodes);
      figma.notify(`Znaleziono ${matchingNodes.length} warstw.`);
    } else {
      figma.notify("Nie znaleziono żadnych warstw.");
    }

    figma.closePlugin();
  }
};
