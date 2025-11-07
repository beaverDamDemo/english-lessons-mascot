export function animateCards() {
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

export function showLessonTransition(lessonKey, topic, lessonsMap) {
  const toast = $(
    `
    <div class="toast next-lesson-toast">
      ✨ Now starting <strong>${lessonKey.toUpperCase()}</strong>: ${topic}
    </div>
  `
  );
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
