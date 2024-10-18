export function parseBoolean(value: any): boolean | undefined {
    if(typeof value === 'string') {
        let str = value.toLowerCase();
        if(str === 'true') {
            return true;
        } else if(str === 'false') {
            return false;
        } else {
            return undefined;
        }
    } else if(typeof value === 'boolean') {
        return value;
    } else {
        return undefined;
    }
}