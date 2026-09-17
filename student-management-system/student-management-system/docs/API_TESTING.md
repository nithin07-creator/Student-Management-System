# API Testing — Student Management System

All examples below were run and verified against the Django backend
(`http://127.0.0.1:8000/api/students/`) during development. Import these
as a Postman collection, or run the equivalent `curl` commands directly.

## Base URL
```
http://127.0.0.1:8000/api
```

---

## 1. CREATE — valid data

**POST** `/students/`

```json
{
  "first_name": "Asha",
  "last_name": "Rao",
  "email": "asha.rao@example.com",
  "phone": "+919876543210",
  "date_of_birth": "2003-05-14",
  "course": "CSE",
  "address": "Chennai"
}
```

**Expected:** `201 Created`, response includes generated `id`, `enrollment_date` (today's date), `created_at`, `updated_at`.

---

## 2. CREATE — duplicate email

Same payload as above, submitted twice.

**Expected:** `400 Bad Request`
```json
{ "email": ["A student with this email already exists."] }
```

---

## 3. CREATE — missing required field

```json
{
  "first_name": "",
  "last_name": "Test",
  "email": "bad@example.com",
  "phone": "1234567",
  "date_of_birth": "2003-01-01"
}
```

**Expected:** `400 Bad Request`
```json
{ "first_name": ["This field may not be blank."] }
```

---

## 4. CREATE — invalid data variants to test

| Field         | Invalid value        | Expected error |
|---------------|----------------------|-----------------|
| email         | `"not-an-email"`     | invalid email format |
| phone         | `"abc"`              | fails phone pattern |
| phone         | `"123"` (too short)  | fails phone pattern |
| date_of_birth | tomorrow's date       | must be in the past |
| date_of_birth | 5 years ago           | must be at least 15 years old |
| course        | `"ROBOTICS"` (not in enum) | not a valid choice |

---

## 5. READ ALL

**GET** `/students/`

**Expected:** `200 OK`
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [ { "id": 1, "first_name": "Asha", ... } ]
}
```

Test with an **empty database** too — expect `"count": 0, "results": []`.

### Search & filter
- **GET** `/students/?search=asha` → matches name/email/course, case-insensitive
- **GET** `/students/?course=CSE` → exact course match

---

## 6. READ ONE

**GET** `/students/1/`

**Expected (exists):** `200 OK` with the student object.
**Expected (id=999, doesn't exist):** `404 Not Found`

---

## 7. UPDATE — valid partial update

**PATCH** `/students/1/`
```json
{ "course": "IT" }
```

**Expected:** `200 OK`, only `course` and `updated_at` change; all other fields unchanged.

## 8. UPDATE — invalid record ID

**PATCH** `/students/999/`
```json
{ "course": "IT" }
```

**Expected:** `404 Not Found`

## 9. UPDATE — email collision with a different student

Create two students (A, B). Then:

**PATCH** `/students/{B.id}/`
```json
{ "email": "<A's email>" }
```

**Expected:** `400 Bad Request` — duplicate email error.

**Edge case to verify:** PATCH-ing student A with A's own unchanged email
must succeed (the serializer excludes the record being edited from the
duplicate check).

---

## 10. DELETE — valid ID

**DELETE** `/students/1/`

**Expected:** `200 OK`
```json
{ "detail": "Student 'Asha Rao' was deleted successfully." }
```

Follow up with **GET** `/students/1/` → expect `404 Not Found`, confirming the record is actually gone from the database.

## 11. DELETE — invalid record ID

**DELETE** `/students/999/`

**Expected:** `404 Not Found`

---

## 12. Backend/database unavailable

Stop the Django server, then load the frontend.

**Expected:** the UI shows an error banner ("Couldn't load student records...
Check that the Django server is running on port 8000") rather than a blank
page or unhandled crash. Both the React and vanilla frontends implement
this via a try/catch around the initial fetch.

---

## 13. Frontend responsiveness

Test the React or vanilla app at these widths (browser dev tools → device toolbar):
- **Desktop** (≥1024px): toolbar shows search + course filter side by side, table at full width
- **Mobile** (≤640px): toolbar stacks vertically, table scrolls horizontally within its container (page itself does not scroll sideways), the add/edit panel takes the full screen width

---

## Test log template

| # | Test case | Expected | Actual | Pass/Fail |
|---|-----------|----------|--------|-----------|
| 1 | Create — valid | 201 | | |
| 2 | Create — duplicate email | 400 | | |
| 3 | Create — missing field | 400 | | |
| 5 | Read all — populated | 200, list returned | | |
| 5 | Read all — empty DB | 200, empty list | | |
| 6 | Read one — valid ID | 200 | | |
| 6 | Read one — invalid ID | 404 | | |
| 7 | Update — valid | 200, fields updated | | |
| 8 | Update — invalid ID | 404 | | |
| 10 | Delete — valid ID | 200 | | |
| 11 | Delete — invalid ID | 404 | | |
| 12 | Backend down | graceful error shown | | |
| 13 | Mobile responsiveness | layout adapts, no horizontal page scroll | | |

Fill in the "Actual" and "Pass/Fail" columns as you run through this list —
this table, populated with results, is exactly what SOP section 10 (Testing
Procedure) and section 13 (Documentation Requirements → "Testing results")
ask you to submit.
