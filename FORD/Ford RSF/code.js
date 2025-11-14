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

      // Pobieranie sekcji "pietro wyzej" - rozdzielczosc
      let resolutionLevelsUpName = parentSections.length >= 1 ? parentSections[parentSections.length - 1] : 'Brak_sekcji 1';

      // Pobieranie sekcji "dwa pietra wyzej" - image number
      let imageLevelsUpName = parentSections.length >= 2 ? parentSections[parentSections.length - 2] : 'Brak_sekcji 2';

      // Pobieranie sekcji "trzy piętra" wyżej - Publisher
      let publisherLevelsUpName = parentSections.length >= 3 ? parentSections[parentSections.length - 3] : 'Brak_sekcji 3';
      
      // Pobieranie sekcji "cztery piętra" wyżej - Car Line
      let carlineLevelsUpName = parentSections.length >= 4 ? parentSections[parentSections.length - 4] : 'Brak_sekcji 4';

      // Pobieranie sekcji "pięć piętra" wyżej - PAGE - Language
      let languageLevelsUpName = parentSections.length >= 5 ? parentSections[parentSections.length - 5] : 'Brak_sekcji 5';


      // Nazwa pliku: ( pierwsza warstwa) - asset type
      const lastSegment = `${firstLayerName}`;

      // Tworzenie nowej nazwy całości
      const newName = `STATIC_WPP_FORD_${carlineLevelsUpName}_RSF-T2_${languageLevelsUpName}_${publisherLevelsUpName}_${resolutionLevelsUpName}_${imageLevelsUpName}_${lastSegment}`;
      node.name = newName;
    }
  });

  figma.notify("Nazwy elementów zostały zaktualizowane.");
  figma.closePlugin();
}

// Funkcja pomocnicza do sprawdzenia, czy element jest frame'em, sekcją, komponentem lub instancją
function isValidNodeType(node) {
  return node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE' || node.type === 'GROUP' || node.type === 'PAGE' || node.type === 'SECTION';
}

// Funkcja pobierająca wszystkie nadrzędne nazwy aż do strony włącznie (PAGE)
function getAllParentNames(node) {
  let parent = node.parent;
  let parentNames = [];

  while (parent) {
    if (parent.name) {
      parentNames.unshift(parent.name.replace(/\s+/g, '').replace(/\//g, ''));
    }

    // Po dodaniu PAGE przerywamy
    if (parent.type === 'PAGE') {
      break;
    }

    parent = parent.parent;
  }

  return parentNames.length > 0 ? parentNames : ['Root'];
}
