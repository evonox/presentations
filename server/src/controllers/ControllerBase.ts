import { Request, Response } from "express";
import { getString } from "../common/exceptions";
var stream = require('stream');

export abstract class ControllerBase {

    protected sendOK(res: Response) {
        res.status(200).send("OK").end();
    }

    protected sendContent(res: Response, content: string) {
        res.status(200).send(content).end();
    }

    protected getUploadedFilePath(req: Request) {
        const tmpFilename = (req as any)?.file?.path;
        return getString(tmpFilename);
    }

    protected invokeBufferDownload(res: Response, buffer: Buffer) {
        var readStream = new stream.PassThrough();
        readStream.end(buffer);
      
        res.set('Content-disposition', 'attachment; filename=');
        res.set('Content-Type', 'application/octet-stream');        

        readStream.pipe(res);
    }
}
