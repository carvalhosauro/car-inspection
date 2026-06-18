import "@testing-library/jest-dom/vitest";

// jsdom does not implement the Pointer Events / scrolling APIs that Radix UI
// primitives (Select, Popover) rely on. Polyfill them as no-ops so component
// interactions can be exercised in tests.
if (typeof window !== "undefined") {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
}
