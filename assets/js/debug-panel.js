function markAllCorrect() {
  $("#lesson-container .card").each(function () {
    const blank = $(this).find(".blank");
    const correctAnswer = $(this).find(".option-btn").first().data("answer");
    blank.text(correctAnswer).removeClass("wrong").addClass("correct");
    $(this).find(".option-btn").removeClass("selected");
    $(this)
      .find(`.option-btn[data-choice="${correctAnswer}"]`)
      .addClass("selected");
  });
  correct = $(".card").length;
  wrong = 0;
  updateProgress();
}
function triggerStreak(count) {
  const medalContainer = document.getElementById("streak-medals");
  const medal = document.createElement("div");
  medal.className = "medal-slot earned";
  medal.textContent = count === 5 ? "🔥" : "🏅";
  medalContainer.appendChild(medal);

  // Optional: animate or log
  if (count === 5) {
    $("#streak-toast")
      .text("🔥 5 in a row! You're on fire!")
      .fadeIn(300)
      .delay(1500)
      .fadeOut(500);
  }
  if (count === 10) {
    $("#streak-badge").show().css({ opacity: 1, scale: 1.2 });
    setTimeout(() => $("#streak-badge").fadeOut(500), 3000);
  }
}

function resetStreak() {
  streak = 0;
  $("#streak-toast").hide();
  $("#streak-badge").hide();
}

function unlockAllBadges() {
  [
    "lesson1",
    "lesson2",
    "lesson3",
    "lesson4",
    "lesson5",
    "lesson6",
    "lesson7",
  ].forEach((lessonId) => {
    unlockLessonBadge(lessonId);
  });
}

function resetBadges() {
  $(".badge-slot")
    .removeClass(
      "earned lesson1-earned lesson2-earned lesson3-earned lesson4-earned lesson5-earned lesson6-earned lesson7-earned"
    )
    .text("");
}

function resetStreakMedals() {
  $(".streak-badges").empty();
}

function resetFinalCelebration() {
  $("#final-celebration").hide();
}

$("#debug-toggle").on("click", function () {
  $(".debug-panel").toggle();
});
