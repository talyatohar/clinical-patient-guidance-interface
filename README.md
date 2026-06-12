# Clinical Patient Guidance Interface

## Overview

Clinical Patient Guidance Interface is a bilingual web application prototype developed as part of a Clinical Engineering Project course at the Technion in collaboration with the Nuclear Medicine Department at Rambam Health Care Campus.

The prototype is designed to improve the patient experience during nuclear medicine examinations by providing clear step-by-step guidance, preparation instructions, educational content, accessibility features, and support during waiting periods.

This project is a demonstration prototype and is not connected to hospital information systems or real patient data.

---

## Demo Login

This prototype uses a demonstration database with mock patient records.

To explore the application:

* ID Number: 123456789
* Authentication Code: 1234

No real patient information is included in the project.
----

## Current Features

### Patient Experience

* Bilingual interface (Hebrew / English)
* Patient login using a demo database
* Examination-specific workflows
* Preparation checklists before arrival
* Step-by-step examination guidance
* Progress tracking throughout the examination
* Educational content for each examination stage
* Waiting-period support content
* Accessibility settings
* Completion screen with patient feedback

### Nuclear Medicine Protocols Included

* Bone Scan
* Cardiac Perfusion Scan
* PET-CT
* PSMA Therapy
* PSMA Diagnostic Imaging

---

## Technology Stack

* React
* TypeScript
* Vite
* React Router
* Excel-based demo database

---

## Data Source

The prototype uses an Excel-based demonstration database located at:
public/data/NuclearMedicineDemoDatabase.xlsx

The database contains protocol information, preparation instructions, educational content, waiting-period content, and multilingual translations used throughout the application.

No real patient information is included.

---

## Project Structure

src/
├── app/
├── features/
│   ├── patient/      # Implemented patient-facing application
│   └── staff/        # Reserved for future development
├── shared/
└── styles/

---

## Future Extensions

The project architecture includes placeholders for future development that are not implemented in the current prototype:

* Staff dashboard
* Real-time patient workflow management
* Hospital information system integration
* Appointment notifications
* Companion / family access
* Analytics and operational reporting

These features are planned future extensions and are not part of the current implementation.

---

## Running the Project

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

---

## Academic Context

This prototype was developed for educational purposes as part of a Clinical Engineering Project course.

The goal was to explore how digital tools can improve patient guidance, reduce uncertainty, and support communication throughout nuclear medicine examinations.

```
```
