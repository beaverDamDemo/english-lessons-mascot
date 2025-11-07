import {
  lessons,
  answeredCards,
  setCurrentLesson,
  originalColors,
  setSvgFragment,
  getSvgFragment,
} from "./ui.js";
import { progress } from "./progress.js";
import { animateCards } from "./animations.js";
import { saveProgress } from "./storage.js";
import { updateProgress } from "./progressUI.js";

export function showLessonHelp(text) {
  $("#help-text").text(text);
  $("#lesson-help-modal").fadeIn(300);
}

export function loadLessonSVG(lessonKey) {
  const lessonNumber = lessonKey.replace("lesson", "");
  const svgPath = `assets/images/snap${lessonNumber}.svg`;
  const svgContainer = Snap("#svg");
  originalColors.clear();

  Snap.load(svgPath, function (loadedFragment) {
    const frag = loadedFragment.select("svg") || loadedFragment;
    setSvgFragment(frag);
    // expose for legacy/debug fallbacks
    window.svgFragment = getSvgFragment();
    const svgFragment = getSvgFragment();
    if (!svgFragment) {
      console.error(
        "❌ Could not find a valid SVG element in the loaded fragment."
      );
      return;
    }

    svgContainer.selectAll("*").forEach((el) => el.remove());
    svgContainer.append(svgFragment);

    const allNodes = svgFragment.selectAll("*").items;

    const filteredNodes = allNodes
      .filter((el) => el.node.id && el.node.id.startsWith("part"))
      .map((el) => {
        const originalFill = el.node.getAttribute("fill");
        el.attr({ fill: "#fff" });
        originalColors.set(el.node.id, {
          originalFill,
          currentFill: "#fff",
        });
      });
  });
}

export function loadLesson(lessonKey) {
  setCurrentLesson(lessonKey);
  // expose for legacy/debug code that references window
  window.currentLessonKey = lessonKey;
  window.answeredCards = window.answeredCards || new Set();
  const lesson = lessons.get(lessonKey);
  if (!lesson) return;

  loadLessonSVG(lessonKey);

  const { topic, options, examples } = lesson;

  $("body").removeClass().addClass(`${lessonKey}-bg`);
  $("#lesson-container").empty();
  $(".reference-bar").html(`<strong>Topic:</strong> ${topic}`);
  const helpText = lesson.help || "No help available for this lesson.";
  const helpButton = $(`
      <button class="help-btn" title="Show help for this lesson">❓ Help</button>
    `);
  $(".reference-bar").append(helpButton);

  helpButton.on("click", () => {
    showLessonHelp(helpText);
  });

  progress.reset();
  updateProgress();

  // Build cards
  examples.forEach((item, index) => {
    const [sentence, answer] = item.split("|");
    const card = $(`
      <div class="card">
        <div class="options">
          ${options
            .map(
              (opt) =>
                `<button class="option-btn" data-answer="${answer}" data-choice="${opt}">${opt}</button>`
            )
            .join("")}
        </div>
        <p class="question">${index + 1}. ${sentence.replace(
      "_______",
      '<span class="blank">_______</span>'
    )}</p>
      </div>
    `);
    $("#lesson-container").append(card);
  });

  animateCards();

  gsap.from(".reference-bar", {
    y: -50,
    opacity: 0,
    duration: 0.4,
    ease: "back.out(1.7)",
  });
}
