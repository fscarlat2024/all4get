# All4Get — magazin online static (Eleventy + Snipcart)

Magazin de prezentare + cos + plati, construit static (Eleventy) si deployat pe Cloudflare.
Coșul si platile sunt gestionate de **Snipcart** (extern) — nimic de spart pe partea ta.

## Stack
- **Eleventy v3** — generator static
- **Snipcart 3.x** — cos, checkout, plati card, taxe, cupoane
- **Cloudflare** — hosting (Worker cu static assets, `wrangler.jsonc`)
- Piata: **Romania**, moneda **RON**, stoc propriu

## Rulare locala
```bash
npm install
npm start          # http://localhost:8083
npm run build      # genereaza _site/
```

## Pasii ca sa devina magazin REAL (checklist)
1. **Cont Snipcart** (snipcart.com) → ia **Public API Key** (Test si Live).
   - Pune cheia in `src/_data/site.json` → `snipcartApiKey`.
   - In dashboard Snipcart: seteaza moneda **RON**, regiunile de livrare, cotele de TVA, metodele de plata (Stripe/mollie/etc.), regulile de transport.
2. **Domeniu**: adauga domeniul in Snipcart (Domains & URLs) — Snipcart valideaza preturile crawland paginile de produs de pe domeniul tau. Pe `localhost` ruleaza automat in modul Test.
3. **Date firma**: completeaza in `site.json` → `company` (CUI, Reg. Com., adresa, IBAN) si `email`/`phone` reale. Apar in footer si paginile legale.
4. **Produse reale**: vezi mai jos.
5. **Deploy** pe Cloudflare (vezi mai jos).

## Adaugare / editare produse
Un produs = un fisier `src/products/<slug>.md`. Copiaza unul existent si modifica frontmatter-ul:
```yaml
---
name: Nume produs
sku: CAT-XXX-999        # unic! Snipcart il foloseste ca item id
category: Audio          # apare automat in meniu + pagina de categorie
price: 149.99            # RON, TVA inclus
oldPrice: 219.99         # optional (afiseaza reducere)
stock: 42                # limiteaza cantitatea in cos
order: 1                 # ordinea pe homepage
short: Descriere scurta pe o singura linie, fara ghilimele duble.
image: /assets/img/products/slug.jpg
specs:
  - { k: Cheie, v: Valoare }
---
Descriere lunga (markdown) aici.
```
Pune imaginea in `src/assets/img/products/`. Ideal JPG/WebP 800x800.
Imaginile demo sunt SVG-uri placeholder — inlocuieste-le cu poze reale.

## Deploy Cloudflare (auto din GitHub, ca la site-urile Sinaia)
1. `git init && git add -A && git commit -m "init"` → push pe un repo GitHub nou.
2. Cloudflare → Workers & Pages → Create → Connect to Git → alege repo-ul.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
3. Adauga domeniul (Custom domain) → Snipcart Domains → activeaza modul Live.
Fiecare push pe `main` = build + deploy automat.

## Legal (Romania) — IMPORTANT
Paginile sunt gata ca structura, dar TREBUIE completate cu datele tale reale:
- `/termeni/`, `/retur/`, `/confidentialitate/`, `/cookies/`, `/livrare/`, `/contact/`, `/despre/`
- Obligatoriu la magazin RO: date firma complete, link ANPC + SAL + SOL (deja in footer),
  drept de retur 14 zile (OUG 34/2014), garantie 2 ani (Legea 449/2003), GDPR.
- Recomandat: banner de consimtamant cookies inainte de a activa analytics.
- Verifica cu un contabil/jurist inainte de lansare.

## Note tehnice
- CSP in `src/static/_headers` e reglat pentru Snipcart + Stripe. Daca adaugi alt procesator
  (PayPal, mollie), extinde `frame-src`/`connect-src` corespunzator.
- `_headers`: CSS/JS = `must-revalidate` (evita bug de cache stale), imaginile = `immutable`.
