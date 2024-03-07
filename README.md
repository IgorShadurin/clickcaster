# Warpcast Frames Traffic Exchange

Warpcast is a social network on Optimism with support for Solana wallets and more than 200k users. 

They launched Frames technology, allowing the creation of applications within the social network. It's almost like an App Store for Web3. At the moment, entertainment applications are in huge demand.

With our traffic exchange platform, Frames developers can exchange users, which will stimulate engagement in Web3 projects.

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
