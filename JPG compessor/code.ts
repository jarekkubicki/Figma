import { encode, decode } from '@wasmer/mozjpeg';

// Pokaż interfejs użytkownika (opcjonalnie)
figma.showUI(__html__, { width: 300, height: 200 });

// Funkcja do eksportowania frame'ów
async function exportFrames() {
  const frames = figma.currentPage.selection;

  if (frames.length === 0) {
    figma.notify("Wybierz przynajmniej jeden frame!");
    return;
  }

  for (const frame of frames) {
    if (frame.type === "FRAME") {
      // Wyciąganie docelowej wielkości pliku z nazwy frame'a
      const regex = /--(\d+)/;
      const match = frame.name.match(regex);
      if (match) {
        const targetSizeKB = parseInt(match[1], 10);

        // Eksportowanie obrazu
        const jpgImage = await frame.exportAsync({ format: "JPG" });

        // Kompresja obrazu
        let compressedImage = await compressImage(jpgImage, targetSizeKB);

        // Przekazanie obrazu do interfejsu użytkownika
        figma.ui.postMessage({ type: 'save-image', data: compressedImage });
      } else {
        figma.notify(`Frame "${frame.name}" nie ma określonego docelowego rozmiaru.`);
      }
    }
  }
}

// Funkcja do kompresji obrazu
async function compressImage(imageBuffer: Uint8Array, targetSizeKB: number) {
  let quality = 1.0;
  let imageSizeKB = imageBuffer.byteLength / 1024;

  // Iteracyjna kompresja, zmniejszając jakość obrazu
  while (imageSizeKB > targetSizeKB && quality > 0) {
    quality -= 0.05;  // Zmniejszanie jakości
    imageBuffer = await recompress(imageBuffer, quality);
    imageSizeKB = imageBuffer.byteLength / 1024;
  }

  return imageBuffer;
}

// Funkcja do faktycznej rekompresji obrazu przy użyciu mozjpeg
async function recompress(imageBuffer: Uint8Array, quality: number): Promise<Uint8Array> {
  const decodedImage = await decode(imageBuffer);
  const compressedImage = await encode(decodedImage, {
    quality: quality * 100 // jakość w % (0-100)
  });

  return compressedImage;
}

// Nasłuchiwanie na akcje z UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export') {
    await exportFrames();
    figma.notify("Eksport i kompresja zakończona!");
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
