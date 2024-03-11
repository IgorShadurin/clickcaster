# Warpcast Frames Traffic Exchange

Warpcast is a social network on Optimism with support for Solana wallets and more than 200k users. 

They launched Frames technology, allowing the creation of applications within the social network. It's almost like an App Store for Web3.

With the traffic exchange platform, Frames developers can exchange users, which will stimulate engagement in Web3 projects.

[Documentation and plans for the gradual transformation of the system from centralized to DAO.](/docs/README.md)

[Visit the site: https://clickcaster.xyz/](https://clickcaster.xyz/)

## Features Overview

### Analytics

- Our platform offers analytics to track user activity within your Frame. It provides insights into the number of unique users and the total actions they perform, presented in daily charts.

- The data is exportable, allowing for further analysis on external platforms.

### Click Exchange

- Frame authors can register their Frames in the system to share click data.

- Our recommendation system suggests which Frames to display to visitors, prioritizing those that have contributed traffic to the network.

- The system ensures that visitors are unique daily, directing only new users to your Frame each day, enhancing user uniqueness.

### Fraud Prevention

- We employ cryptographic techniques to ensure the authenticity of traffic and prevent fraud. Unlike basic HTTP requests, which can be artificially generated, Warpcast traffic is cryptographically signed and user-specific, offering precise and reliable data.

- Each traffic provider uses a unique cryptographic key, enabling us to identify both the traffic initiator and provider. This ensures that every click is verifiable, contributing to high-quality analytics and fraud prevention.

## Start the server

```shell
# install dependencies
npm ci

# copy and fill the env
cp example.env .env

# create DB
mysql -u root -p < ./migrations/db.sql

# start interactive mode for MySQL user creation:
mysql -u root

# and run commands
CREATE USER 'dappy_warpcast'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON dappy_warpcast.* TO 'dappy_warpcast'@'localhost';
FLUSH PRIVILEGES;

# apply migrations
npx knex migrate:latest --env production

# start deployer service via PM2
npx pm2 start npm --name "Warpcast Traffic" -- run start

# OR start the server manually
npm run start
```

## Development

```shell
# create new migration
npx knex migrate:make my_new_migration
```
