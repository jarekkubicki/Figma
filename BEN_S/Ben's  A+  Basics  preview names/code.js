//nazywanie sekcji preview A+ oraz Basics
// Pobieranie wszystkich zaznaczonych elementów
const selection = figma.currentPage.selection;

if (selection.length === 0) {
  figma.notify("Wybierz elementy, aby zmienić ich nazwy.");
  figma.closePlugin();
} else {
  selection.forEach(node => {
    if (isValidNodeType(node)) {
      // Pobieranie wszystkich nazw sekcji nadrzędnych
      let parentSections = getAllParentNames(node);
      let firstLayerName = node.children && node.children.length > 0 ? node.children[0].name : 'Brak_warstwy';
      
      // Pobieranie sekcji dwa piętra wyżej
      let twoLevelsUpName = parentSections.length >= 2 ? parentSections[parentSections.length - 2] : 'Brak_sekcji';



      // Tworzenie nowej nazwy całości
      const newName = `${twoLevelsUpName}_preview`;
      node.name = newName;
    }
  });

  figma.notify("Nazwy elementów zostały zaktualizowane.");
  figma.closePlugin();
}

// Funkcja pomocnicza do sprawdzenia, czy element jest frame'em, sekcją, komponentem lub instancją
function isValidNodeType(node) {
  return node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE' || node.type === 'GROUP' || node.type === 'SECTION';
}

// Funkcja pobierająca wszystkie nadrzędne nazwy aż do strony (PAGE)
function getAllParentNames(node) {
  let parent = node.parent;
  let parentNames = [];

  // Przeszukiwanie hierarchii w górę, aż do strony
  while (parent && parent.type !== 'PAGE') {
    if (parent.name) {
      // Usuwanie spacji oraz znaków "/"
      parentNames.unshift(parent.name.replace(/\s+/g, '').replace(/\//g, '')); 
    }
    parent = parent.parent;
  }

  // Jeśli brak nadrzędnych nazw, zwracamy 'Root'
  return parentNames.length > 0 ? parentNames : ['Root'];
}
