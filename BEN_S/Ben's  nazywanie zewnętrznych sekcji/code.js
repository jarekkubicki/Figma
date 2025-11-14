// Funkcja, która znajduje nazwę pierwszego obiektu podrzędnego
function getFirstChildName(parent) {
    if (parent.children && parent.children.length > 0) {
      return parent.children[0].name; // Pobiera nazwę pierwszego dziecka
    }
    return null;
  }
  
  // Uruchamiane po zaznaczeniu obiektu
  figma.on('run', () => {
    const selectedNodes = figma.currentPage.selection;
  
    if (selectedNodes.length === 0) {
      figma.notify("Wybierz przynajmniej jedną sekcję.");
      return;
    }
  
    selectedNodes.forEach(node => {
      // Sprawdza, czy obiekt ma podrzędne
      const firstChildName = getFirstChildName(node);
  
      if (firstChildName) {
        // Dodaje "/" na końcu nazwy
        node.name = `${firstChildName}/`;
        figma.notify(`Nadano nazwę: ${node.name}`);
      } else {
        figma.notify("Wybrany obiekt nie ma podrzędnych.");
      }
    });
  
    figma.closePlugin();
  });
  