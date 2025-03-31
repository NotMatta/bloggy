# Bloggy

Bloggy is a portfolio project showcasing a blog website built with Next.js, featuring user account creation, blog post creation using Markdown, and efficient client-side caching with React Query.

## Table of Contents

-   [About](#about)
-   [Key Features](#key-features)
-   [Technologies Used](#technologies-used)
-   [Installation/Setup](#installation-setup)
-   [Configuration](#configuration)
-   [Demo Account](#demo-account)
-   [Account Creation Limitations](#account-creation-limitations)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)

## About

Bloggy is a personal portfolio project designed to demonstrate proficiency in modern web development technologies, particularly Next.js, Prisma, and React Query. It allows users to view blog posts, create accounts, and publish their own content using Markdown. The project focuses on efficient client-side caching for improved performance.

## Key Features

-   **User Authentication:** Account creation and login via GitHub and Google OAuth.
-   **Markdown Blog Editor:** Rich text editing and preview using Markdown.
-   **Client-Side Caching:** Efficient data caching using React Query to minimize server requests and improve performance.
-   **Refresh Functionality:** A refresh button appears after a set time to allow users to fetch fresh data.
-   **Database:** MongoDB for storing blog posts and user data.
-   **Styling:** Tailwind CSS and Shadcn UI for a modern and responsive design.

## Technologies Used

-   **Next.js:** React framework for server-side rendering and routing.
-   **JavaScript:** Core programming language.
-   **Prisma:** ORM for database interactions.
-   **MongoDB:** NoSQL database.
-   **Tailwind CSS:** Utility-first CSS framework.
-   **Shadcn UI:** Re-usable components built with Radix UI and Tailwind CSS.
-   **React Query:** Data fetching and caching library.
-   **Better-Auth:** Authentication library.

## Installation Setup

1.  Clone the repository:

    ```bash
    git clone https://github.com/NotMatta/bloggy
    cd bloggy
    ```

2.  Install dependencies:

    ```bash
    pnpm install
    ```

3.  Set up your environment variables (see Configuration section).
4.  Run Prisma migrations:

    ```bash
    pnpm dlx prisma migrate dev
    ```

5.  Start the development server:

    ```bash
    pnpm dev
    ```

6.  Open your browser and navigate to `http://localhost:3000`.

## Configuration

You need to set the following environment variables in a `.env.local` file:

```
DATABASE_URL="your-mongodb-connection-string"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BETTER_AUTH_SECRET="your-better-auth-secret"
BASE_URL="http://localhost:3000 or your-production-url"
```

## Demo Account

[Provide demo account login details here. Example: Email: demo@example.com, Password: demopassword] (Will be added later)

## Account Creation Limitations

To prevent spam and fake email accounts, only GitHub and Google OAuth authentication are enabled. Email account creation is disabled.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Contact

[NotMatta](https://github.com/NotMatta)
[Email](mailto:mat.ryn667@proton.me)

