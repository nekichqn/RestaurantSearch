const API_KEY = 'a89145462eaabc36';
const proxy = "https://api.allorigins.win/raw?url=";

// URLから店舗IDを取得
const params = new URLSearchParams(window.location.search);
const shopId = params.get('id');

if (!shopId) {
  document.getElementById('detail').textContent = "店舗IDが指定されていません。";
} else {
  const apiURL = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${API_KEY}&id=${shopId}&format=json`;
  const fullURL = proxy + encodeURIComponent(apiURL);

  fetch(fullURL)
    .then(response => {
      if (!response.ok) throw new Error("APIレスポンスエラー");
      return response.json();
    })
    .then(data => {
      const shop = data.results.shop[0];
      const container = document.getElementById('detail');

      container.innerHTML = `
        <div class="detail-container">
          <div class="title-row">
            <h1>${shop.name}</h1>
            <a href="${shop.urls.pc}" class="reserve-button" target="_blank" rel="noopener">公式ページへ</a>
          </div>
          <img src="${shop.photo.pc.l}" alt="${shop.name}" class="hero-image" />
          <div class="layout-two-column">
            <div class="map-container">
              <div id="map"></div>
            </div>
            <div class="info-block">
              <p><strong>住所:</strong> ${shop.address}</p>
              <p><strong>アクセス:</strong> ${shop.access}</p>
              <p><strong>営業時間:</strong> ${shop.open}</p>
              <p><strong>定休日:</strong> ${shop.close}</p>
              <p><strong>予算:</strong> ${shop.budget.name}</p>
            </div>
          </div>
        </div>
      `;

      // 地図を表示
      if (shop.lat && shop.lng) {
        const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: parseFloat(shop.lat), lng: parseFloat(shop.lng) },
          zoom: 15
        });
        new google.maps.Marker({
          position: { lat: parseFloat(shop.lat), lng: parseFloat(shop.lng) },
          map,
          title: shop.name
        });
      }
    })
    .catch(error => {
      document.getElementById('detail').textContent = "詳細の取得に失敗しました。";
      console.error("fetch error:", error);
    });
}
