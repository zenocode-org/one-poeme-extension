/*
Just draw a border round the document.body.
*/
const POETRY_BASE_URL = "https://poetrydb.org/";

function createPoemHTML(title, author, paragraph) {
  return `
  <div>
    <h1>${title}</h1>
    <h2>${author}</h2>
    ${paragraph}
  </div>`;
}

function setWithExpiry(key, value, ttl) {
  const today = new Date();
  today.setHours(23);
  today.setMinutes(59);
  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire at midnight
  const item = {
    value: value,
    expiry: today.getTime(),
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

function showPoem(poem) {
  const { title, author, lines } = poem;
  const poemDiv = document.getElementById("poem");
  poemDiv.innerHTML = createPoemHTML(title, author, lines.join("<br>"));
}

async function getPoemOfTheDay() {
  var poem = getWithExpiry("poem");
  if (poem === null) {
    const response = await fetch(POETRY_BASE_URL + "random", { method: "GET" });
    if (response.ok) {
      poem = await response.json();
      poem = poem[0];
    }
  }
  showPoem(poem);
  setWithExpiry("poem", poem);
}

getPoemOfTheDay();

const refreshButton = document.getElementById("refresh");
refreshButton.addEventListener("click", function () {
  localStorage.clear();
  getPoemOfTheDay();
});

// inspired by Ryan's svg animation
// https://codepen.io/ryanparag/pen/rNeybEe

const darkMode = document.querySelector(".theme-toggle");

function darkify() {
  document.documentElement.classList.toggle("theme--night");
  localStorage.setItem(
    "theme",
    document.documentElement.classList.contains("theme--night")
      ? "dark"
      : "light"
  );
}

darkMode.addEventListener("click", darkify);

const theme = localStorage.getItem("theme") || "light";
const isDark = document.documentElement.classList.contains("theme--night");
if (theme === "dark" && !isDark) {
  darkify();
}
