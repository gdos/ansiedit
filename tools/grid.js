function gridTool(editor, codepage, retina) {
    "use strict";
    var gridLight, gridDark, gridMode;

    function createGrid(rgba, highlightedRGBA) {
        var canvasGrid, ctx, imageData, byteWidth, y, x, i;
        canvasGrid = ElementHelper.create("canvas", {"width": 80 * (retina ? 16 : 8), "height": editor.height * (retina ? 32 : 16), "style": {"width": "640px", "height": (editor.height * 16) + "px"}});
        ctx = canvasGrid.getContext("2d");
        imageData = ctx.createImageData(canvasGrid.width, canvasGrid.height);
        byteWidth = canvasGrid.width * 4;
        for (y = 1; y < editor.height; ++y) {
            for (x = 0, i = y * codepage.fontHeight * byteWidth; x < canvasGrid.width; ++x, i += 4) {
                imageData.data.set(rgba, i);
            }
        }
        for (x = 1; x < 80; ++x) {
            for (y = 0, i = x * codepage.fontWidth * 4; y < canvasGrid.height; ++y, i += byteWidth) {
                imageData.data.set((x === 40) ? highlightedRGBA : rgba, i);
            }
        }
        ctx.putImageData(imageData, 0, 0);
        return canvasGrid;
    }

    gridMode = 0;
    gridLight = createGrid(new Uint8Array([255, 255, 255, 64]), new Uint8Array([255, 255, 255, 200]));
    gridDark = createGrid(new Uint8Array([0, 0, 0, 64]), new Uint8Array([0, 0, 0, 255]));

    function init() {
        switch (++gridMode) {
        case 1:
            editor.addOverlay(gridLight, "grid");
            break;
        case 2:
            editor.addOverlay(gridDark, "grid");
            break;
        default:
            editor.removeOverlay("grid");
            gridMode = 0;
        }
        return false;
    }

    function toString() {
        switch (gridMode) {
        case 1:
            return "Grid: Light";
        case 2:
            return "Grid: Dark";
        default:
            return "Grid: Off";
        }
    }

    function isEnabled() {
        return gridMode > 0;
    }

    return {
        "init": init,
        "toString": toString,
        "isEnabled": isEnabled,
        "uid": "grid"
    };
}