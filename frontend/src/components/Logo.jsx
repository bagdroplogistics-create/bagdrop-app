import React from "react";
import { LOGO_URL } from "../mock";

// Renders the Bagdrop logo with the black background removed via blend-mode
// so it appears clean on any light surface.
export default function Logo({ size = 36, withWordmark = false, className = "" }) {
  return (
    <img
      src={LOGO_URL}
      alt="Bagdrop"
      style={{ width: size, height: size, mixBlendMode: "multiply", objectFit: withWordmark ? "contain" : "cover", objectPosition: withWordmark ? "center" : "center top" }}
      className={className}
    />
  );
}
