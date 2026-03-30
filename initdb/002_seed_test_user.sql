INSERT INTO users (email, password_hash)
VALUES (
  'example@example.com',
  '$2y$12$Xdya1./zrsmn/hzNXtH.2.GctCBSUxYRKJrFsNlOqOywfpnPe76xK'
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash);
