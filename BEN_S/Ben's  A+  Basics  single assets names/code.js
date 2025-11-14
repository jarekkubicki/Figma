// NAZYWANIE POSZCZEGÓLNYCH ASSETÓW
// A+ oraz Basics

// Pobieranie wszystkich zaznaczonych elementów
// DZIAŁANIE: pobiera nazwy 
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

      // Pobieranie sekcji "trzy piętra" wyżej (jeśli istnieje) - GETIN number
      let getinLevelsUpName = parentSections.length >= 3 ? parentSections[parentSections.length - 3] : 'Brak_sekcji 3';
      
      // Pobieranie sekcji "cztery piętra" wyżej (jeśli istnieje)- Brand Tech
      let brandLevelsUpName = parentSections.length >= 4 ? parentSections[parentSections.length - 4] : 'Brak_sekcji 4';



      // Nazwa pliku: ( pierwsza warstwa) - asset type
      const lastSegment = `${firstLayerName}`;

      // Tworzenie nowej nazwy całości
      const newName = `${getinLevelsUpName}_${brandLevelsUpName}_${lastSegment}`;
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
