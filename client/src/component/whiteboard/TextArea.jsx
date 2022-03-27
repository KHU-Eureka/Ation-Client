import React, { useState, useLayoutEffect } from "react";
import { Html } from "react-konva-utils";

export const TextArea = ({ textRef, property, onBlur, onChange, cursorPosition }) => {
  const [style, setStyle] = useState();

  useLayoutEffect(() => {
    const textNode = textRef.current;
    const newStyle = {};
    newStyle.width = textNode.width() + "px";
    newStyle.height = textNode.height() + "px";
    newStyle.fontSize = textNode.fontSize() + "px";
    newStyle.border = "none";
    newStyle.padding = "0px";
    newStyle.overflow = "hidden";
    newStyle.background = "none";
    newStyle.outline = "none";
    newStyle.resize = "none";
    newStyle.lineHeight = textNode.lineHeight() + 0.01;
    newStyle.fontFamily = '"' + textNode.fontFamily() + '"';
    newStyle.transformOrigin = "left top";
    newStyle.textAlign = textNode.align();
    newStyle.color = textNode.fill();
    newStyle.overflowWrap = "break-word";
    newStyle.whiteSpace = "normal";
    newStyle.userSelect = "text";
    newStyle.wordBreak = "normal";

    if (JSON.stringify(newStyle) !== JSON.stringify(style)) {
      setStyle(newStyle);
    }
  });

  return (
    <Html>
      <textarea
        className="text-editor"
        style={{
          ...style,
          position: "absolute",
          top: `${cursorPosition.y}px`,
          left: `${cursorPosition.x}px`,
        }}
        rotateEnabled={false}
        flipEnabled={false}
        value={property.text}
        onChange={(e) => {
          onChange({
            ...property,
            text: e.target.value,
            // x: cursorPosition.x,
            // y: cursorPosition.y,
          });
        }}
        onBlur={onBlur}
      />
    </Html>
  );
};