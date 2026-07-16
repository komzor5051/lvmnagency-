# 3D-аватар Влада — что нужно принести

Короткий бриф для самостоятельной работы. Цель — добыть исходники, из которых
я соберу крутящийся 3D-персонаж на сайт.

## Что мы вообще делаем

На сайте будет один сквозной 3D-элемент — стилизованная 3D-голова Влада, которая
крутится и двигается при скролле (полный оборот 360°, видно профиль и затылок).
Вокруг неё перестраивается контент каждой секции.

Твоя задача сейчас — принести **исходник, из которого рождается сама 3D-модель**.
Дальше интеграцию на сайт (three.js, вращение, стиль, перф, мобилки) делаю я.

## Стиль персонажа (зафиксировано)

- Матовый монохромный скульптурный бюст: графит / гипс, без цвета кожи.
- Белый фон, один лаймовый (#C8F04C) контурный свет по краю.
- Стилизация, не фотореализм. Узнаваемо Влад, но как «скульптура».
- Никакого глянца/пластика, градиентов, фиолетового, теней-украшений — anti-slop.

---

## Путь A (основной) — turnaround через Figma Weavy

Генерим твою голову с 5 ракурсов в одном стиле, потом эти картинки идут в
image-to-3D и получаем модель.

**Шаги:**
1. В Weavy прикрепи `public/portrait.jpg` как reference / identity-вход
   (чтобы лицо осталось твоим).
2. Прогони **Промпт 1** — лови похожесть и стиль. Повторяй, пока не станет «это я».
3. На зафиксированном стиле сгенери **5 ракурсов** (Промпты 2–6). Важно: одинаковые
   материал, свет, масштаб и кадрирование во всех пяти — меняется только камера.
4. Принеси мне 5 картинок.

### Промпт 1 — стиль-якорь

```
Stylized 3D character bust of a young man in his mid-20s, based on all
attached reference photos — preserve his exact identity and natural facial
asymmetry: medium-length dark brown curtain haircut with a center to slightly
off-center part, high natural volume on top, curved front locks toward both
temples, layered sides around the upper ears and longer tapered hair at the
nape; straight medium-density eyebrows; pale grey-blue eyes; elongated narrow
oval face with a softly defined narrow jaw and chin; long straight narrow nose
with a softly rounded tip; thin upper lip and fuller lower lip; clean-shaven
face with only natural faint facial shadow; calm closed-mouth neutral
expression. Do not beautify or substitute a generic face.

Rendered as a matte monochrome sculpture — smooth graphite-grey clay /
plaster material, no skin texture, no color on the face. Soft even studio
lighting with a single subtle lime-green (#C8F04C) rim light along one edge
of the head. Pure white seamless studio background. Clean minimal high-end
editorial product-render aesthetic. Head-and-shoulders, plain collar,
centered composition.

avoid: photorealistic skin, glossy plastic, rainbow or purple colors,
gradients, drop shadows, busy background, text, watermark, logos, earbuds,
cartoon, anime, exaggerated features, sunglasses, short side-swept hair,
quiff, undercut, fade, beard, visible stubble, widened face, exaggerated jaw
```

### Промпты 2–6 — ракурсы (стиль-блок из промпта 1 не меняем, меняем только камеру)

```
2. FRONT         — camera facing directly front, perfectly symmetrical, eyes to camera
3. THREE-QUARTER — camera 45 degrees to his left, three-quarter view
4. PROFILE       — strict left side profile, 90 degrees, ear centered
5. REAR-QUARTER  — camera 135 degrees behind-left, back and side of the head visible
6. BACK          — camera directly behind, full back of head and neck, no face
```

**Формат сдачи (путь A):**
- 5 файлов PNG (или JPG), по одному на ракурс.
- Белый фон, голова по центру, одинаковый масштаб.
- Разрешение от 1024×1024 и выше.
- Назвать понятно: `front.png`, `three-quarter.png`, `profile.png`,
  `rear-quarter.png`, `back.png`.
- Положить в `public/avatar-src/`.

---

## Путь B (запасной, если Weavy не даёт похожесть) — скан телефоном

Часто даёт более точный и «настоящий» 360°, чем генерация.

**Шаги:**
1. Поставь приложение **Polycam** (или **Luma AI**) на телефон.
2. Режим Photo / Object. Хорошее равномерное освещение, нейтральный фон.
3. Медленно обойди свою голову по кругу, снимая со всех сторон
   (сверху-чуть, по горизонту, снизу-чуть) — 40–60 кадров.
4. Дай приложению собрать модель, экспортни как **.glb** или **.obj**.

**Формат сдачи (путь B):**
- Файл `head.glb` (предпочтительно) или `.obj` + текстуры.
- Положить в `public/avatar-src/`.
- Если экспорт не выходит — просто принеси видео обхода головы (30–60 сек,
  медленный круг), из него тоже можно собрать модель.

---

## Итог — что принести

Одно из двух:
- **A:** 5 PNG-ракурсов из Weavy в `public/avatar-src/`, либо
- **B:** `head.glb` (или видео обхода) в `public/avatar-src/`.

Когда принесёшь — я делаю модель боевой (монохром + лайм) и вживляю на сайт
с вращением по скроллу. Дизайн самой интеграции (какая секция как двигает
голову) добьём отдельным дизайн-документом на следующем шаге.
