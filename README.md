# zbiorkom.live

## iOS (Capacitor) setup

### 1. Wymagania lokalne (Linux)

- Node.js 20+
- npm 10+

### 2. Instalacja i synchronizacja projektu iOS

```bash
npm ci
npm run build:web
npx cap add ios
npx cap sync ios
```

### 3. Konfiguracja push backendu

Ustaw endpoint rejestracji tokena push:

```bash
echo 'VITE_PUSH_REGISTER_URL=https://api.zbiorkom.live/ios/push/register' > .env.local
```

Endpoint powinien przyjmować:

```json
{
    "token": "APNS_DEVICE_TOKEN",
    "platform": "ios"
}
```

### 4. Universal links

Plik:

`public/.well-known/apple-app-site-association`

Zmień:

- `__APPLE_TEAM_ID__.live.zbiorkom.app` jest podmieniane automatycznie w CI z sekretu `APPLE_TEAM_ID`

### 5. GitHub Secrets do automatycznego `.ipa` (KravaSign/sideload)

W repo ustaw:

- `BUILD_CERTIFICATE_BASE64` - certyfikat `.p12` (base64)
- `P12_PASSWORD` - hasło do `.p12`
- `BUILD_PROVISION_PROFILE_BASE64` - provisioning profile `.mobileprovision` (base64)
- `KEYCHAIN_PASSWORD` - hasło tymczasowego keychain
- `APPLE_TEAM_ID` - opcjonalne (jeśli nie podasz, workflow bierze Team ID z provisioning profile)
- `SIGNING_IDENTITY` - opcjonalne (np. enterprise/development/ad-hoc identity); bez tego workflow wybiera pierwszą tożsamość z certyfikatu
- `APP_STORE_CONNECT_KEY_ID` - opcjonalne, tylko dla App Store/TestFlight
- `APP_STORE_CONNECT_ISSUER_ID` - opcjonalne, tylko dla App Store/TestFlight
- `APP_STORE_CONNECT_PRIVATE_KEY` - opcjonalne, tylko dla App Store/TestFlight

Przygotowanie base64:

```bash
base64 -w 0 ios_distribution.p12 > cert.base64
base64 -w 0 AppStore.mobileprovision > profile.base64
```

### 6. CI/CD (sideload-first)

Workflow:

`/.github/workflows/ios-ipa.yml`

Działa na `push` do `main` i:

1. buduje web (`npm run build:web`)
2. synchronizuje Capacitor iOS
3. automatycznie wybiera tryb:
    - `signed` (gdy podane sekrety podpisu)
    - `unsigned` (gdy sekrety podpisu nie są podane)
4. eksportuje artifacty (`.ipa` signed lub unsigned)
5. dodaje instrukcję zewnętrznego podpisywania (`external-signing.txt`)
6. TestFlight tylko opcjonalnie: `workflow_dispatch` + `export_method=app-store` + `upload_testflight=true`

### 7. Sideload i testy na iPhone (bez Maca)

1. Pobierz artifact `ios-build-output` z GitHub Actions.
2. Jeśli masz `unsigned.ipa`, podpisz go zewnętrznie (KravaSign) i dopiero instaluj.
3. Zainstaluj przez AltStore/Sideloadly/MDM albo TestFlight (gdy używasz oficjalnego App Store flow).

### 8. Kolejne release'y

1. Zwiększ wersję:
    ```bash
    npm version patch
    ```
2. Wypchnij na `main`:
    ```bash
    git push origin main --follow-tags
    ```
3. Workflow automatycznie wygeneruje nowe artefakty `.ipa` (sideload-first).
