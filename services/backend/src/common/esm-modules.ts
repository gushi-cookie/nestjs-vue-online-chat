// @ts-expect-error
import nanoidPkg from 'nanoid';
export type nanoidType = typeof nanoidPkg;
let nanoid: nanoidType;
export async function importNanoid(): Promise<nanoidType> {
    if(nanoid) return nanoid;
    nanoid = await import('nanoid');
    return nanoid;
}