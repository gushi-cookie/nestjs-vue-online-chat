<script setup lang="ts">
import { $t, updatePreset, updateSurfacePalette } from '@primevue/themes';
import type { Preset, PrimaryColor, SurfaceColor } from '../types/primevue.types';
import { usePreferencesStore } from '../stores/PreferencesStore';
import ToggleSwitch from 'primevue/toggleswitch';
import SelectButton from 'primevue/selectbutton';
import { presets, patches, colors, type PresetType } from '../utils/primevue-presets.util';
import { usePrimeVue } from 'primevue/config';
import { onMounted, onUnmounted } from 'vue';


const PrimeVue = usePrimeVue();
const preferencesStore = usePreferencesStore();



// ###########
// #  Hooks  #
// ###########
function onPageLoad() {
    updatePreset(getPatches());

    let surfaceColor = colors.getSurfaceColor(preferencesStore.surfaceColor);
    if(surfaceColor) {
        updateSurfacePalette(surfaceColor.palette);
    } else {
        // TO-DO
    }
}


onMounted(() => {
    if(preferencesStore.darkMode) document.documentElement.classList.add('p-dark');
    window.addEventListener('load', onPageLoad);
});


onUnmounted(() => {
    window.removeEventListener('load', onPageLoad);
});



// ############
// #  Events  #
// ############
function onDarkModeToggle() {
    let darkMode = document.documentElement.classList.toggle('p-dark');
    preferencesStore.darkMode = darkMode;
}

function onRippleToggle(value: boolean) {
    preferencesStore.ripple = value;
    PrimeVue.config.ripple = value;
}

function onPresetSwitch(presetType: PresetType) {
    preferencesStore.preset = presetType;
    const preset = presets[presetType];

    const surfacePalette = colors.getSurfaceColor(preferencesStore.surfaceColor)?.palette;

    $t()
        .preset(preset)
        .preset(getPatches())
        .surfacePalette(surfacePalette)
        .use({ useDefaultOptions: true });
}



// ##########
// #  Misc  #
// ##########
/**
 * Get preset patches according to the current primary color.
 */
function getPatches(): Preset {
    let color = colors.getPrimaryColor(preferencesStore.primaryColor);

    if(!color) {
        // TO-DO
        return {};
    }

    // This logic is extended from the PrimeVue examples base (Button).
    if (color.name === 'noir') {
        return patches.primaryColor.createNoirPatch();
    } else if (preferencesStore.preset === 'Nora') {
        return patches.preset.createNoraPatch(color.palette);
    } else {
        return patches.primaryColor.createDefaultPatch(color.palette);
    }
}

function updatePrimaryColor(color: PrimaryColor) {
    preferencesStore.primaryColor = color.name;
    updatePreset(getPatches());
}

function updateSurfaceColor(color: SurfaceColor) {
    preferencesStore.surfaceColor = color.name;
    updateSurfacePalette(color.palette);
}
</script>


<template>
    <div class="card flex justify-end p-2 mb-4">
        <ul class="flex list-none m-0 p-0 gap-2 items-center">
            <li>
                <button type="button"
                    class="inline-flex w-8 h-8 p-0 items-center justify-center surface-0 dark:surface-800 border border-surface-200 primary-hover dark:border-surface-600 rounded"
                    @click="onDarkModeToggle">
                    <i class="dark:text-white pi" :class="[preferencesStore.darkMode ? 'pi-moon' : 'pi-sun']" />
                </button>
            </li>
            <li class="relative">
                <button 
                    v-styleclass="{
                        selector: '@next',
                        enterFromClass: 'hidden',
                        enterActiveClass: 'animate-scalein',
                        leaveToClass: 'hidden',
                        leaveActiveClass: 'animate-fadeout',
                        hideOnOutsideClick: true,
                    }"
                    type="button"
                    class="inline-flex w-8 h-8 p-0 items-center justify-center border border-surface-200 primary-hover primary-hover-palette dark:border-surface-600 rounded">
                    <i class="pi pi-palette"></i>
                </button>
                <div class="absolute top-[2.5rem] right-0 hidden w-[16rem] p-3 bg-white dark:bg-surface-800 rounded-md shadow border border-surface-200 dark:border-surface-700 flex-col justify-start items-start gap-3.5 inline-flex origin-top z-10">
                    <div class="flex-col justify-start items-start gap-2 inline-flex pr-4">
                        <span class="text-sm font-medium">Primary Colors</span>
                        <div class="self-stretch justify-start items-start gap-2 inline-flex flex-wrap">
                            <button v-for="primaryColor of colors.primaryColors" :key="primaryColor.name" type="button"
                                :title="primaryColor.name" @click="updatePrimaryColor(primaryColor)"
                                class="outline outline-2 outline-offset-1 outline-transparent cursor-pointer p-0 rounded-[50%] w-5 h-5"
                                :style="{
                                    backgroundColor: `${primaryColor.name === 'noir' ? 'var(--text-color)' : primaryColor.palette['500']}`,
                                    outlineColor: `${preferencesStore.primaryColor === primaryColor.name ? 'var(--p-primary-color)' : ''}`,
                                }"
                            ></button>
                        </div>
                    </div>
                    <div class="flex-col justify-start items-start gap-2 inline-flex pr-2">
                        <span class="text-sm font-medium">Surface Colors</span>
                        <div class="self-stretch justify-start items-start gap-2 inline-flex">
                            <button v-for="surface of colors.surfaceColors" :key="surface.name" type="button" :title="surface.name"
                                @click="updateSurfaceColor(surface)"
                                class="outline outline-2 outline-offset-1 outline-transparent cursor-pointer p-0 rounded-[50%] w-5 h-5"
                                :style="{
                                    backgroundColor: `${surface.palette['500']}`,
                                    outlineColor: `${preferencesStore.surfaceColor === surface.name ? 'var(--p-primary-color)' : ''}`,
                                }"
                            ></button>
                        </div>
                    </div>
                    <div class="flex-col justify-start items-start gap-2 inline-flex w-full">
                        <span class="text-sm font-medium">Preset</span>
                        <div class="inline-flex p-[0.28rem] items-start gap-[0.28rem] rounded-[0.71rem] border border-[#00000003] w-full">
                            <SelectButton
                                v-model="preferencesStore.preset"
                                @update:modelValue="onPresetSwitch"
                                :options="Object.keys(presets)"
                                :allow-empty="false"
                            />
                        </div>
                    </div>
                    <div class="inline-flex flex-col justify-start items-start gap-2 w-full pt-4 pb-2">
                        <span class="text-sm font-medium m-0">Ripple Effect</span>
                        <ToggleSwitch :modelValue="preferencesStore.ripple" @update:modelValue="onRippleToggle" />
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>