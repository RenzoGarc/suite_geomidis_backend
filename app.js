import express from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import "dotenv/config";

import { createUbicacionPredioRouter } from "./routes/fichas/individual/ubicacionPredio.js";
import { createServicioPredioRouter } from "./routes/fichas/individual/servicioPredio.js";

import { setupServiciosGeoserverRouter } from "./setup/routeServiciosGeoserverSetup.js";
import { setupMaestroRoutes } from "./setup/routeMaestroSetup.js";
import { setupMapfishRoutes } from "./setup/routerImpresionMapfish.js";
import { setupPruebasRoutes } from "./setup/routePruebasSetup.js";
import { setupEspacialesRoutes } from "./setup/routeEspacialesSetup.js";
import { setupAuditoriaRoutes } from "./setup/routeAuditoriaSetup.js";
import { createObservacionPredioRouter } from "./routes/fichas/individual/observacionPredio.js";
import { createEvaluacionPredioRouter } from "./routes/fichas/individual/evaluacionPredio.js";
import { createUnicatRouter } from "./routes/fichas/unicat.js";
import { createAuthenticateRouter } from "./routes/security/authenticate.js";
import { createManagerRouter } from "./routes/suite/manager.js";
import cron from 'node-cron';
import { callServicesDaily, callServicesAnual } from './controllers/automatizacion/automatizacion.js';

import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { setupGlgisRoutes } from "./setup/routeGlgisSetup.js";
import { setupEtlRoutes } from "./setup/routeEtlSetup.js";
import { setupRasterRoutes } from "./setup/routeRasterSetup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(corsMiddleware());
app.use(express.static(path.join(__dirname, "")));

app.disable("x-powered-by");

// Configurar el cronjob para que se ejecute diariamente a las 00:00 horas
cron.schedule('1 0 * * *', () => {
  console.log('Ejecutando llamadas diarias a los servicios...');
  callServicesDaily(); // Llama a la función para realizar las llamadas diarias a los servicios
});

// Programa la tarea cron para que se ejecute todos los 1 de enero de cada año
cron.schedule('0 0 1 1 * *', () => {
  console.log('Ejecutando tarea cron el 1 de enero.');
  callServicesAnual();
  // Aquí puedes llamar a la función o realizar cualquier tarea que necesites ejecutar
});
setupServiciosGeoserverRouter(app);
setupPruebasRoutes(app);
setupMaestroRoutes(app);
setupEspacialesRoutes(app);
setupGlgisRoutes(app);
setupMapfishRoutes(app);
setupAuditoriaRoutes(app);
setupEtlRoutes(app);
setupRasterRoutes(app);

app.use("/fcuin/ubicacion_predio", createUbicacionPredioRouter());
app.use("/tibc/servicio_predio", createServicioPredioRouter());
app.use("/tibc/observacion_predio", createObservacionPredioRouter());
app.use("/tibc/evaluacion_predio", createEvaluacionPredioRouter());
app.use("/unicat", createUnicatRouter());
app.use("/security", createAuthenticateRouter());
//SUITE
app.use("/suite", createManagerRouter());

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
