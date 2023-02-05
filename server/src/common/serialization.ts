import { ObjectMapper  } from "jackson-js";

export function serialize(data: any): string {
    const mapper = new ObjectMapper();
    return mapper.stringify(data);
}