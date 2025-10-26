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
  lesson3: {
    topic: ["go", "will go", "am going", "went"],
    options: ["go", "will go", "am going", "went"],
    examples: [
      "I _______ to school every day.|go",
      "She _______ to the market yesterday.|went",
      "We _______ to the zoo tomorrow.|will go",
      "He _______ to the gym now.|is going",
      "They _______ to the beach last weekend.|went",
      "I _______ to work by bus.|go",
      "You _______ to the party tonight.|are going",
      "He _______ to the dentist yesterday.|went",
      "We _______ to the cinema every Friday.|go",
      "I _______ to the store later.|will go",
      "She _______ to the library now.|is going",
      "They _______ to the mountains last summer.|went",
      "I _______ to the bakery every morning.|go",
      "We _______ to the museum tomorrow.|will go",
      "He _______ to the café now.|is going",
      "You _______ to the concert last night.|went",
      "I _______ to the gym on Mondays.|go",
      "She _______ to the doctor later.|will go",
      "We _______ to the park now.|are going",
      "They _______ to the restaurant yesterday.|went",
    ],
  },
};

$(document).ready(function () {
  $("#start-button").on("click", function () {
    $("#mascot-overlay").fadeOut(500);
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
    $("#mascot-overlay").fadeOut(600);
  });
});
