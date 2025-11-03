const lessons = new Map();
const answeredCards = new Set();
let currentLessonKey = null;
const streakShort = 5;
const streakLong = 10;
const correctSound = document.getElementById("sound-correct");
const wrongSound = document.getElementById("sound-wrong");
const celebrateSound = document.getElementById("sound-celebrate");
const resetSound = document.getElementById("sound-reset");
const happyBlipSound = document.getElementById("sound-happy-blip");
const happyEndingSound = document.getElementById("sound-happy-ending");

function progressTracker() {
  let correct = 0;
  let wrong = 0;
  let streak = 0;
  return {
    incrementCorrect: () => {
      correct++;
      streak++;
    },
    incrementWrong: () => {
      wrong++;
      streak = 0;
    },
    decreaseWrong: () => {
      if (wrong > 0) wrong--;
    },
    adjustFromWrongToCorrect() {
      if (wrong > 0) wrong--;
      correct++;
      streak++;
    },
    adjustFromCorrectToWrong() {
      correct--;
      wrong++;
      streak = 0;
    },
    resetStreak() {
      streak = 0;
    },
    reset() {
      correct = 0;
      wrong = 0;
      streak = 0;
    },
    getStats() {
      return { correct, wrong, streak };
    },
  };
}

function animateCards() {
  const cards = $("#lesson-container .card").toArray();
  gsap.from(cards, {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: "power2.out",
    clearProps: "opacity,transform",
  });
}

function unlockLessonBadge(lessonKey) {
  const badge = $(`[data-badge="${lessonKey}"]`);
  badge.addClass("earned").addClass(`${lessonKey}-earned`);

  // Inject icon only when earned
  const iconPath = `assets/images/${lessonKey}.svg`;
  badge.html(`<img src="${iconPath}" alt="${lessonKey} badge" />`);
}

function unlockStreakBadge(streakType) {
  const icon = streakType === "streak5" ? "🔥" : "🏅";
  const medalContainer = $(".streak-badges"); // container for medals

  const medal = $("<div>").addClass("medal-slot earned").text(icon);

  medalContainer.append(medal);
}

function updateProgress() {
  const total = $(".card").length;
  const { correct, wrong, streak } = progress.getStats();
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  gsap.to(".progress-fill", {
    width: percent + "%",
    duration: 0.5,
    ease: "power1.out",
  });

  $(".progress-text").text(
    `Correct: ${correct} | Wrong: ${wrong} | Score: ${percent}%`
  );

  if (correct === total && total > 0) {
    unlockLessonBadge(currentLessonKey);
    const currentIndex = parseInt(currentLessonKey.replace("lesson", ""));
    const nextLessonKey = "lesson" + (currentIndex + 1);
    if (lessons.has(nextLessonKey)) {
      const nextButton = $(`[data-lesson="${nextLessonKey}"]`);
      nextButton.prop("disabled", false);

      // 🎯 Highlight next button briefly
      nextButton.addClass("highlight-next");
      setTimeout(() => nextButton.removeClass("highlight-next"), 2000);

      // 🚀 Auto-load next lesson after short delay
      setTimeout(() => {
        nextButton.trigger("click");
        showLessonTransition(nextLessonKey);
      }, 1400);
    }

    celebrateSound.play();
    $("#completion-badge").fadeIn();

    // 🎉 Confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ffcc00", "#ff66cc", "#66ccff", "#99ff99"],
    });

    // ✨ Emoji trail
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

    // 🏅 Badge animation
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

    if (currentLessonKey === "lesson7") {
      setTimeout(() => {
        $("#final-celebration").fadeIn(600);
        happyEndingSound.play();

        // 🎊 Extra confetti burst
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ["#ffd700", "#ff66cc", "#66ccff", "#99ff99"],
        });

        // 🌟 Emoji trail
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

function showLessonTransition(lessonKey) {
  const topic = lessons.get(lessonKey)?.topic || "Next Lesson";
  const toast = $(`
    <div class="toast next-lesson-toast">
      ✨ Now starting <strong>${lessonKey.toUpperCase()}</strong>: ${topic}
    </div>
  `);
  $("body").append(toast);
  toast.css("display", "block");

  gsap.to(toast, {
    opacity: 1,
    duration: 1.6,
    y: 400,
    onComplete: () => {
      gsap.to(toast, {
        delay: 1.2,
        opacity: 0,
        duration: 0.6,
        onComplete: () => toast.remove(),
      });
    },
  });
}

function triggerFinalCelebration() {
  $("#final-celebration").fadeIn(600);
  happyEndingSound.play();

  // 🎊 Confetti burst
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors: ["#ffd700", "#ff66cc", "#66ccff", "#99ff99"],
  });

  // 🌟 Emoji trail
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

