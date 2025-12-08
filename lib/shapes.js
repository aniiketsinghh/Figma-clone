import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

// CREATE RECTANGLE
export const createRectangle = (pointer) => {
  return new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  });
};

// CREATE TRIANGLE
export const createTriangle = (pointer) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  });
};

// CREATE CIRCLE
export const createCircle = (pointer) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  });
};

// CREATE LINE
export const createLine = (pointer) => {
  return new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: "#aabbcc",
      strokeWidth: 2,
      objectId: uuidv4(),
    }
  );
};

// CREATE TEXT
export const createText = (pointer, text) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    fontFamily: "Helvetica",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4(),
  });
};

// SHAPE SWITCHER
export const createSpecificShape = (shapeType, pointer) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer);
    case "triangle":
      return createTriangle(pointer);
    case "circle":
      return createCircle(pointer);
    case "line":
      return createLine(pointer);
    case "text":
      return createText(pointer, "Tap to Type");
    default:
      return null;
  }
};

// IMAGE UPLOAD
export const handleImageUpload = ({
  file,
  canvas,
  shapeRef,
  syncShapeInStorage,
}) => {
  const reader = new FileReader();

  reader.onload = () => {
    fabric.Image.fromURL(reader.result, (img) => {
      img.scaleToWidth(200);
      img.scaleToHeight(200);

      canvas.current.add(img);
      img.objectId = uuidv4();

      shapeRef.current = img;

      syncShapeInStorage(img);
      canvas.current.requestRenderAll();
    });
  };

  reader.readAsDataURL(file);
};

// CREATE SHAPE ENTRY
export const createShape = (canvas, pointer, shapeType) => {
  if (shapeType === "freeform") {
    canvas.isDrawingMode = true;
    return null;
  }

  return createSpecificShape(shapeType, pointer);
};

// MODIFY SHAPE (WIDTH / HEIGHT / PROPERTY)
export const modifyShape = ({
  canvas,
  property,
  value,
  activeObjectRef,
  syncShapeInStorage,
}) => {
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement.type === "activeSelection") return;

  if (property === "width") {
    selectedElement.set("scaleX", 1);
    selectedElement.set("width", value);
  } else if (property === "height") {
    selectedElement.set("scaleY", 1);
    selectedElement.set("height", value);
  } else {
    selectedElement.set(property, value);
  }

  activeObjectRef.current = selectedElement;

  syncShapeInStorage(selectedElement);
};

// BRING ELEMENT FRONT / BACK
export const bringElement = ({ canvas, direction, syncShapeInStorage }) => {
  if (!canvas) return;

  const selectedElement = canvas.getActiveObject();
  if (!selectedElement || selectedElement.type === "activeSelection") return;

  if (direction === "front") {
    canvas.bringToFront(selectedElement);
  } else if (direction === "back") {
    canvas.sendToBack(selectedElement);
  }

  syncShapeInStorage(selectedElement);
};
