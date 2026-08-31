ԳԻՏԵԼԻՔ — GITHUB PAGES READY

Այս տարբերակում PHP ՉԿԱ։

Աշխատում են GitHub Pages-ում.
- բոլոր HTML/CSS/JS էջերը
- Reader
- 🧠 AI browser-side վերլուծությունը
- 🧠 GPT՝ ընտրված տեքստը clipboard պատճենելով և ChatGPT բացելով
- 🖼️ պատկերավորում՝ image.pollinations.ai ծառայությամբ
- ամբողջական static որոնում՝ data/search-index.json
- նույն գրքի գլուխների խմբավորում մեկ ստեղծագործության տակ

Նոր html նյութ ավելացնելուց հետո GitHub Actions-ը push-ի ժամանակ ավտոմատ կատարում է:
node tools/build-search-index.mjs

ՏԵՂԱԴՐՈՒՄ
1. Ստեղծեք GitHub repository, օրինակ giteliq.github.io
2. ZIP-ի բովանդակությունը տեղադրեք repository root-ում
3. Branch՝ main
4. Settings → Pages → Source՝ GitHub Actions
5. Push-ից հետո .github/workflows/pages.yml-ը ավտոմատ deploy կանի կայքը։

API key չկա և PHP hosting պետք չէ։
Եթե ապագայում պետք լինի իրական OpenAI API պատասխան հենց կայքի ներսում, գաղտնի բանալին browser JavaScript-ում չի կարելի պահել. միայն այդ ֆունկցիայի համար պետք կլինի փոքր server-side endpoint/Cloudflare Worker։


V2 — ՈՐՈՆՄԱՆ ՈՒՂՂՈՒՄ
- fetch() այլևս չի օգտագործվում։
- data/search-index.js և data/authors.js բեռնվում են որպես script։
- Որոնումը աշխատում է նաև index.html/index.htm ֆայլը համակարգչից ուղղակի բացելիս։
- GitHub Pages-ի root-ի համար ավելացված է index.html։