const progress = progressTracker();

$(document).ready(function () {
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
    })
    .catch((err) => {
      console.error("Failed to load lessons:", err);
    });

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

  function loadLesson(lessonKey) {
    currentLessonKey = lessonKey; // ✅ Track current lesson
    const lesson = lessons.get(lessonKey);
    if (!lesson) return;

    const { topic, options, examples } = lesson;

    $("body").removeClass().addClass(`${lessonKey}-bg`);
    $("#lesson-container").empty();
    $(".reference-bar").html(`<strong>Topic:</strong> ${topic}`);
    progress.reset();
    updateProgress();

    // Build cards first
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
  $(".lesson-btn").each(function () {
    const lesson = $(this).data("lesson");
    if (lesson !== "lesson1") {
      $(this).prop("disabled", true);
    }
  });

  $("#start-button").on("click", function () {
    $("#mascot-overlay").fadeOut(500);
  });

  $("#lesson-container").on("click", ".option-btn", function () {
    const userChoice = $(this).data("choice");
    const correctAnswer = $(this).data("answer");
    const card = $(this).closest(".card")[0];
    const blank = $(card).find(".blank");

    const wasCorrect = blank.hasClass("correct");
    const wasWrong = blank.hasClass("wrong");
    const { correct, wrong, streak } = progress.getStats();

    // Reset previous state
    // Only reset if the answer hasn't already been marked correct
    if (!wasCorrect) {
      blank.removeClass("correct wrong").text(userChoice);
    }

    // Remove highlight from other buttons
    $(card).find(".option-btn").removeClass("selected");
    $(this).addClass("selected");

    if (userChoice === correctAnswer) {
      blank.addClass("correct");
      if (!wasCorrect) {
        if (wasWrong) {
          progress.adjustFromWrongToCorrect();
        } else {
          progress.incrementCorrect();
        }
        if (streak === streakShort) {
          happyBlipSound.play();

          // 🎊 Streak confetti burst
          confetti({
            particleCount: 80,
            spread: 100,
            origin: { y: 0.4 },
            colors: ["#ffd700", "#ff69b4", "#00bcd4", "#8bc34a"],
          });

          // 🌟 Emoji trail
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
            .text(`🔥 ${streakShort} in a row! You're on fire!`)
            .fadeIn(300)
            .delay(1500)
            .fadeOut(500);
        }

        if (streak === streakLong) {
          // 🏅 Badge unlock celebration
          happyBlipSound.play();

          gsap.set("#streak-badge", {
            display: "block",
            opacity: 0.5,
            scale: 0.8,
          });

          // ✨ Sparkle trail burst
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

          // Reset streak after badge
          progress.resetStreak();
        }
      }

      // 🔒 Disable all wrong buttons
      $(card)
        .find(".option-btn")
        .each(function () {
          $(this).prop("disabled", true);
        });

      correctSound.play();
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
      wrongSound.play();
    }

    updateProgress();
  });

  $("#reset").on("click", function () {
    $(".blank").text("_______").removeClass("correct wrong");
    progress.reset();
    answeredCards.clear();
    updateProgress();
    resetSound.play();
  });

  $(".lesson-switcher").on("click", ".lesson-btn", function () {
    $("#start-message").hide();
    $(".lesson-btn").removeClass("active");
    $(this).addClass("active");

    const lessonKey = $(this).data("lesson");
    $(".progress-container").fadeIn(300);
    loadLesson(lessonKey);
  });

  $("#start-button").on("click", function () {
    // Sparkle burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffcc00", "#ff66cc", "#66ccff", "#99ff99"],
    });

    // Emoji trail burst
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

    // Optional: fade out overlay
    $("#mascot-overlay").fadeOut(600, function () {
      $(".progress-container").fadeIn(300); // ✅ Show progress bar
      loadLesson("lesson1");
    });
  });

  $("#restart-lessons").on("click", function () {
    $("#final-celebration").fadeOut(300);
    $(".lesson-btn").removeClass("active");
    $(".lesson-btn").prop("disabled", true);
    $(`[data-lesson="lesson1"]`).prop("disabled", false).trigger("click");
  });
});
