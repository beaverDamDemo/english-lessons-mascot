import { progress } from "./progress.js";
import { lessons } from "./ui.js";
import { getSvgFragment, originalColors } from "./ui.js";
import { showLessonTransition } from "./animations.js";
import { saveProgress } from "./storage.js";

export function unlockLessonBadge(lessonKey) {
  const badge = $(`[data-badge="${lessonKey}"]`);
  badge.addClass("earned").addClass(`${lessonKey}-earned`);

  const iconPath = `assets/images/${lessonKey}.svg`;
  badge.html(`<img src="${iconPath}" alt="${lessonKey} badge" />`);
}

export function unlockStreakBadge(streakType) {
  const icon = streakType === "streak5" ? "🔥" : "🏅";
  const medalContainer = $(".streak-badges");

  const medal = $("<div>").addClass("medal-slot earned").text(icon);

  medalContainer.append(medal);
}

export function updateProgress() {
  const total = $(".card").length;
  const { correct, wrong, streak } = progress.getStats();
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const progressData = {
    correct,
    wrong,
    streak,
    currentLessonKey: window.currentLessonKey || null,
    answeredCards: Array.from(window.answeredCards || []),
  };
  saveProgress(progressData);

  gsap.to(".progress-fill", {
    width: percent + "%",
    duration: 0.5,
    ease: "power1.out",
  });

  $(".progress-text").text(
    `Correct: ${correct} | Wrong: ${wrong} | Score: ${percent}%`
  );

  const totalAttempts = correct + wrong;
  if (totalAttempts === total && total > 0) {
    unlockLessonBadge(window.currentLessonKey);
    const currentIndex = parseInt(
      (window.currentLessonKey || "").replace("lesson", "")
    );
    const nextLessonKey = "lesson" + (currentIndex + 1);
    if (lessons.has(nextLessonKey)) {
      const nextButton = $(`[data-lesson="${nextLessonKey}"]`);
      nextButton.prop("disabled", false);

      nextButton.addClass("highlight-next");
      setTimeout(() => nextButton.removeClass("highlight-next"), 2000);

      setTimeout(() => {
        nextButton.trigger("click");
        showLessonTransition(
          nextLessonKey,
          lessons.get(nextLessonKey)?.topic || "Next Lesson",
          lessons
        );
      }, 1400);
    }

    document.getElementById("sound-celebrate")?.play();
    $("#completion-badge").fadeIn();

    // confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ffcc00", "#ff66cc", "#66ccff", "#99ff99"],
    });

    confetti({
      particleCount: 50,
      angle: 90,
      spread: 60,
      origin: { x: 0.5, y: 0.5 },
      shapes: ["text"],
      scalar: 1.4,
      ticks: 180,
      gravity: 0.3,
      drift: 0.6,
      text: ["🎉", "🌟", "🏆", "👏"],
    });

    gsap.fromTo(
      "#completion-badge",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1.2,
        opacity: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      }
    );

    if (window.currentLessonKey === "lesson7") {
      setTimeout(() => {
        $("#final-celebration").fadeIn(600);
        document.getElementById("sound-happy-ending")?.play();

        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ["#ffd700", "#ff66cc", "#66ccff", "#99ff99"],
        });

        confetti({
          particleCount: 60,
          angle: 90,
          spread: 70,
          origin: { x: 0.5, y: 0.5 },
          shapes: ["text"],
          scalar: 1.6,
          ticks: 200,
          gravity: 0.25,
          drift: 0.4,
          text: ["🎉", "🌟", "🏆", "👏", "🦊"],
        });
      }, 2400);
    }
  } else {
    $("#completion-badge").hide();
  }
}

export function triggerFinalCelebration() {
  $("#final-celebration").fadeIn(600);
  document.getElementById("sound-happy-ending")?.play();

  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors: ["#ffd700", "#ff66cc", "#66ccff", "#99ff99"],
  });

  confetti({
    particleCount: 60,
    angle: 90,
    spread: 70,
    origin: { x: 0.5, y: 0.5 },
    shapes: ["text"],
    scalar: 1.6,
    ticks: 200,
    gravity: 0.25,
    drift: 0.4,
    text: ["🎉", "🌟", "🏆", "👏", "🦊"],
  });
}
