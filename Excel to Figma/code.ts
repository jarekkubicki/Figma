import * as XLSX from 'xlsx';  // Importujemy bibliotekę do obsługi Excel

// Pokaż UI wtyczki, który załaduje plik Excel
figma.showUI(__html__);

// Nasłuchiwanie wiadomości z UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'load-excel') {
    const workbook = XLSX.read(msg.data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];  // Pobierz pierwszy arkusz
    const sheet = workbook.Sheets[sheetName];
    const names = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Sprawdzenie, czy dane istnieją
    if (names.length === 0) {
      figma.notify("Plik Excel jest pusty");
      return;
    }

    // Zmiana nazw zaznaczonych elementów w Figmie
    const selectedNodes = figma.currentPage.selection;
    if (selectedNodes.length === 0) {
      figma.notify("Wybierz elementy w Figmie");
      return;
    }

    selectedNodes.forEach((node, index) => {
      if (names[index] && names[index][0]) {
        node.name = names[index][0];  // Ustaw nazwę na podstawie Excela
      }
    });

    figma.notify("Nazwy zostały zmienione");
    figma.closePlugin();
  }
};
