import express, { Router } from 'express';
import path from 'path';

interface Options {
    port: number;
    routes: Router;
    publicPath?: string;
}

export class Server{

    private app = express();
    private readonly port: number;
    private readonly routes: Router;
    private readonly publicPath: string;

    constructor(private options: Options) {
        const { port, routes, publicPath = 'public'} = options;
        this.port = port;
        this.routes = routes;
        this.publicPath = publicPath;
    }

    async start() {

        //* Middleware
        this.app.use(express.json());//raw json
        this.app.use(express.urlencoded({ extended: true })); //x-www-form-urlencoded

        //* Public folder
        this.app.use(express.static(this.publicPath));

        //* Routes
        this.app.use(this.routes);
       
        //* SPA
        this.app.get('*', (req, res) => {
            const indexPath = path.join(__dirname, `../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
            return;
        });

        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}