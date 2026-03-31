# VPS Deploy

`task-workplace.g-tatemichi.com` を既存 VPS に追加したときの手順メモです。

## 方針

- 既存の `note-stacks.g-tatemichi.com` はそのまま残す
- このアプリは別コンテナで起動する
- `task-workplace` 側では `app` と `db` を独立して起動する
- 入口は既存の `note_front_nginx` コンテナを使う
- `task-workplace.g-tatemichi.com` へのアクセスを `172.17.0.1:18090` に流す
- React フロントと PHP API は同じサブドメインで配信する

## 事前準備

1. DNS で `task-workplace.g-tatemichi.com` を VPS の IP に向ける
2. VPS にリポジトリを clone する
3. `.env.vps.example` をコピーして `.env.vps` を作る

```bash
cp .env.vps.example .env.vps
```

`.env.vps` では少なくとも次を設定します。

```env
DB_HOST=db
DB_NAME=task-wp
DB_USER=appuser
DB_PASSWORD=apppass

MARIADB_ROOT_PASSWORD=your-strong-root-password
MARIADB_DATABASE=task-wp
MARIADB_USER=appuser
MARIADB_PASSWORD=apppass

APP_ALLOWED_ORIGINS=https://task-workplace.g-tatemichi.com
VITE_API_BASE_URL=https://task-workplace.g-tatemichi.com/api
```

## Docker 起動

```bash
docker compose --env-file .env.vps -f docker-compose.vps.yml up -d --build
```

この compose は次の構成です。

- `app`: Apache + PHP + built frontend
- `db`: MariaDB

DB は初回起動時に `initdb/` の SQL を読んで、

- `users`
- `tasks`
- テストユーザー `example@example.com / 123456`

を作ります。起動確認は次でできます。

```bash
docker compose --env-file .env.vps -f docker-compose.vps.yml ps
```

## Reverse Proxy

この VPS ではホストの Nginx ではなく、既存の `note_front_nginx` コンテナが 80 / 443 の入口になっていました。  
そのため、`/opt/NOTE-STACKS/nginx/default.conf` に `task-workplace.g-tatemichi.com` 用の `server` を追加します。

HTTP 側:

```nginx
server {
    listen 80;
    server_name task-workplace.g-tatemichi.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://172.17.0.1:18090;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 20m;
}
```

一度反映:

```bash
docker exec note_front_nginx nginx -t
docker exec note_front_nginx nginx -s reload
```

## HTTPS

このサーバーではホストに certbot が入っていたので、`webroot` モードで証明書を発行します。

```bash
certbot certonly --webroot -w /var/www/certbot -d task-workplace.g-tatemichi.com
```

証明書発行後、同じ `default.conf` に HTTPS 側を追加します。

```nginx
server {
    listen 443 ssl;
    server_name task-workplace.g-tatemichi.com;

    ssl_certificate /etc/letsencrypt/live/task-workplace.g-tatemichi.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/task-workplace.g-tatemichi.com/privkey.pem;

    location / {
        proxy_pass http://172.17.0.1:18090;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 20m;
}
```

HTTP 側を最終的にリダイレクトにするなら次の形です。

```nginx
server {
    listen 80;
    server_name task-workplace.g-tatemichi.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
```

反映:

```bash
docker exec note_front_nginx nginx -t
docker exec note_front_nginx nginx -s reload
```

## 動作確認

1. `https://task-workplace.g-tatemichi.com` が開く
2. ログイン画面が出る
3. `example@example.com / 123456` でログインできる
4. タスクの一覧 / 作成 / 更新 / 削除が動く
5. 時間つきタスクがカレンダーに表示される

## 補足

- `vite.config.js` は subdomain 直下に置く前提で `base: "/"` にしている
- `src/assets/phpApi.js` は `VITE_API_BASE_URL` を読めるようにしている
- `api/bootstrap.php` は `APP_ALLOWED_ORIGINS` を読んで CORS を切り替える
- `config/db.php` は環境変数から DB 接続情報を読める
- `task-wp-app` は `18090` で公開し、既存の `note_front_nginx` から参照する
