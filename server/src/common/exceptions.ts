
export class ResourceNotFound extends Error {}

export class InvalidArgument extends Error {}

export class FileUploadException extends Error {}

export function checkResource<T>(resource: T): T {
    if(resource === undefined || resource === null)
        throw new ResourceNotFound();
    return resource;
}

export function getNumber(value: any): number {
    if(typeof value === "number")
        return value;
    if(typeof value !== "string")
        throw new InvalidArgument();
    const numericValue = parseInt(value);
    if(isNaN(numericValue))
        throw new InvalidArgument();
    return numericValue;
}

export function getString(value: any): string {
    if(typeof value !== "string")
        throw new InvalidArgument();
    return value.trim();
}

export function getBoolean(value: any): boolean {
    if(typeof value !== "boolean")
        throw new InvalidArgument();
    return value;
}