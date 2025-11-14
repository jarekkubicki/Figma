// Ben’s | Universal Renamer — code.js (UI unchanged)
// Fixes: `selection` scope, dynamic naming order, move last N sections after firstLayerName

figma.showUI(__html__, { width: 320, height: 250 });

figma.ui.onmessage = (msg) => {
  if (msg.type === 'rename-assets') {
    const fyInput = msg.fy;
    const prefixToken = fyInput ? `FY${fyInput}` : '';

    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify('Select elements to rename.');
      figma.closePlugin();
      return;
    }

    // --- CONFIG --- (arrays in one line)
    const namingOrder = ['prefix','tml','sections','firstLayer','lastSections'];
    const moveCount = 2; // how many trailing sections to move behind firstLayerName

    selection.forEach((node) => {
      if (!isValidNodeType(node)) return;

      const parentSections = getAllParentNames(node);
      const firstLayerName = node.children && node.children.length > 0 ? node.children[0].name : 'No_layer';

      // Work on arrays to avoid issues with underscores inside names
      const sections = parentSections.slice(); // copy
      const lastSections = sections.splice(-moveCount, moveCount);

      const tokens = {
        prefix: prefixToken,
        tml: 'TML',
        sections: sections.join('_'),
        firstLayer: firstLayerName,
        lastSections: lastSections.join('_'),
      };

      const newName = namingOrder.map((k) => tokens[k]).filter(Boolean).join('_');
      node.name = newName;
    });

    figma.notify('Element names updated.');
    figma.closePlugin();
  }
};

function isValidNodeType(node) {
  return (
    node.type === 'FRAME' ||
    node.type === 'COMPONENT' ||
    node.type === 'INSTANCE' ||
    node.type === 'GROUP' ||
    node.type === 'SECTION'
  );
}

function getAllParentNames(node) {
  let parent = node.parent;
  const parentNames = [];
  while (parent && parent.type !== 'PAGE') {
    if (parent.name) {
      const cleanedName = parent.name.replace(/\s+/g, '').replace(/\//g, '');
      parentNames.unshift(cleanedName);
    }
    parent = parent.parent;
  }
  return parentNames.length > 0 ? parentNames : ['Root'];
}
