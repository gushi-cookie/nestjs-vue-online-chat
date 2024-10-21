namespace enums {
    export function extractNumberValues(set: object): number[] {
        let result: number[] = [];
    
        for(let val of Object.values(set)) {
            if(typeof val === 'number') result.push(val);
        }
    
        return result;
    }
}

export default {
    enums,
}