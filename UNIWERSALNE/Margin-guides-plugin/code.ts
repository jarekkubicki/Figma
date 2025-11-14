figma.showUI(__html__, { width: 260, height: 250 });

figma.ui.onmessage = async (msg) => {
  const selectedFrames = figma.currentPage.selection.filter(
  node =>
    node.type === 'FRAME' ||
    node.type === 'COMPONENT' ||
    node.type === 'INSTANCE'
);


  if (selectedFrames.length === 0) {
    figma.notify("Select at least one Frame");
    return;
  }

  const { percent, opacity, color } = msg;

  if (msg.type === 'remove-guides') {
    for (const frame of selectedFrames) {
      const old = frame.findChild(n => n.name === 'guidelines');
      if (old) old.remove();
    }
    figma.notify("Guidelines removed");
    return;
  }

  if (msg.type === 'toggle-guides') {
    for (const frame of selectedFrames) {
      const guide = frame.findChild(n => n.name === 'guidelines');
      if (guide) guide.visible = !guide.visible;
    }
    figma.notify("Guidelines visibility toggled");
    return;
  }

  if (msg.type === 'apply-guides') {
    if (isNaN(percent) || percent <= 0 || percent >= 50) {
      figma.notify("Enter margin between 1% and 49%");
      return;
    }

    if (isNaN(opacity) || opacity <= 0 || opacity > 100) {
      figma.notify("Enter opacity between 1% and 100%");
      return;
    }

    // Convert hex color to RGB
    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return { r, g, b };
    }

    let paintStyle = figma.getLocalPaintStyles().find(s => s.name === 'GuidesColor');
    if (!paintStyle) {
      paintStyle = figma.createPaintStyle();
      paintStyle.name = 'GuidesColor';
    }
    paintStyle.paints = [{
      type: 'SOLID',
      color: hexToRgb(color)
    }];

    for (const frame of selectedFrames) {
      const height = frame.height;
      const width = frame.width;
      const margin = (percent / 100) * height;

      const old = frame.findChild(n => n.name === 'guidelines');
      if (old) old.remove();

      const overlays = [];

      const makeRect = () => {
        const rect = figma.createRectangle();
        rect.fills = [];
        rect.fillStyleId = paintStyle.id;
        rect.opacity = opacity / 100;
        frame.appendChild(rect);
        return rect;
      };

      const top = makeRect();
      top.resize(width, margin);
      top.y = 0;
      overlays.push(top);

      const bottom = makeRect();
      bottom.resize(width, margin);
      bottom.y = height - margin;
      overlays.push(bottom);

      const left = makeRect();
      left.resize(margin, height);
      left.x = 0;
      overlays.push(left);

      const right = makeRect();
      right.resize(margin, height);
      right.x = width - margin;
      overlays.push(right);

      const flattened = figma.flatten(overlays, frame);
      flattened.name = 'guidelines';
      flattened.locked = true;
    }

    figma.notify("Guidelines added ✅");
  }
};
