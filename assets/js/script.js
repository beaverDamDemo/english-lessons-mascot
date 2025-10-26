const lessons = {
  lesson1: {
    topic: "me / you / my / your",
    options: ["me", "you", "my", "your"],
    examples: [
      "I like _______.|you",
      "This is _______ book.|my",
      "Can you help _______?|me",
      "Is that _______ phone?|your",
      "She gave _______ a gift.|me",
      "I see _______ every day.|you",
      "_______ shoes are dirty.|your",
      "_______ name is John.|my",
      "Please call _______ later.|me",
      "I want to talk to _______.|you",
      "_______ dog is very friendly.|your",
      "_______ house is big and clean.|my",
      "He told _______ a funny story.|me",
      "I will meet _______ at 5 PM.|you",
      "_______ brother is tall.|your",
      "_______ sister is a doctor.|my",
      "Can you show _______ the way?|me",
      "I made this for _______.|you",
      "_______ car is very fast.|your",
      "_______ favorite color is blue.|my",
    ],
  },
  lesson2: {
    topic: "he / she / his / her",
    options: ["he", "she", "his", "her"],
    examples: [
      "_______ is my brother.|he",
      "_______ is my sister.|she",
      "This is _______ book.|his",
      "That is _______ phone.|her",
      "I like _______.|her",
      "_______ dog is very big.|his",
      "_______ name is Anna.|her",
      "_______ is a doctor.|he",
      "I see _______ every day.|him",
      "I talk to _______ on the phone.|her",
      "_______ car is red.|his",
      "_______ house is yellow.|her",
      "_______ is my uncle.|he",
      "_______ is my aunt.|she",
      "I gave the gift to _______.|her",
      "I saw _______ at school.|him",
      "_______ pencil is on the desk.|his",
      "_______ backpack is pink.|her",
      "_______ is very tall.|he",
      "_______ is very kind.|she",
    ],
  },
};

$(document).ready(function () {
  $("#start-button").on("click", function () {
    $("#start-overlay").fadeOut(500);
  });

  let correct = 0;
  let wrong = 0;

  const correctSound = document.getElementById("sound-correct");
  const wrongSound = document.getElementById("sound-wrong");
  const celebrateSound = document.getElementById("sound-celebrate");
  const resetSound = document.getElementById("sound-reset");

  function loadLesson(lessonKey) {
    const { topic, options, examples } = lessons[lessonKey];

    // Update background class
    $("body").removeClass().addClass(`${lessonKey}-bg`);

    // Reset and render lesson
    $("#lesson-container").empty();
    $(".reference-bar").html(`<strong>Topic:</strong> ${topic}`);
    correct = 0;
    wrong = 0;
    updateProgress();

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
  }

  // Handle answer clicks
  $("#lesson-container").on("click", ".option-btn", function () {
    const userChoice = $(this).data("choice");
    const correctAnswer = $(this).data("answer");
    const card = $(this).closest(".card");
    const blank = card.find(".blank");

    if (!blank.hasClass("correct") && !blank.hasClass("wrong")) {
      blank.text(userChoice);
      if (userChoice === correctAnswer) {
        blank.addClass("correct");
        correct++;
        correctSound.play();
      } else {
        blank.addClass("wrong");
        wrong++;
        wrongSound.play();
      }
      updateProgress();
    }
  });

  // Handle reset
  $("#reset").on("click", function () {
    $(".blank").text("_______").removeClass("correct wrong");
    correct = 0;
    wrong = 0;
    updateProgress();
    resetSound.play();
  });

  function updateProgress() {
    const total = $(".card").length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

    $(".progress-fill").css("width", percent + "%");
    $(".progress-text").text(
      `Correct: ${correct} | Wrong: ${wrong} | Score: ${percent}%`
    );

    if (correct === total && total > 0) {
      celebrateSound.play();
    }
  }

  // Handle lesson switch
  $(".lesson-btn").on("click", function () {
    $("#start-message").hide();
    $(".lesson-btn").removeClass("active");
    $(this).addClass("active");
    const lessonKey = $(this).data("lesson");
    loadLesson(lessonKey);
  });

  // Load default lesson
  loadLesson("lesson1");
});
