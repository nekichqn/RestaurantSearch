# RestaurantSearch

このアプリは、現在地周辺のレストランを検索できるシンプルなWebアプリです。

## 🔑 APIキーの設定方法

### Google Maps API

本リポジトリには Google Maps API キーは含まれていません。  
ご自身で Google Cloud Platform にて API キーを取得し、以下のように `index.html` と `detail.html` に設定してください。

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
