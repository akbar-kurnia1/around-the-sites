# AroundTheSites

AroundTheSites is a curated directory platform for discovering unique, interesting, and useful websites across the internet. Explore a hand-picked collection of digital experiences, ranging from educational tools to fascinating interactive simulations.

## Features

- **Curated Collection**: Browse through diverse categories like Space, Physics, Simulation, Nature, Audio, Education, and AI.
- **Search & Sort**: Easily find specific websites using the real-time search function or sort them by Top (Best), Newest, or Alphabetically.
- **User Authentication**: Secure sign up and log in system.
- **Voting System**: Upvote your favorite websites to help them reach the top of the collection.
- **Submit Sites**: Found a cool website? Registered users can submit new sites to share with the community.
- **Modern UI**: Designed with a sleek, premium, and responsive interface featuring a neo-brutalist aesthetic.

## Tech Stack

- **Frontend**: React, Vite, React Router
- **Backend & Database**: Supabase (Authentication & PostgreSQL)
- **Styling**: Vanilla CSS / Tailwind CSS 

## Getting Started

### Prerequisites

- Node.js (version 16 or higher recommended)
- A Supabase project for backend services

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akbar-kurnia1/around-the-sites.git
   cd around-the-sites
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## License

This project is open-source and available under the [MIT License](LICENSE).
