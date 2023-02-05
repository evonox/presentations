import { getAppDataSource } from "./data-source";
import { InvalidArgument, ResourceNotFound } from "./exceptions";
import { Request, Response } from "express";
import { Container } from "typedi";
import multer  from 'multer';
import os from "os";
import { getLogger } from "./logger";
const fileUpload = multer({ dest: os.tmpdir() });

const logger = getLogger();

// TODO: Central Configuration SOMEHOW - STUDY THE LIB INTEGRATED
const isDebugMode = process.env.DEBUG_MODE === "true"

export interface FileUploadProps {
    enabled: boolean;
    parameterName: string;
}

// TODO: REWORK AND CLEANUP

export function Transactional(targetObject: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
        const datasource = getAppDataSource();
        const result = { value: null };
        await datasource.transaction(async entityManager => {
            result.value = await originalMethod.apply(this, args)
        });
        return result.value;
    }
}

const CONTROLLER_ACTIONS = Symbol("CONTROLLER_ACTIONS");

function wrapActionMethod(actionMethod: any) {
    return async function(req: Request, res: Response) {
        try 
        {
            return await actionMethod(req, res);
        }
        catch(e) 
        {
            if(e instanceof ResourceNotFound) {
                res.status(404).send("Not Found").end();
            } else if(e instanceof InvalidArgument) {
                res.status(400).send("Bad Request").end();
            } else {
                const error = e as Error;
                let statusMessage = "Server Error";                
                let loggerMessage = `Message: ${error?.message}\nStacktrace: ${error?.stack}`;
                logger.error(loggerMessage);
                if(isDebugMode) {
                    statusMessage = loggerMessage;
                }
                res.status(500).send(statusMessage).end();
            }
        }
    }
}

export function useController(app: any, TargetClass: any) { 
    const controller =  Container.get(TargetClass);

    const getMethods = Reflect.getMetadata(CONTROLLER_ACTIONS, controller);
    for(const record of getMethods) {
        const actionMethod = wrapActionMethod(record.fn.bind(controller));
        switch(record.method) {
            case "GET": app.get(record.pathname, actionMethod); break;
            case "POST":
                if(record.fileUploadOptions?.enabled === true) {
                    const parameterName = record.fileUploadOptions.parameterName;
                    app.post(record.pathname, fileUpload.single(parameterName) , actionMethod); 
                } else {
                    app.post(record.pathname, actionMethod); 
                }
                break;
            case "PUT": app.put(record.pathname, actionMethod); break;
            case "PATCH": app.patch(record.pathname, actionMethod); break;
            case "DELETE": app.delete(record.pathname, actionMethod); break;
        }
    }
}

function registerControllerAction(targetObject: any, record: any) {
    let value = Reflect.getMetadata(CONTROLLER_ACTIONS, targetObject);
    if(value === undefined) {
        value = [record]
    } else {
        value.push(record);
    }
    Reflect.defineMetadata(CONTROLLER_ACTIONS, value, targetObject);
}

export function Get(pathname: string) {    
    return function(targetObject: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const record = {method: "GET", pathname, fn: descriptor.value};
        registerControllerAction(targetObject, record);
    }
}

export function Post(pathname: string, fileUploadOptions?: FileUploadProps) {    
    return function(targetObject: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const record = {method: "POST", pathname, fn: descriptor.value, fileUploadOptions: fileUploadOptions};
        registerControllerAction(targetObject, record);
    }
}

export function Put(pathname: string) {    
    return function(targetObject: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const record = {method: "PUT", pathname, fn: descriptor.value};
        registerControllerAction(targetObject, record);
    }
}

export function Patch(pathname: string) {    
    return function(targetObject: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const record = {method: "PATCH", pathname, fn: descriptor.value};
        registerControllerAction(targetObject, record);
    }
}

export function Delete(pathname: string) {    
    return function(targetObject: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const record = {method: "DELETE", pathname, fn: descriptor.value};
        registerControllerAction(targetObject, record);
    }
}
