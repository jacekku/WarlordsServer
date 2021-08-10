import { Request, Response } from "express"
import * as jsonConfig from '../env-config.json'
export function accessChecker (req: Request, res: Response, next: Function) {
    const accessKey: string = jsonConfig.ACCESS_KEY || process.env.ACCESS_KEY;
    if(req.headers.access_key !== accessKey) {
        res.sendStatus(403)
        return
    }
    next()
}