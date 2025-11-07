export function saveProgress(progressData) {
  localStorage.setItem("userProgress", JSON.stringify(progressData));
}

export function loadProgress() {
  const saved = localStorage.getItem("userProgress");
  return saved ? JSON.parse(saved) : null;
}

export function clearProgressStorage() {
  localStorage.removeItem("userProgress");
}
