figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = msg => {
  if (msg.type === 'generate-frames') {
    const formats = msg.text.match(/\d+x\d+/g);
    let x = 0, y = 0;
    const padding = 50;

    formats.forEach(size => {
      const [w, h] = size.split('x').map(Number);
      const frame = figma.createFrame();
      frame.resize(w, h);
      frame.name = `${w}x${h}`;
      frame.x = x;
      frame.y = y;
      x += w + padding;
      if (x > 4000) { x = 0; y += h + padding; }
    });

    figma.closePlugin("Frame'y utworzone!");
  }
};