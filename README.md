# debtrade
First Prototype for a Claims Trading Platform. 
Ironhack Web Development Bootcamp Module II Project.
Deployed version can be found [here]("https://ironhack-project-two-ctp.herokuapp.com/")

## Local Setup 
To run this app locally, after cloning the repo you'll need to do the following setup steps.

1. In your terminal, run 
``` npm install ```

2. (Recommended) In order to populate your local Database with some sample data, run 
``` node seed/populateDatabase.js ```

3. (Optional) If you wish to set your port (the default is `3000`) or session secret explicitly, create a local `.env` file at the root of this project, the contents of which should look something like this. 
```
PORT=3001
SESSION_SECRET="my super sekret key"
```

To start with nodemon or node, run `npm run dev` or `npm run start` respectively.

## Deployment


