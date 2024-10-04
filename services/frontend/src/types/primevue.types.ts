import type { PrimitiveDesignTokens, PaletteDesignToken } from '@primevue/themes/types';

/**
 * Expected this type in '@primevue/themes/types'.
 */
export interface SurfacePaletteDesignToken extends PaletteDesignToken {
    0?: string;
}

/**
 * Adapted/fixed type from '@primevue/themes/types'.
 */
export interface SemanticDesignTokens {
    transitionDuration?: string;
    focusRing?: {
        width?: string;
        style?: string;
        color?: string;
        offset?: string;
        shadow?: string;
    };
    iconSize?: string;
    anchorGutter?: string;
    primary?: PaletteDesignToken;
    formField?: {
        paddingX?: string;
        paddingY?: string;
        borderRadius?: string;
        focusRing?: {
            width?: string;
            style?: string;
            color?: string;
            offset?: string;
            shadow?: string;
        };
        transitionDuration: string;
    };
    // TO-DO
    [key: string]: any;
}


/**
 * Expected this type in '@primevue/themes/types'.
 */
export interface Color {
    name: string;
}

/**
 * Expected this type in '@primevue/themes/types'.
 */
export interface PrimaryColor extends Color {
    palette: PaletteDesignToken;
}

/**
 * Expected this type in '@primevue/themes/types'.
 */
export interface SurfaceColor extends Color {
    palette: SurfacePaletteDesignToken;
}



/**
 * Expected this type in '@primevue/themes/types'.
 */
export interface Preset {
    primitive?: PrimitiveDesignTokens;
    semantic?: SemanticDesignTokens;
}