# AppleP12 Sign

A full-stack Node.js + TypeScript application that simulates iOS IPA signing. Users can submit their UDID, choose a certificate and IPA, pay via a dummy checkout, and receive a signed IPA download link. Admins manage certificates, apps, orders, and basic settings.

## Features
- Public signing page with UDID, certificate, and IPA selection.
- Dummy payment flow that immediately confirms payment and triggers simulated signing.
- Admin dashboard for certificates, apps (with IPA uploads), orders, and settings.
- Simulated signing using a shell script that copies the IPA into a signed folder.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Views:** EJS with express-ejs-layouts
- **Styling:** Plain CSS
- **Sessions/Auth:** express-session for admin authentication

## Setup
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables and update values:
   ```bash
   cp .env.example .env
   ```
3. Run database migrations and seed initial data:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Environment Variables
See `.env.example` for all variables. Required values include `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

## Dummy Payment Flow
The default provider is `dummy`, which returns a checkout URL at `/payment/dummy/:orderId`. Visiting that URL marks the order paid, runs the signing script, and redirects to `/success/:orderId`.

## Signing Simulation
The script `scripts/sign_ipa.sh` simulates signing by copying the IPA file:
```bash
./scripts/sign_ipa.sh <inputIpa> <outputIpa> <udid> <certificateId>
```
Make sure it is executable (`chmod +x scripts/sign_ipa.sh`). Replace the script with real signing logic on a Mac when ready.

## File Uploads
IPAs are uploaded to `uploads/ipas`. Signed builds are written to `uploads/signed`. Both directories are served statically for convenience.

## Admin Access
On startup the app ensures an admin user exists using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the environment. Login at `http://localhost:3000/admin/login`.

## Notes
- All signing and payments are simulated for local development.
- Update pricing and content as needed via the admin panel or database.
