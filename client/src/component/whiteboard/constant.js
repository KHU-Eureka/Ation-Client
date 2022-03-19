export const TYPES = {
    PEN: "pen",
    HIGHLIGHT: "highlight",
    RECT: "rect",
    TRI: "tri",
    CIRCLE: "circle",
    TEXT: "text",
    POSTIT: "postit",
    IMG: "image",
    PIN: "pin"
};

export const DEFAULTS = {
    PEN: {
        STROKE: "#000000",
        STROKE_WIDTH: 5,
        LINECAP: "round",
        OPACITY: 1,
        WIDTH: 0,
        HEIGHT: 0,
    }, 
    HIGHLIGHT: {
        STROKE: "#000000",
        STROKE_WIDTH: 5,
        LINECAP: "round",
        OPACITY: 0.3,
        WIDTH: 0,
        HEIGHT: 0,
    },
    RECT: {
      STROKE: "#000000",
      FILL: "#ffffff",
      WIDTH: 0,
      HEIGHT: 0,
    },
    CIRCLE: {
      STROKE: "#000000",
      FILL: "#ffffff",
      RADIUS: 0,
    },
    TEXT: {
        CONTENT: "",
        FONTSIZE: 20,
    },
    POSTIT: {
        CONTENT: "",
        FONTSIZE: 20,
        FILL: "#FFD600",
    },
    IMG: {
        WIDTH: 300,
        HEIGHT: 300,
        X: 100,
        Y: 100,
    }
  };