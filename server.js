import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import route from './routes/routes.js';
import mongoose from 'mongoose';
import session from 'express-session';
import flash from 'connect-flash';
import { setIsLogged } from './middlewares/authMiddlewares.js';

dotenv.config();
const {
  APP_HOSTNAME,
  APP_PORT,
  NODE_ENV,
  MONGO_URI,
  SESSION_NAME,
  SESSION_SECRET,
} = process.env;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ==========
// App initialization
// ==========

const init = async () => {
  const app = express();

  app.set('view engine', 'pug');
  app.locals.pretty = NODE_ENV !== 'production'; // Indente correctement le HTML envoyé au client (utile en dev, mais inutile en production)

  // ==========
  // App middlewares
  // ==========

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      name: SESSION_NAME,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  // middleware to display success/warning/error... flash messages
  app.use(flash());

  // middleware to set isLogged value in locals variable, to access this data from views (e.g. in pug files)
  app.use(setIsLogged);

  // ==========
  // App routers
  // ==========

  app.use('/', route);

  // ==========
  // App start
  // ==========

  app.listen(APP_PORT, () => {
    console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`);
  });
};

// Connexion à la base de données
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connexion à la DBB établie'))
  .then(init)
  .catch((err) => console.log(err));
