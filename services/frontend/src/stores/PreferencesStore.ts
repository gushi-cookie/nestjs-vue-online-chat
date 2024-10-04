import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { type PresetType } from '../utils/primevue-presets.util';



// ##################
// #  LocalStorage  #
// ##################
interface Preferences {
    primaryColor: string;
    surfaceColor: string;
    preset: PresetType;
    ripple: boolean;
    darkMode: boolean;
};

export let preferences: Preferences;

function establishPreferences() {
    let item = localStorage.getItem('preferences');
    if(item === null) {
        preferences = {
            primaryColor: 'noir',
            surfaceColor: 'slate',
            preset: 'Aura',
            ripple: false,
            darkMode: false,
        };
    } else {
        preferences = JSON.parse(item);
    }
};

function savePreferences() {
    localStorage.setItem('preferences', JSON.stringify(preferences));
};



// ###########
// #  Store  #
// ###########
establishPreferences();

export const usePreferencesStore = defineStore('preferences', () => {
    const primaryColor = ref<string>(preferences.primaryColor);
    watch(primaryColor, (newVal) => {
        preferences.primaryColor = newVal;
    });

    const surfaceColor = ref<string>(preferences.surfaceColor);
    watch(surfaceColor, (newVal) => {
        preferences.surfaceColor = newVal;
    });

    const preset = ref<PresetType>(preferences.preset);
    watch(preset, (newVal) => {
        preferences.preset = newVal;
    });

    const ripple = ref<boolean>(preferences.ripple);
    watch(ripple, (newVal) => {
        preferences.ripple = newVal;
    });

    const darkMode = ref<boolean>(preferences.darkMode);
    watch(darkMode, (newVal) => {
        preferences.darkMode = newVal;
    });

    watch([primaryColor, surfaceColor, preset, ripple, darkMode], () => savePreferences());

    return {
        primaryColor,
        surfaceColor,
        preset,
        ripple,
        darkMode
    };
});