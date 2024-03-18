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

## Integration

1. Create a key on the website. Click "Add Key", "Create Key". Copy the ID and PK to yourself. Click "Save".
2. Insert the following script into your Warpcast request handling method.

Install ethers or a similar library.

```shell
npm i ethers
```

For node <18

```shell
npm i node-fetch
```

```typescript
import { Wallet } from 'ethers'
import node from 'node-fetch' // for node <18

async function clickLog(signer: Wallet, clickData: string): Promise<unknown> {
  const signature = await signer.signMessage(clickData)

  return (
    await fetch('https://api.clickcaster.xyz/v1/click/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clickData, signature }),
    })
  ).json()
}

// your PK from the dashboard
const signer = new Wallet('PK_STRING')
// raw click data in the form of hex (req.body.trustedData.messageBytes)
const clickData = 'RAW_CLICK_DATA_IN_FORM_OF_HEX'
clickLog(signer, clickData).then(console.log).catch(console.log)
```

3. Register your application's unique URL on the website. Click "Add Frame". Copy the unique tag for your account. Insert it on the main page of your Frame, accessible via a GET request. Fill in the fields and click "Save".

## Development

### Start the server

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

### Create migration

```shell
# create new migration
npx knex migrate:make my_new_migration
```
