/* eslint-disable no-console */
import express from 'express';
import labRoutes from './server/labRoutes.js';
import apiRoutes from './server/routes/apiRoutes.js';
import reload from 'livereload';
import connectReload from 'connect-livereload';
import dotenv from 'dotenv';
import path from 'path';

<<
<< << < HEAD
import db from './server/database/initializeDB.js'; ===
=== =
dotenv.config();
const __dirname = path.resolve();
// import db from './server/database/initializeDB.js';
>>>
>>> > 17514e1 bb9519f84c7a2fb0ab664c5b893830434

const app = express();
const PORT = process.env.PORT || 3000;
const staticFolder = 'client';
let liveReloadServer;

// Add some auto-reloading to our server
if (process.env.CONTEXT === 'development') { <<
    << << < HEAD
    const liveReloadServer = reload.createServer();
    liveReloadServer.watch(path.join(__dirname, staticFolder)); ===
    === =
    liveReloadServer = reload.createServer();
    liveReloadServer.watch(path.join(__dirname, staticFolder)); >>>
    >>> > 17514e1 bb9519f84c7a2fb0ab664c5b893830434
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(staticFolder)); <<
<< << < HEAD
app.use('/api', apiRoutes);

async function bootServer() {
    try {
        // Turn these back on in later labs
        const mysql = await db.sequelizeDB;
        await mysql.sync();
        app.listen(PORT, () => {
            console.log(`Listening on: http//localhost:${PORT}`);
        });
    } catch (err) {
        console.error(err);
    } ===
    === =
    // app.use('/template', labRoutes);
    app.use('/api', apiRoutes);

    async function bootServer() {
        try {
            app.listen(PORT, () => {
                // Turn these back on in later labs
                // const mysql = await db.sequelizeDB;
                // await mysql.sync();
                console.log(`Listening on: http//localhost:${PORT}`);
                console.log(`environment:`, process.env.CONTEXT);
            });
        } catch (err) {
            console.error(err);
        } >>>
        >>> > 17514e1 bb9519f84c7a2fb0ab664c5b893830434
    }

    bootServer();
    if (process.env.CONTEXT === 'development') {
        liveReloadServer.server.once('connection', () => {
            setTimeout(() => {
                liveReloadServer.refresh('/');
            }, 100);
        });
    }