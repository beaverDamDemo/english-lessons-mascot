const lessons = {
  lesson1: {
    topic: "me / you / my / your",
    options: ["me", "you", "my", "your"],
    examples: [
      "She said to me: 'I like _______.'|you",
      "This is _______ book on the table.|my",
      "Can you help _______ carry these bags?|me",
      "Is that _______ phone ringing?|your",
      "She gave _______ a gift after the meeting.|me",
      "I see _______ every day when I walk to school.|you",
      "_______ shoes are dirty from playing outside.|your",
      "_______ name is John, and he lives next door.|my",
      "Please call _______ later when you get home.|me",
      "I want to talk to _______ about the homework.|you",
      "_______ dog is very friendly with children.|your",
      "_______ house is big and clean, with a red roof.|my",
      "He told _______ a funny story during lunch.|me",
      "I will meet _______ at 5 PM near the station.|you",
      "_______ brother is tall and plays basketball.|your",
      "_______ sister is a doctor who works at the hospital.|my",
      "Can you show _______ the way to the library?|me",
      "I made this for _______ because you helped me.|you",
      "_______ car is very fast and has tinted windows.|your",
      "_______ favorite color is blue, just like the sky.|my",
    ],
  },
  lesson2: {
    topic: "he / she / his / her",
    options: ["he", "she", "his", "her"],
    examples: [
      "_______ is my brother and he plays guitar.|he",
      "_______ is my sister and she loves painting.|she",
      "This is _______ book that he lent me.|his",
      "That is _______ phone on the desk.|her",
      "I saw her and said: I like _______.|her",
      "_______ dog is very big and barks loudly.|his",
      "_______ name is Anna and she’s from Canada.|her",
      "_______ is a doctor who works at the clinic.|he",
      "I see _______ every day at the bus stop.|him",
      "I talk to _______ on the phone every weekend.|her",
      "_______ car is red and parked outside.|his",
      "_______ house is yellow with a green door.|her",
      "_______ is my uncle who lives in London.|he",
      "_______ is my aunt who teaches math.|she",
      "I gave the gift to _______ after the ceremony.|her",
      "I saw _______ at school during lunch break.|him",
      "_______ pencil is on the desk next to the notebook.|his",
      "_______ backpack is pink and has a unicorn on it.|her",
      "_______ is very tall and plays volleyball.|he",
      "_______ is very kind and helps everyone.|she",
    ],
  },
  lesson3: {
    topic: ["go", "will go", "am going", "went"],
    options: ["go", "will go", "am going", "went"],
    examples: [
      "Every weekday, I _______ to school by bike.|go",
      "Yesterday, she _______ to the market to buy vegetables.|went",
      "Tomorrow, we _______ to the zoo with our class.|will go",
      "Right now, he _______ to the gym for his workout.|is going",
      "Last weekend, they _______ to the beach for a picnic.|went",
      "On Mondays, I _______ to work by bus.|go",
      "Tonight, you _______ to the party with your friends.|are going",
      "Yesterday morning, he _______ to the dentist for a checkup.|went",
      "Every Friday, we _______ to the cinema after dinner.|go",
      "Later today, I _______ to the store to buy milk.|will go",
      "At the moment, she _______ to the library to study.|is going",
      "Last summer, they _______ to the mountains for hiking.|went",
      "Each morning, I _______ to the bakery for fresh bread.|go",
      "Tomorrow, we _______ to the museum for a school trip.|will go",
      "Right now, he _______ to the café to meet a friend.|is going",
      "Last night, you _______ to the concert downtown.|went",
      "On Mondays, I _______ to the gym before work.|go",
      "Later today, she _______ to the doctor for a checkup.|will go",
      "Right now, we _______ to the park to play football.|are going",
      "Yesterday, they _______ to the restaurant for dinner.|went",
    ],
  },
  lesson4: {
    topic: "is / are / was / were",
    options: ["is", "are", "was", "were"],
    examples: [
      "The dog _______ hungry right now.|is",
      "They _______ at the park yesterday afternoon.|were",
      "My friends _______ very kind and helpful.|are",
      "She _______ a teacher before she retired.|was",
      "We _______ excited about the trip tomorrow.|are",
      "He _______ at home when I called.|was",
      "The books _______ on the shelf last week.|were",
      "This sandwich _______ delicious!|is",
      "You _______ very tired after the long hike.|were",
      "The children _______ playing outside right now.|are",
    ],
  },
};

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

$(document).ready(function () {
  $("#start-button").on("click", function () {
    $("#mascot-overlay").fadeOut(500);
  });
  gsap.to("#start-button", {
    scale: 1.05,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.from(".mascot-box img", {
    y: -20,
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    ease: "bounce.out",
  });

  let correct = 0;
  let wrong = 0;

  const correctSound = document.getElementById("sound-correct");
  const wrongSound = document.getElementById("sound-wrong");
  const celebrateSound = document.getElementById("sound-celebrate");
  const resetSound = document.getElementById("sound-reset");

  function loadLesson(lessonKey) {
    const { topic, options, examples } = lessons[lessonKey];

    $("body").removeClass().addClass(`${lessonKey}-bg`);
    $("#lesson-container").empty();
    $(".reference-bar").html(`<strong>Topic:</strong> ${topic}`);
    correct = 0;
    wrong = 0;
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
        gsap.fromTo(
          blank,
          {
            scale: 1,
          },
          {
            scale: 1.2,
            backgroundColor: "#c8e6c9",
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          }
        );
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

    gsap.to(".progress-fill", {
      width: percent + "%",
      duration: 0.5,
      ease: "power1.out",
    });

    $(".progress-text").text(
      `Correct: ${correct} | Wrong: ${wrong} | Score: ${percent}%`
    );

    if (correct === total && total > 0) {
      celebrateSound.play();
      $("#completion-badge").fadeIn();
    } else {
      $("#completion-badge").hide();
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
      // ✅ Load lesson only after overlay is gone
      loadLesson("lesson1");
    });
  });
});
