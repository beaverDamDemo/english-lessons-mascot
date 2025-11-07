import { lessons } from "./ui.js";
import { setSvgFragment, getSvgFragment, originalColors } from "./ui.js";
import { progress } from "./progress.js";
import { loadLesson } from "./lessonLoader.js";
import { updateProgress, unlockLessonBadge } from "./progressUI.js";
import { initEventHandlers } from "./events.js";
import { loadProgress } from "./storage.js";

// Entry point - run after DOM ready
$(document).ready(function () {
  // Init UI: fade out mascot overlay and show progress container
  //   $("#mascot-overlay").fadeOut(600, function () {
  //     $(".progress-container").fadeIn(300);
  //     loadLesson("lesson1");
  //   });

  // Load initial SVG (snap1) and capture original colors
  const svgContainer = Snap("#svg");
  Snap.load("assets/images/snap1.svg", function (loadedFragment) {
    const frag = loadedFragment.select("svg") || loadedFragment;
    if (!frag) {
      console.error(
        "❌ Could not find a valid SVG element in the loaded fragment."
      );
      return;
    }

    setSvgFragment(frag);
    svgContainer.append(getSvgFragment());

    const allNodes = getSvgFragment().selectAll("*").items;

    const filteredNodes = allNodes
      .filter((el) => el.node.id && el.node.id.startsWith("part"))
      .map((el, i) => ({
        index: i,
        element: el,
        nodeType: el.node.nodeName || undefined,
        id: el.node.id || undefined,
        fill: el.node.getAttribute("fill"),
      }));

    filteredNodes.forEach((el) => {
      const { element, fill } = el;
      if (element.node.id) {
        originalColors.set(element.node.id, {
          originalFill: fill,
          currentFill: "#fff",
        });

        if (fill) element.attr({ fill: "#fff" });
      }
    });

    // expose for debug fallback code
    window.originalColors = originalColors;
    window.svgFragment = getSvgFragment();
  });

  // Fetch lessons and populate lesson switcher
  fetch("./assets/json/lessons.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      Object.entries(data).forEach(([key, value], index) => {
        lessons.set(key, value);
        const button = $(`
          <button class="lesson-btn" data-lesson="${key}">
            <span class="lesson-label">Lesson ${index + 1}:</span> ${
          value.topic
        }
          </button>
        `);
        if (key !== "lesson1") {
          button.prop("disabled", true);
        }

        $(".lesson-switcher").append(button);
      });

      // restore saved progress if any
      const saved = loadProgress();
      if (saved) {
        window.currentLessonKey = saved.currentLessonKey;
        window.answeredCards = new Set(saved.answeredCards || []);

        progress.reset();
        for (let i = 0; i < (saved.correct || 0); i++)
          progress.incrementCorrect();
        for (let i = 0; i < (saved.wrong || 0); i++) progress.incrementWrong();

        if (lessons.has(window.currentLessonKey)) {
          loadLesson(window.currentLessonKey);
          $(".lesson-btn").removeClass("active");
          $(`[data-lesson="${window.currentLessonKey}"]`).addClass("active");
        }
      }
    })
    .catch((err) => {
      console.error("Failed to load lessons:", err);
    });

  // small animations
  gsap.from(".mascot-box img", {
    y: -20,
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    ease: "bounce.out",
  });
  gsap.from("#start-button", {
    y: -20,
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    ease: "bounce.out",
  });
  gsap.to("#start-button", {
    scale: 1.05,
    duration: 1,
    repeat: -1,
    yoyo: true,
    delay: 0.7,
    ease: "sine.inOut",
  });

  // initialize event handlers
  initEventHandlers();

  // expose some helpers used by debug-panel inline onclicks
  window.updateProgress = updateProgress;
  window.unlockLessonBadge = unlockLessonBadge;
  window.triggerFinalCelebration = function () {
    // import and call
    const mod = import("./progressUI.js");
    mod.then((m) => m.triggerFinalCelebration());
  };
  window.resetFinalCelebration = function () {
    $("#final-celebration").hide();
  };
});
