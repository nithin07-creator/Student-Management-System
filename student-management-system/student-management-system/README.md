# Student Management System

A full-stack CRUD application for managing student records, built per the
Standard Operating Procedure for CRUD-based web application development.

## What's included

```
student-management-system/
├── backend/studentapi/       # Django REST Framework API (primary backend)
├── spring-boot-backend/      # Spring Boot API (alternate backend, same endpoints)
├── frontend-react/           # React frontend (primary — talks to Django)
├── frontend-vanilla/         # Plain HTML/CSS/JS frontend (no build step)
└── docs/                     # Postman test cases, API reference
```

Pick **one** backend and **one** frontend to run together. Both frontends
are pre-wired to call the Django API at [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api).

## Entity: Student

| Field            | Type            | Notes                                  |
|-------------------|----------------|-----------------------------------------|
| id                | integer (PK)    | auto-generated                          |
| first_name        | string          | required                                |
| last_name         | string          | required                                |
| email             | string          | required, unique, valid email format    |
| phone             | string          | required, 7–15 digits, optional leading +|
| date_of_birth     | date            | required, must be in the past, age ≥ 15 |
| course            | string (enum)   | CSE / ECE / MECH / CIVIL / EEE / IT / OTHER |
| enrollment_date   | date            | auto-set on creation                    |
| address           | text            | optional                                |

## Option A — Run the Django backend + React frontend (recommended)

### 1. Backend setup

```bash
cd backend/studentapi
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

python3 manage.py makemigrations students
python3 manage.py migrate
python3 manage.py createsuperuser   # optional, for Django admin at /admin/

python3 manage.py runserver 8000
```

The API is now live at [http://127.0.0.1:8000/api/students/](http://127.0.0.1:8000/api/students/).

### 2. Frontend setup

In a **separate terminal**:

```bash
cd frontend-react
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Option B — Run the Django backend + vanilla HTML/CSS/JS frontend

Follow the backend steps above, then just open `frontend-vanilla/index.html`
directly in a browser (or serve it with any static file server, e.g.
`python3 -m http.server 5500` from inside `frontend-vanilla/`). No build
step or npm install required.

## Option C — Run the Spring Boot backend instead of Django

```bash
cd spring-boot-backend
mvn spring-boot:run
```

The API will be live at [http://127.0.0.1:8080/api/students/](http://127.0.0.1:8080/api/students/). If you use
this backend, update `API_BASE_URL` in `frontend-react/src/api.js` (or
`API_BASE` in `frontend-vanilla/index.html`) from port `8000` to `8080`.

**Database note:** the Spring Boot backend uses H2 (file-based) rather than
SQLite. Hibernate's SQLite dialect support is unreliable, so H2 is used as
the closest zero-setup, single-file embedded database for the JVM. Data is
stored in `spring-boot-backend/data/studentdb.mv.db`. A live H2 console is
available at `http://localhost:8080/h2-console` while the server is running,
for inspecting the database directly (JDBC URL:
`jdbc:h2:file:./data/studentdb`, user `sa`, blank password).

## REST API Reference

| Operation  | Method | Endpoint                | Success | 
|------------|--------|--------------------------|---------|
| Create     | POST   | `/api/students/`         | 201     |
| Read all   | GET    | `/api/students/`         | 200     |
| Read one   | GET    | `/api/students/{id}/`    | 200     |
| Update     | PUT/PATCH | `/api/students/{id}/` | 200     |
| Delete     | DELETE | `/api/students/{id}/`    | 200     |

Query params on `GET /api/students/`:
- `?search=<text>` — matches first name, last name, email, or course
- `?course=<CODE>` — filters to an exact course code (e.g. `CSE`)

See `docs/API_TESTING.md` for full request/response examples and Postman
test cases covering valid, invalid, missing, and duplicate data.

## Validation

Implemented on **both** client and server (server-side is authoritative —
per the SOP, client-side validation alone is never sufficient):

- Required fields (first name, last name, email, phone, date of birth) reject empty values
- Email must match a valid email format and must be unique (case-insensitive)
- Phone must be 7–15 digits, optional leading `+`
- Date of birth must be in the past, and the student must be at least 15 years old
- Attempting to reuse an email on update excludes the record being edited (so saving without changes doesn't false-positive)

## Security notes

- No credentials or secrets are hard-coded. Django's `SECRET_KEY` reads from
  the `DJANGO_SECRET_KEY` environment variable, falling back to a dev-only
  value locally.
- CORS is restricted to explicit local dev origins (`localhost:3000`,
  `localhost:5173`) rather than left wide open — narrow this further, or
  point it at your real frontend origin, before any deployment.
- All database writes go through Django's ORM / Spring's JPA (parameterized
  queries), never raw SQL string interpolation.

## Known limitations / next steps

- No authentication/authorization layer yet (SOP section 11 flags this as
  needed for "protected applications" — add Django's session/token auth or
  Spring Security if multiple registrar users need distinct access levels).
- Pagination is enabled on the Django list endpoint (20/page) but the React
  and vanilla frontends currently render only the first page — add a
  "load more" or page control if your roster exceeds 20 students.
- The Spring Boot backend has not been runtime-tested in this environment
  (no Maven/network access to Maven Central here) — the Django path is the
  one that's been verified end-to-end. Review it before relying on it for
  a graded submission, and test locally before your demo.
