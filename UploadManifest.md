# The Iridologist - Upload Manifest

This document serves as the Content Upload Manifest for Dr. Philippe's team to sync their existing YouTube, Vimeo, and local media assets to the Knowledge Vault.

## Media Vault Categories & Tiers
When mapping a video or audio file to the platform, ensure the following columns are populated in your CMS or database upload script.

| Content ID | Type | Required Tier | Tags | EN Title | FR Title | AR Title | Media URL (YouTube/Vimeo) | Thumbnail URL |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `vid_001` | `Video` | `Silver` | `Sugar Detox`, `Fatigue` | 21-Day Sugar Detox | Detox au Sucre | التخلص من سموم السكر | `https://youtube.com/...` | `https://unsplash.com/...` |
| `aud_001` | `Audio` | `Gold` | `Digestion`, `Anxiety` | Gut Health Meditation | Méditation Digestion | تأمل صحة الأمعاء | `https://vimeo.com/...` | `https://unsplash.com/...` |
| `blg_001` | `Blog` | `Bronze` | `Iridology 101` | Iridology Basics | Bases de l'Iridologie | أساسيات علم القزحية | `(Markdown Content)` | `https://unsplash.com/...` |

### Integration Instructions
1. **Video/Audio Streaming**: For `MediaUrl`, use the direct embed link from YouTube/Vimeo to prevent heavy bandwidth costs on the platform's infrastructure.
2. **Thumbnails**: All thumbnails must be uploaded to the platform’s CDN (e.g., AWS S3 bucket) and provided as absolute URLs.
3. **i18n Localization**: The platform uses exactly `en`, `fr`, and `ar` keys for localization. If a language is missing, it will fallback to English. The `ar` view will automatically flip the layout to RTL (Right-to-Left).
4. **Symptom Tags**: Tags must match the exact strings defined in the `SymptomTag` type to be searchable in the UI filter: `Anxiety`, `Digestion`, `Sugar Detox`, `Fatigue`, `Iridology 101`. Any custom tags will require a frontend code update.
