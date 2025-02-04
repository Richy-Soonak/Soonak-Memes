# Soonak Memes Backend

This is the backend for the Soonak Memes project. It provides APIs for user authentication, file uploads, and metadata retrieval. The backend is built using Node.js, Express, and MongoDB, and it integrates with Moralis for blockchain interactions.

## Getting Started

First, create a `.env` file and add the following settings:

```bash
# mongoURI=
# MORALIS_API_KEY=
# NEXT_URL=http://localhost:3000/
# AUTH_SECRET=
# APP_DOMAIN=
# DRPC_KEY=
# PRIVATE_KEY=
# ARWEAVE_KEY=
```

Second, run the development server:

```bash
npm run dev
# or
pnpm dev
# or
bun dev
```

## Project Structure

```
.env
.example.env
.gitignore
multer.d.ts
package.json
README.md
src/
    config/
        index.ts
    lib/
        dbConnect.ts
    middleware/
        auth.ts
        requireAdmin.ts
    models/
        distribution.ts
        ICO.ts
        refund.ts
        User.ts
    routes/
        api/
            metadata.ts
            upload.ts
            user.ts
            utils.ts
    server.ts
    utils/
        mpl.ts
tsconfig.json
vercel.json
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm start`

Runs the built app in production mode.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Moralis](https://moralis.io/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Metaplex](https://docs.metaplex.com/)