import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import { useMutation, useRedo, useStorage, useUndo } from "../liveblocks.config";
import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvasZoom,
  handlePathCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "../lib/canvas";
import { handleDelete, handleKeyDown } from "../lib/key-events";
import { LeftSidebar, Live, Navbar, RightSidebar } from "../components";
import { handleImageUpload } from "../lib/shapes";
import { defaultNavElement } from "../constants";

const Home = () => {
  const undo = useUndo();
  const redo = useRedo();

  const canvasObjects = useStorage((root) => root.canvasObjects);

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  const isDrawing = useRef(false);
  const shapeRef = useRef(null);
  const selectedShapeRef = useRef(null);

  const activeObjectRef = useRef(null);
  const isEditingRef = useRef(false);

  const imageInputRef = useRef(null);

  const [activeElement, setActiveElement] = useState({
    name: "",
    value: "",
    icon: "",
  });

  const [elementAttributes, setElementAttributes] = useState({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(shapeId);
  }, []);

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects");
    if (!canvasObjects || canvasObjects.size === 0) return true;
    for (const [key] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }
    return canvasObjects.size === 0;
  }, []);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.set(objectId, shapeData);
  }, []);

  const handleActiveElement = (elem) => {
    setActiveElement(elem);

    switch (elem?.value) {
      case "reset":
        deleteAllShapes();
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        break;

      case "delete":
        handleDelete(fabricRef.current, deleteShapeFromStorage);
        setActiveElement(defaultNavElement);
        break;

      case "image":
        imageInputRef.current?.click();
        isDrawing.current = false;
        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;

      case "comments":
        break;

      default:
        selectedShapeRef.current = elem?.value;
        break;
    }
  };

  useEffect(() => {
    // initialize the fabric canvas
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
    });

    // mouse:down
    const onMouseDown = (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    };
    canvas.on("mouse:down", onMouseDown);

    // mouse:move
    const onMouseMove = (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage,
      });
    };
    canvas.on("mouse:move", onMouseMove);

    // mouse:up
    const onMouseUp = () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      });
    };
    canvas.on("mouse:up", onMouseUp);

    // path:created
    const onPathCreated = (options) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      });
    };
    canvas.on("path:created", onPathCreated);

    // object:modified
    const onObjectModified = (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    };
    canvas.on("object:modified", onObjectModified);

    // object:moving
    const onObjectMoving = (options) => {
      handleCanvasObjectMoving({ options });
    };
    canvas.on("object:moving", onObjectMoving);

    // selection:created
    const onSelectionCreated = (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    };
    canvas.on("selection:created", onSelectionCreated);

    // object:scaling
    const onObjectScaling = (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    };
    canvas.on("object:scaling", onObjectScaling);

    // mouse:wheel
    const onMouseWheel = (options) => {
      handleCanvasZoom({
        options,
        canvas,
      });
    };
    canvas.on("mouse:wheel", onMouseWheel);

    // window resize handler (define so we can remove it later)
    const resizeHandler = () => {
      handleResize({
        canvas: fabricRef.current,
      });
    };
    window.addEventListener("resize", resizeHandler);

    // keydown handler (define so we can remove it later)
    const keydownHandler = (e) =>
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      });
    window.addEventListener("keydown", keydownHandler);

    // cleanup
    return () => {
      canvas.dispose();

      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      canvas.off("mouse:up", onMouseUp);
      canvas.off("path:created", onPathCreated);
      canvas.off("object:modified", onObjectModified);
      canvas.off("object:moving", onObjectMoving);
      canvas.off("selection:created", onSelectionCreated);
      canvas.off("object:scaling", onObjectScaling);
      canvas.off("mouse:wheel", onMouseWheel);

      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("keydown", keydownHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);

  return (
    <main className="h-screen overflow-hidden">
      <Navbar
        imageInputRef={imageInputRef}
        activeElement={activeElement}
        handleImageUpload={(e) => {
          e.stopPropagation();
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef,
            shapeRef,
            syncShapeInStorage,
          });
        }}
        handleActiveElement={handleActiveElement}
      />

      <section className="flex h-full flex-row">
        <LeftSidebar allShapes={Array.from(canvasObjects || [])} />

        <Live canvasRef={canvasRef} undo={undo} redo={redo} />

        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          syncShapeInStorage={syncShapeInStorage}
        />
      </section>
    </main>
  );
};

export default Home;
