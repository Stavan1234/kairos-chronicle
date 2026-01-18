

# 🧭 SCREENS (V1 – LOCKED)

## 1️⃣ **Daily Log / Home Screen**

**(Primary – 80% usage)**

Purpose:

* Log time blocks
* Add task chips
* Toggle Important / Urgent
* See Place
* Feel safe logging

Route:

```
/(di­ary)
```

Status:

* 🚧 In progress (TimeLogRow done, page next)

---

## 2️⃣ **Today Analytics Screen**

**(Secondary – intentional access)**

Purpose:

* See today’s structure
* Energy flow
* Task mix
* Place context

Route:

```
/analytics/today
```

Status:

* 🟡 UI planned, not built

---

## 3️⃣ **Weekly Analytics Screen**

**(Tertiary – pattern view)**

Purpose:

* Patterns across days
* No daily drilling by default

Route:

```
/analytics/week
```

Status:

* 🟡 Planned, later

---

## 4️⃣ **Daily Reflection Screen**

**(Optional, calm)**

Purpose:

* One-line reflection
* No pressure

Route:

```
/reflect/[date]
```

Status:

* 🟡 Planned, later

---

## 5️⃣ **History / Day Picker Screen**

**(Optional but powerful)**

Purpose:

* Open past days
* Read-only by default

Route:

```
/history
```

Status:

* 🔵 Nice-to-have (V1.1)

---

# 🧩 COMPONENTS (V1 – EXACT LIST)

## CORE LOGGING (BUILD FIRST)

### 1️⃣ `TimeLogRow`

* Handles task input
* Owns local state
* Client Component

Status: ✅ Built

---

### 2️⃣ `TaskChip`

* Displays task
* Handles remove

Status: ✅ Built

---

### 3️⃣ `TimeLogTable`

* Renders multiple `TimeLogRow`
* Pure layout component

Status: 🚧 Next

---

### 4️⃣ `LogHeader`

* Shows date
* Subtext

Status: ⏳ Later

---

## CONTROLS (MINIMAL)

### 5️⃣ `QuietToggle`

* Used for Important / Urgent
* Subtle, no colors

Status: ⏳ Next after table

---

### 6️⃣ `PlaceTag`

* Displays place
* Non-interactive initially

Status: ⏳ Later

---

## ANALYTICS COMPONENTS (LATER)

### 7️⃣ `ImportantUrgentMatrix`

### 8️⃣ `EnergyDistribution`

### 9️⃣ `TaskCategoryMix`

### 🔟 `PlaceDistribution`

(All read-only, derived)

---

## STRUCTURAL / LAYOUT

### 11️⃣ `DiaryLayout`

* Paper-like container
* Padding, max-width

---

### 12️⃣ `AnalyticsLayout`

---

## TOTAL COUNT (V1)

### Screens: **4 (5 optional)**

### Components: **12 core**

That’s it.
No more. No less.

---

## WHAT YOU SHOULD DO **RIGHT NOW**

Do **not** think about all screens.

Only focus on:

```
TimeLogRow → TimeLogTable → Diary page
```

Everything else waits.

---

## NEXT COMMAND (SEND TO GEMINI)

If you want speed, send this:

> Build `TimeLogTable` and the Diary page.
> Keep everything minimal.
> Pause after.

When Gemini replies, paste it here.
