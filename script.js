// ----- DARK MODE -----
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "🌙";
toggleBtn.className = "dark-toggle";
document.body.appendChild(toggleBtn);

// Check saved preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️";
}

// Toggle on click
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const darkModeOn = document.body.classList.contains("dark");
  toggleBtn.textContent = darkModeOn ? "☀️" : "🌙";
  localStorage.setItem("darkMode", darkModeOn);
});

// ----- SMOOTH SCROLL -----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// ----- SCROLL-TRIGGERED FADE-IN -----
const faders = document.querySelectorAll(".fade-in");
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));
