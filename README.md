# Freedom Wall

Small message wall app.

## Production checklist (Railway)

1. Add environment variables in Railway project settings:
   - `MYSQL_HOST` or `DATABASE_URL`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - (optional) `MYSQL_PORT`
   - `DB_SSL` = `1` if your DB requires TLS
   - `DEBUG` = `true` to enable stack traces in `/users` responses

2. Deploy from GitHub or push repository, then redeploy.

3. Check logs and hit `/dbcheck` to verify connectivity.

4. Ensure the database schema is created. You can run the included initializer before first run:

```bash
npm run db:init
```

This will create the `messages` table if it does not exist.

## Local testing

Set env vars then run:

```powershell
$env:MYSQL_HOST="your-host"
$env:MYSQL_USER="your-user"
$env:MYSQL_PASSWORD="your-pass"
$env:MYSQL_DATABASE="your-db"
node server.js
```

Or provide `DATABASE_URL`:

```powershell
$env:DATABASE_URL="mysql://user:pass@host:3306/db"
node server.js
```

## Notes
- The server uses `helmet` for basic security headers and `morgan` for logging.
- Static assets are served with caching headers.
 - Run `npm run db:init` to create the schema if needed.
