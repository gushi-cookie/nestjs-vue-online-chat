// @ts-expect-error
import nanoidPkg from 'nanoid';
// @ts-expect-error
import changeCasePkg from 'change-case';


export const modules = {
    nanoid: {} as typeof nanoidPkg,
    changeCase: {} as typeof changeCasePkg,
};

export async function importESMModules() {
    modules.nanoid = await import('nanoid');
    modules.changeCase = await import('change-case');
}