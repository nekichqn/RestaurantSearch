// ✅ app.js 全体コード（ページネーション改善済）
const API_KEY = 'a89145462eaabc36'; // HotPepper APIキー
let currentPage = 1;
let lat = null, lng = null;
const itemsPerPage = 9; // 1ページに表示する件数（3x3）

const proxy = "https://api.allorigins.win/raw?url=";

document.getElementById('search-form').addEventListener('submit', e => {
  e.preventDefault();
  getCurrentLocation().then(() => {
    currentPage = 1;
    searchRestaurants();
  });
});

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      resolve();
    }, () => {
      alert("現在地の取得に失敗しました。");
      reject();
    });
  });
}

function searchRestaurants() {
  const range = document.getElementById('range').value;
  const keyword = document.getElementById('keyword').value;
  const start = (currentPage - 1) * itemsPerPage + 1;

  const baseUrl = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${API_KEY}&lat=${lat}&lng=${lng}&range=${range}&keyword=${encodeURIComponent(keyword)}&count=${itemsPerPage}&start=${start}&format=json`;
  const url = proxy + encodeURIComponent(baseUrl);

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "<p>検索中...</p>";

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("レスポンスが不正です");
      return response.json();
    })
    .then(data => {
      showResults(data);
      resultsDiv.scrollIntoView({ behavior: 'smooth' });
    })
    .catch(error => {
      alert("データの取得に失敗しました。CORS制限またはAPIキーの問題かもしれません。");
      console.error("fetch error:", error);
    });
}

function showResults(data) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";

  if (!data.results.shop || data.results.shop.length === 0) {
    resultsDiv.innerHTML = "<p>見つかりませんでした。</p>";
    return;
  }

  data.results.shop.forEach(shop => {
    const div = document.createElement('div');
    div.className = 'shop';
    div.innerHTML = `
      <img src="${shop.photo?.mobile?.s || 'no-image.png'}" alt="${shop.name}" />
      <h3><a href="detail.html?id=${shop.id}">${shop.name}</a></h3>
      <p>${shop.access}</p>
    `;
    resultsDiv.appendChild(div);
  });

  setupPagination(data.results.results_available);
}

function setupPagination(totalResults) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);

  const createButton = (text, page, isActive = false, isDisabled = false) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    if (isActive) btn.classList.add('active');
    if (isDisabled) btn.disabled = true;
    btn.addEventListener('click', () => {
      currentPage = page;
      searchRestaurants();
    });
    return btn;
  };

  pagination.appendChild(createButton("←", currentPage - 1, false, currentPage === 1));

  let startPage = Math.max(1, currentPage - half);
  let endPage = Math.min(totalPages, currentPage + half);

  if (currentPage <= half) endPage = Math.min(totalPages, maxVisible);
  if (currentPage + half >= totalPages) startPage = Math.max(1, totalPages - maxVisible + 1);

  if (startPage > 1) {
    pagination.appendChild(createButton("1", 1));
    if (startPage > 2) {
      const dots = document.createElement("span");
      dots.textContent = "…";
      dots.className = "ellipsis";
      pagination.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.appendChild(createButton(i, i, i === currentPage));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "…";
      dots.className = "ellipsis";
      pagination.appendChild(dots);
    }
    pagination.appendChild(createButton(totalPages, totalPages));
  }

  pagination.appendChild(createButton("→", currentPage + 1, false, currentPage === totalPages));
}
