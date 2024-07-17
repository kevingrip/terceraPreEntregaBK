import * as url from 'url';
import { Command } from 'commander';
import dotenv from 'dotenv';

const commandLine = new Command();

commandLine
    .option('--mode <mode>')
    .option('--port <port>')

commandLine.parse();

const clOptions = commandLine.opts();

dotenv.config();

console.log(process.env.SECRET)

const config = {
    SERVER: 'atlas',
    PORT: process.env.PORT || clOptions.port || 8080,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img`},
    // mongoDB_Local: 'mongodb://127.0.0.1:27017/practica',
    mongoDB_Atlas: process.env.mongoDB_Atlas,
    SECRET: process.env.SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL
};

export default config;