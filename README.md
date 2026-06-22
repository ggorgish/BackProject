# Task Manager API

REST API ამოცანების (task) მართვისთვის — დამზადებულია **Node.js**, **Express**-ისა და **MongoDB**-ის (Mongoose) გამოყენებით.

## პროექტის აღწერა

აპლიკაცია იძლევა საშუალებას მომხმარებელმა დარეგისტრირდეს, შევიდეს სისტემაში (JWT ავტორიზაციით) და მართოს საკუთარი დავალებები (Task) — შექმნას, ნახოს, განაახლოს, წაშალოს, გაფილტროს სტატუსისა და პრიორიტეტის მიხედვით, მოიძიოს სათაურით და ნახოს აგრეგირებული სტატისტიკა. თითოეული Task მიბმულია კონკრეტულ მომხმარებელზე და სხვის დავალებებზე წვდომა შეზღუდულია.

## გამოყენებული ტექნოლოგიები

- **Node.js** + **Express** — სერვერი და routing
- **MongoDB** + **Mongoose** — ბაზა და ODM (schema, validation)
- **JWT (jsonwebtoken)** — ავტორიზაცია
- **bcryptjs** — პაროლების ჰეშირება
- **express-validator** — input validation
- **helmet, cors, express-rate-limit** — უსაფრთხოება
- **morgan** — request logging

## ფუნქციონალი

- მომხმარებლის რეგისტრაცია და login (JWT token)
- დაცული route-ები (მხოლოდ ავტორიზებული მომხმარებლისთვის)
- Task-ების CRUD (Create, Read, Update, Delete)
- ფილტრაცია (`status`, `priority`), ძებნა (`search`), სორტირება (`sort`) და გვერდადობა (`page`, `limit`)
- სტატისტიკის endpoint MongoDB-ის aggregation pipeline-ით (დავალებების რაოდენობა სტატუსების მიხედვით)
- ცენტრალიზებული error handling
- MVC არქიტექტურა (models / controllers / routes / middleware)

## API Endpoints

### Auth (`/api/auth`)

| მეთოდი | Endpoint | აღწერა | წვდომა |
|---|---|---|---|
| POST | `/api/auth/register` | რეგისტრაცია (`name`, `email`, `password`) | Public |
| POST | `/api/auth/login` | შესვლა (`email`, `password`) → აბრუნებს JWT token-ს | Public |
| GET | `/api/auth/me` | შესული მომხმარებლის პროფილი | Private |

### Tasks (`/api/tasks`) — ყველა route საჭიროებს `Authorization: Bearer <token>` header-ს

| მეთოდი | Endpoint | აღწერა |
|---|---|---|
| GET | `/api/tasks` | ყველა task (query: `status`, `priority`, `search`, `sort`, `page`, `limit`) |
| GET | `/api/tasks/stats` | სტატისტიკა status-ის მიხედვით |
| GET | `/api/tasks/:id` | ერთი task |
| POST | `/api/tasks` | ახალი task-ის შექმნა (`title`, `description`, `status`, `priority`, `dueDate`) |
| PUT | `/api/tasks/:id` | task-ის განახლება |
| DELETE | `/api/tasks/:id` | task-ის წაშლა |


## ავტორები

- Giorgi Gorgisheli
- Luka gogoberishvili
