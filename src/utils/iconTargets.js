// Lets any page find where a given navbar icon (cart, wishlist, ...) currently is on
// screen, without threading a ref through the whole component tree — the header is a
// totally separate part of the layout tree from pages that trigger these animations.
const targets = new Map();

export function registerIconTarget(name, el) {
  targets.set(name, el);
}

export function getIconTargetRect(name) {
  const el = targets.get(name);
  return el ? el.getBoundingClientRect() : null;
}
