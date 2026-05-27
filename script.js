const root = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");
const searchInput = document.querySelector("#searchInput");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const posts = Array.from(document.querySelectorAll(".post-card"));
const emptyState = document.querySelector("#emptyState");
const subscribeForm = document.querySelector(".subscribe-panel");
const formMessage = document.querySelector("#formMessage");

const savedTheme = localStorage.getItem("blog-theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
}

let activeFilter = "all";

function normalize(value) {
  return value.trim().toLowerCase();
}

function updatePosts() {
  const query = normalize(searchInput.value);
  let visibleCount = 0;

  posts.forEach((post) => {
    const categoryMatches = activeFilter === "all" || post.dataset.category === activeFilter;
    const searchableText = normalize(`${post.textContent} ${post.dataset.tags}`);
    const queryMatches = !query || searchableText.includes(query);
    const shouldShow = categoryMatches && queryMatches;

    post.hidden = !shouldShow;
    if (shouldShow) {
      visibleCount += 1;
    }
  });

  emptyState.hidden = visibleCount !== 0;
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "" : "dark";
  if (nextTheme) {
    root.dataset.theme = nextTheme;
    localStorage.setItem("blog-theme", nextTheme);
  } else {
    delete root.dataset.theme;
    localStorage.removeItem("blog-theme");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    updatePosts();
  });
});

searchInput.addEventListener("input", updatePosts);

subscribeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(subscribeForm);
  const email = data.get("email");
  formMessage.textContent = email ? "已记录订阅意向，接入后端后即可发送更新。" : "请输入邮箱地址。";
  subscribeForm.reset();
});
