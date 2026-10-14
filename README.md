
# Food Ordering DevOps Mini Project

A simple food ordering web application deployed on AWS EC2 using
GitHub and Docker.

## Features

- Food menu: Pizza, Burger, Biryani and Sandwich
- Select food quantity
- Place an order and receive an order ID
- Server-side price calculation
- Health-check endpoint
- Docker container deployment

## Tech Stack

- Node.js
- HTML, CSS and JavaScript
- Git and GitHub
- Docker
- AWS EC2 (Amazon Linux 2023)

## Project Structure

    food-ordering-devops/
    ├── server.js
    ├── Dockerfile
    ├── .dockerignore
    ├── README.md
    └── public/
        └── index.html

## Run Locally

Requires Node.js 22 or a compatible version.

    node server.js

Open http://localhost:3000

## Build Docker Image

    docker build -t food-ordering:1.0 .

## Run Container

    docker run -d --name food-ordering \
      -p 3000:3000 food-ordering:1.0

Open http://localhost:3000

## Health Check

    curl http://localhost:3000/health

Expected response:

    {"status":"ok"}

## Deploy on AWS EC2

Install Git and Docker, clone this repository, build the image,
and run the container with port 80 mapped to port 3000.

    docker build -t food-ordering:1.0 .
    docker run -d --name food-ordering \
      --restart unless-stopped \
      -p 80:3000 food-ordering:1.0

Open http://YOUR_EC2_PUBLIC_IP

## Important Limitations

- Orders are stored in memory only.
- Orders are lost when the application restarts.
- This demo does not process payments.
- Use HTTPS, persistent storage, authentication and
  additional security controls before production use.

## Learning Outcomes

- Git version control
- GitHub repository workflow
- Docker image and container management
- EC2 deployment
- Application and container troubleshooting
