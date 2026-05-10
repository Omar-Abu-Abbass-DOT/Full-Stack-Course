# OSTA API Documentation

**Base URL (development):**

```
http://localhost:3000/api
```

All protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

## Standard response shapes

| Type | Body |
|------|------|
| Success (single) | `{ "message": "...", "<resource>": { ... } }` |
| Success (list) | `{ "<resource>": [...], "page": 1, "limit": 10, "total": N, "totalPages": M, ... }` |
| Validation / not found / forbidden | `{ "message": "..." }` with appropriate HTTP status |
| Server error | `{ "message": "..." }` (and `error` field in non-production) |

User roles:

```
customer | provider | admin
```

---

## Auth

### Register

```http
POST /auth/register
```

```json
{
  "name": "Ayman",
  "email": "ayman@test.com",
  "password": "123456",
  "role": "customer",
  "phone": "0790000000"
}
```

Allowed roles on registration: `customer`, `provider`.

### Login

```http
POST /auth/login
```

```json
{ "email": "ayman@test.com", "password": "123456" }
```

Response:

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": { "id": "...", "name": "...", "email": "...", "role": "..." }
}
```

### Get current profile

```http
GET /auth/me
Authorization: Bearer TOKEN
```

### Update current profile

```http
PUT /auth/me
Authorization: Bearer TOKEN
```

```json
{ "name": "New Name", "phone": "...", "avatar": "https://..." }
```

---

## Services

### List services

```http
GET /services
```

Query parameters:

| Parameter | Description |
|-----------|-------------|
| `search` | Case-insensitive partial match on title/description/category |
| `category` | Exact category match (case-insensitive) |
| `location` | Partial match on location |
| `minPrice`, `maxPrice` | Price range |
| `provider` | Filter by provider id |
| `page`, `limit` | Pagination (default `page=1`, `limit=6`, max `limit=50`) |

### Create service

```http
POST /services
Authorization: Bearer PROVIDER_TOKEN
```

```json
{
  "title": "Cleaning Service",
  "description": "House cleaning",
  "category": "Cleaning",
  "price": 25,
  "location": "Amman",
  "coordinates": { "lat": 31.9539, "lng": 35.9106 },
  "image": "https://res.cloudinary.com/example/image.jpg"
}
```

`provider` is taken from the JWT — never trusted from the request body.

### Get / update / delete one service

```http
GET    /services/:id
PUT    /services/:id   (provider owner OR admin)
DELETE /services/:id   (provider owner OR admin)
```

PUT body accepts only: `title`, `description`, `category`, `price`, `location`, `coordinates`, `image`, `isActive`.

---

## Bookings

### List bookings

```http
GET /bookings
Authorization: Bearer TOKEN
```

Behavior by role:

- **customer:** sees own bookings.
- **provider:** sees bookings for their services.
- **admin:** sees all bookings.

Query params: `status`, `page`, `limit`.

### Get one booking

```http
GET /bookings/:id
```

Allowed for the customer, provider, or admin associated with the booking.

### Create booking

```http
POST /bookings
Authorization: Bearer CUSTOMER_TOKEN
```

```json
{
  "service": "SERVICE_ID",
  "date": "2026-05-10T10:00:00.000Z",
  "notes": "Optional notes"
}
```

Rules:
- `date` must be a valid date in the future.
- A customer cannot book their own service (if they also happen to be a provider).

### Update booking status

```http
PUT /bookings/:id
Authorization: Bearer TOKEN
```

```json
{ "status": "completed" }
```

Allowed statuses: `pending`, `accepted`, `completed`, `cancelled`.

- The **provider** (or admin) can move between any statuses.
- The **customer** can only set status to `cancelled`.

### Delete booking

```http
DELETE /bookings/:id
```

Allowed for the customer, provider, or admin.

---

## Reviews

### List reviews

```http
GET /reviews
```

Query params: `service`, `provider`, `page`, `limit`.

Response includes `averageRating` calculated by MongoDB aggregation.

### Get one review

```http
GET /reviews/:id
```

### Create review

```http
POST /reviews
Authorization: Bearer CUSTOMER_TOKEN
```

```json
{ "service": "SERVICE_ID", "rating": 5, "comment": "Great service" }
```

Rules:
- `rating` must be 1–5.
- The customer must have a **completed** booking for this service.
- One review per (customer, service) pair (enforced by unique index).

### Update / delete review

```http
PUT    /reviews/:id   (review author or admin)
DELETE /reviews/:id   (review author or admin)
```

---

## Categories

### List categories

```http
GET /categories
```

Query params: `search`, `page`, `limit`.

### Create / update / delete category (admin only)

```http
POST   /categories             (admin)
GET    /categories/:id
PUT    /categories/:id         (admin)
DELETE /categories/:id         (admin)
```

```json
{ "name": "Cleaning", "description": "...", "image": "" }
```

---

## Admin

### List users

```http
GET /admin/users
Authorization: Bearer ADMIN_TOKEN
```

Query params: `search`, `role`, `page`, `limit`.

### Get / update / delete user

```http
GET    /admin/users/:id
PUT    /admin/users/:id     # update name, phone, or role
DELETE /admin/users/:id     # cannot delete self
```

PUT body:

```json
{ "role": "provider", "name": "...", "phone": "..." }
```

---

## Upload

### Upload image

```http
POST /upload
Authorization: Bearer TOKEN
```

```json
{ "image": "data:image/png;base64,IMAGE_BASE64" }
```

Restrictions:
- Authenticated users only.
- MIME types allowed: `image/png`, `image/jpeg`, `image/webp`, `image/gif`.
- Maximum size: ~5 MB.

Response:

```json
{
  "message": "Image uploaded successfully",
  "url": "https://res.cloudinary.com/...",
  "publicId": "osta-services/abc123"
}
```

---

## Email

When a booking is created, a confirmation email is sent asynchronously via Nodemailer (Gmail SMTP). Email failures do not block booking creation.

Required environment variables:

```env
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password
```

---

## Environment variables

See [.env.example](./.env.example). Create `.env.local` next to `package.json` with the same keys filled in.
