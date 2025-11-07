// Shared app state and simple helpers
export const lessons = new Map();
export const answeredCards = new Set();
export let currentLessonKey = null;
export const streakShort = 5;
export const streakLong = 10;
export const originalColors = new Map();

export function setCurrentLesson(key) {
  currentLessonKey = key;
}

export function getSvgContainer() {
  // Uses Snap globally included in index.html
  return Snap("#svg");
}

// svg fragment helper: module consumers should use these to read/write
let _svgFragment = null;
export function setSvgFragment(fragment) {
  _svgFragment = fragment;
}
export function getSvgFragment() {
  return _svgFragment;
}
