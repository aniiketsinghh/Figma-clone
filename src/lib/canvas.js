import { fabric } from "fabric";
import { v4 as uuid4 } from "uuid";

import { defaultNavElement } from "@/constants";
import { createSpecificShape } from "./shapes";

// initialize fabric canvas
export const initializeFabric = ({ fabricRef, canvasRef }) => {
  const canvasElement = document.getElementById("canvas");

  const canvas = new fabric.Canvas(canvasRef.current, {
    width: canvasElement?.clientWidth,
    height: canvasElement?.clientHeight,
  });

  fabricRef.current = canvas;

  return canvas;
};

// handle mouse down
export const handleCanvasMouseDown = ({
  options,
  canvas,
  selectedShapeRef,
  isDrawing,
  shapeRef,
}) => {
  const pointer = canvas.getPointer(options.e);
  const target = canvas.findTarget(options.e, false);

  canvas.isDrawingMode = false;

  // free drawing
  if (selectedShapeRef.current === "freeform") {
    isDrawing.current = true;
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 5;
    return;
  }

  canvas.isDrawingMode = false;

  if (
    target &&
    (target.type === selectedShapeRef.current ||
      target.type === "activeSelection")
  ) {
    isDrawing.current = false;
    canvas.setActiveObject(target);
    target.setCoords();
  } else {
    isDrawing.current = true;

    shapeRef.current = createSpecificShape(
      selectedShapeRef.current,
      pointer
    );

    if (shapeRef.current) {
      canvas.add(shapeRef.current);
    }
  }
};

// handle mouse move
export const handleCanvaseMouseMove = ({
  options,
  canvas,
  isDrawing,
  selectedShapeRef,
  shapeRef,
  syncShapeInStorage,
}) => {
  if (!isDrawing.current) return;
  if (selectedShapeRef.current === "freeform") return;

  canvas.isDrawingMode = false;

  const pointer = canvas.getPointer(options.e);

  switch (selectedShapeRef.current) {
    case "rectangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    case "circle":
      shapeRef.current.set({
        radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
      });
      break;

    case "triangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    case "line":
      shapeRef.current?.set({
        x2: pointer.x,
        y2: pointer.y,
      });
      break;

    case "image":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    default:
      break;
  }

  canvas.renderAll();

  if (shapeRef.current?.objectId) {
    syncShapeInStorage(shapeRef.current);
  }
};

// handle mouse up
export const handleCanvasMouseUp = ({
  canvas,
  isDrawing,
  shapeRef,
  activeObjectRef,
  selectedShapeRef,
  syncShapeInStorage,
  setActiveElement,
}) => {
  isDrawing.current = false;
  if (selectedShapeRef.current === "freeform") return;

  syncShapeInStorage(shapeRef.current);

  shapeRef.current = null;
  activeObjectRef.current = null;
  selectedShapeRef.current = null;

  if (!canvas.isDrawingMode) {
    setTimeout(() => setActiveElement(defaultNavElement), 700);
  }
};

// object modified
export const handleCanvasObjectModified = ({
  options,
  syncShapeInStorage,
}) => {
  const target = options.target;
  if (!target) return;

  if (target.type === "activeSelection") {
    // ignore for now
  } else {
    syncShapeInStorage(target);
  }
};

// freeform path created
export const handlePathCreated = ({ options, syncShapeInStorage }) => {
  const path = options.path;
  if (!path) return;

  path.set({ objectId: uuid4() });

  syncShapeInStorage(path);
};

// restrict movement within canvas
export const handleCanvasObjectMoving = ({ options }) => {
  const target = options.target;
  const canvas = target.canvas;

  target.setCoords();

  if (target.left != null) {
    target.left = Math.max(
      0,
      Math.min(
        target.left,
        canvas.width - target.getScaledWidth()
      )
    );
  }

  if (target.top != null) {
    target.top = Math.max(
      0,
      Math.min(
        target.top,
        canvas.height - target.getScaledHeight()
      )
    );
  }
};

// selection created
export const handleCanvasSelectionCreated = ({
  options,
  isEditingRef,
  setElementAttributes,
}) => {
  if (isEditingRef.current) return;
  if (!options?.selected) return;

  const selected = options.selected[0];

  if (selected && options.selected.length === 1) {
    const scaledWidth = selected.scaleX
      ? selected.width * selected.scaleX
      : selected.width;

    const scaledHeight = selected.scaleY
      ? selected.height * selected.scaleY
      : selected.height;

    setElementAttributes({
      width: scaledWidth?.toFixed(0) || "",
      height: scaledHeight?.toFixed(0) || "",
      fill: selected.fill || "",
      stroke: selected.stroke || "",
      fontSize: selected.fontSize || "",
      fontFamily: selected.fontFamily || "",
      fontWeight: selected.fontWeight || "",
    });
  }
};

// scaling
export const handleCanvasObjectScaling = ({
  options,
  setElementAttributes,
}) => {
  const selected = options.target;

  const scaledWidth = selected.scaleX
    ? selected.width * selected.scaleX
    : selected.width;

  const scaledHeight = selected.scaleY
    ? selected.height * selected.scaleY
    : selected.height;

  setElementAttributes((prev) => ({
    ...prev,
    width: scaledWidth?.toFixed(0) || "",
    height: scaledHeight?.toFixed(0) || "",
  }));
};

// render canvas from storage
export const renderCanvas = ({
  fabricRef,
  canvasObjects,
  activeObjectRef,
}) => {
  fabricRef.current?.clear();

  Array.from(canvasObjects, ([objectId, objectData]) => {
    fabric.util.enlivenObjects(
      [objectData],
      (enlivenedObjects) => {
        enlivenedObjects.forEach((obj) => {
          if (activeObjectRef.current?.objectId === objectId) {
            fabricRef.current?.setActiveObject(obj);
          }

          fabricRef.current?.add(obj);
        });
      },
      "fabric"
    );
  });

  fabricRef.current?.renderAll();
};

// resize
export const handleResize = ({ canvas }) => {
  const canvasElement = document.getElementById("canvas");
  if (!canvasElement || !canvas) return;

  canvas.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
};

// zoom
export const handleCanvasZoom = ({ options, canvas }) => {
  const delta = options.e.deltaY;
  let zoom = canvas.getZoom();

  const minZoom = 0.2;
  const maxZoom = 1;
  const zoomStep = 0.001;

  zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom);

  canvas.zoomToPoint(
    { x: options.e.offsetX, y: options.e.offsetY },
    zoom
  );

  options.e.preventDefault();
  options.e.stopPropagation();
};
