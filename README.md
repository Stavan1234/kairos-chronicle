# Kairos Journal ⏳

> *“Teach us to number our days, that we may gain a heart of wisdom.” — Psalm 90:12*

**Kairos Journal** is a specialized time-logging application focused on intentionality and stewardship. Unlike traditional productivity tools that prioritize "output," Kairos is designed for **awareness and reflection**, helping users align their daily actions with their long-term values and spiritual calling.

---

## 🎯 Project Vision

The core objective of this project was to explore the intersection of **time management and mindfulness**. By distinguishing between *Chronos* (quantitative clock time) and *Kairos* (qualitative, purposeful time), the app provides a framework for users to observe their patterns without the pressure of typical "optimization" metrics.

---

## 🧠 Functional Overview

### 1. The Temporal Ledger

A simplified logging system utilizing 30-minute intervals. This encourages consistent check-ins without the friction of minute-by-minute tracking.

### 2. Time Categorization (Warikoo Matrix)

Built-in classification based on the Eisenhower/Warikoo framework:

* **High Impact vs. Low Impact**
* **Urgent vs. Non-Urgent**
* *Outcome:* Visualizes the "drift" between busy-work and meaningful progress.

### 3. Energy Resource Mapping

Instead of tracking "success," users track energy expenditure across four dimensions:

* **Mental, Physical, Emotional, and Spiritual.**
* This provides a holistic view of burnout risks and recovery patterns.

---

## 🛠 Technical Architecture

The application is built with a modern, scalable stack, emphasizing an **offline-first experience** and secure data synchronization.

* **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS.
* **Backend-as-a-Service:** Supabase (PostgreSQL, Row Level Security).
* **Authentication:** Passwordless Magic-Link via Supabase Auth.
* **State & Sync:** Optimistic UI updates for seamless local-to-cloud transitions.
* **Deployment:** Vercel.

---

## 📂 System Structure

```text
src/
├── app/                  # Routing & Server Components
│   ├── analytics/        # Logic for pattern recognition
│   └── auth/             # Secure authentication flow
├── components/           # Modular UI Architecture
│   ├── log/              # Time-entry logic & state management
│   ├── analytics/        # Data visualization components
│   └── ui/               # Design system primitives
├── lib/                  # Core Business Logic
│   ├── matrix.ts         # Priority calculation algorithms
│   └── energy.ts         # Energy distribution logic
└── types/                # Strict Type definitions for data integrity

```

---

## 🚀 Development Methodology

This project was developed using a **Human-in-the-Loop AI workflow**.

* **Role:** I acted as the Product Architect and Lead Engineer, defining the system requirements, UI/UX philosophy, and database schema.
* **Execution:** Leveraging AI tools (Cursor/LLMs) for code generation, I focused on high-level logic, debugging, and ensuring architectural consistency across the Next.js App Router and Supabase integration.

---

## 📜 Ethical Disclaimer

Kairos Journal is intentionally designed to be **non-addictive**. It lacks "gamification" features like streaks or badges to ensure the user’s relationship with the tool remains healthy, quiet, and reflective.

---

## 🛠 Setup & Installation

1. **Clone & Install:** `npm install`
2. **Configuration:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your `.env.local`.
3. **Launch:** `npm run dev`

