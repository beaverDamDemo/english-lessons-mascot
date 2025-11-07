import { loadLesson } from "./lessonLoader.js";
import { progress } from "./progress.js";
import { updateProgress, triggerFinalCelebration } from "./progressUI.js";
import { animateCards } from "./animations.js";
import { clearProgressStorage } from "./storage.js";

export function initEventHandlers() {
  // Start button
  $("#start-button").on("click", function () {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffcc00", "#ff66cc", "#66ccff", "#99ff99"],
    });

    confetti({
      particleCount: 40,
      angle: 90,
      spread: 45,
      origin: { x: 0.5, y: 0.5 },
      shapes: ["text"],
      scalar: 1.2,
      ticks: 200,
      gravity: 0.4,
      drift: 0.5,
      text: ["✨", "🚀", "🎉", "🦊"],
    });

    $("#mascot-overlay").fadeOut(600, function () {
      $(".progress-container").fadeIn(300);
      loadLesson("lesson1");
    });
  });

  // Option click handler (delegated)
  $("#lesson-container").on("click", ".option-btn", function () {
    const userChoice = $(this).data("choice");
    const correctAnswer = $(this).data("answer");
    const card = $(this).closest(".card")[0];
    const blank = $(card).find(".blank");

    const wasCorrect = blank.hasClass("correct");
    const wasWrong = blank.hasClass("wrong");
    const { correct, wrong, streak } = progress.getStats();

    if (!wasCorrect) {
      blank.removeClass("correct wrong").text(userChoice);
    }

    $(card).find(".option-btn").removeClass("selected");
    $(this).addClass("selected");

    if (userChoice === correctAnswer) {
      // Restore one SVG element's original color
      const remaining = Array.from(
        Object.entries(
          Object.fromEntries(Object.entries(window.originalColors || {}))
        )
      ).filter(([id, props]) => props.currentFill === "#fff");

      // Fallback: try to access originalColors from global if available
      try {
        const orig = window.originalColors;
        if (orig) {
          const entries = Array.from(orig.entries()).filter(
            ([, props]) => props.currentFill === "#fff"
          );
          if (entries.length > 0) {
            const [id, props] = entries[0];
            const el = window.svgFragment?.select
              ? window.svgFragment.select(`#${id}`)
              : null;
            if (el) {
              el.attr({ fill: props.originalFill });
              props.currentFill = props.originalFill;
            }
          }
        }
      } catch (e) {
        // ignore if globals not present
      }

      blank.addClass("correct");
      if (!wasCorrect) {
        if (wasWrong) {
          progress.adjustFromWrongToCorrect();
        } else {
          progress.incrementCorrect();
        }
        if (streak === 5) {
          document.getElementById("sound-happy-blip")?.play();

          confetti({
            particleCount: 80,
            spread: 100,
            origin: { y: 0.4 },
            colors: ["#ffd700", "#ff69b4", "#00bcd4", "#8bc34a"],
          });

          confetti({
            particleCount: 40,
            angle: 90,
            spread: 70,
            origin: { x: 0.5, y: 0.5 },
            shapes: ["text"],
            scalar: 1.6,
            ticks: 200,
            gravity: 0.25,
            drift: 0.4,
            text: ["🔥", "💯", "🎯", "👏"],
          });

          $("#streak-toast")
            .text(`🔥 ${5} in a row! You're on fire!`)
            .fadeIn(300)
            .delay(1500)
            .fadeOut(500);
        }

        if (streak === 10) {
          document.getElementById("sound-happy-blip")?.play();

          gsap.set("#streak-badge", {
            display: "block",
            opacity: 0.5,
            scale: 0.8,
          });

          confetti({
            particleCount: 40,
            angle: 90,
            spread: 60,
            origin: { x: 0.5, y: 0.5 },
            shapes: ["text"],
            scalar: 1.4,
            ticks: 180,
            gravity: 0.3,
            drift: 0.6,
            text: ["✨", "🌟", "💫", "🎖️"],
          });

          gsap.fromTo(
            "#streak-badge",
            { scale: 0.8 },
            {
              scale: 1.2,
              opacity: 1,
              duration: 3,
              ease: "elastic.out(1, 0.5)",
            }
          );

          gsap.to("#streak-badge", {
            delay: 3,
            opacity: 0.5,
            scale: 0.8,
            duration: 2.5,
            ease: "power1.in",
            onComplete: () => {
              $("#streak-badge").hide();
            },
          });

          progress.resetStreak();
        }
      }

      $(card)
        .find(".option-btn")
        .each(function () {
          $(this).prop("disabled", true);
        });

      document.getElementById("sound-correct")?.play();
      gsap.fromTo(
        blank,
        { scale: 1 },
        {
          scale: 1.2,
          backgroundColor: "#c8e6c9",
          duration: 0.3,
          ease: "power1.inOut",
        }
      );
    } else {
      blank.addClass("wrong");
      if (!wasWrong) {
        if (wasCorrect) {
          progress.adjustFromCorrectToWrong();
        } else {
          progress.incrementWrong();
        }
      }
      document.getElementById("sound-wrong")?.play();
    }

    updateProgress();
  });

  $("#reset").on("click", function () {
    $(".blank").text("_______").removeClass("correct wrong");
    progress.reset();
    window.answeredCards && window.answeredCards.clear();
    updateProgress();
    document.getElementById("sound-reset")?.play();
  });

  $(".lesson-switcher").on("click", ".lesson-btn", function () {
    $("#start-message").hide();
    $(".lesson-btn").removeClass("active");
    $(this).addClass("active");

    const lessonKey = $(this).data("lesson");
    $(".progress-container").fadeIn(300);
    loadLesson(lessonKey);
  });

  $("#restart-lessons").on("click", function () {
    $("#final-celebration").fadeOut(300);
    $(".lesson-btn").removeClass("active");
    $(".lesson-btn").prop("disabled", true);
    // Reset badges and streak medals
    $(".badge-slot")
      .removeClass(
        "earned lesson1-earned lesson2-earned lesson3-earned lesson4-earned lesson5-earned lesson6-earned lesson7-earned"
      )
      .empty(); // Clear badge images
    $(".streak-badges").empty(); // Clear streak medals
    $(`[data-lesson="lesson1"]`).prop("disabled", false).trigger("click");
  });

  $("#reset-storage").on("click", function () {
    clearProgressStorage();
    progress.reset();
    window.answeredCards && window.answeredCards.clear();
    $(".blank").text("_______").removeClass("correct wrong");
    $(".lesson-btn").removeClass("active");
    $(`[data-lesson="lesson1"]`).prop("disabled", false).trigger("click");
    $("#completion-badge").hide();
    $("#final-celebration").hide();
  });

  $(document).on("click", ".close-help", function () {
    $("#lesson-help-modal").fadeOut(200);
  });

  // debug toggle
  $("#debug-toggle").on("click", function () {
    $(".debug-panel").toggle();
  });
}
