import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import "primeicons/primeicons.css";
import './style.css';
import PrimeVue, { PrimeVueConfiguration } from 'primevue/config';
import Button from 'primevue/button';
import StyleClass from 'primevue/styleclass';
import { presets } from './utils/primevue-presets.util';
import { preferences } from './stores/PreferencesStore';


const primevueConfig: PrimeVueConfiguration = {
    theme: {
        preset: presets[preferences.preset],
        options: {
            prefix: 'p',
            darkModeSelector: '.p-dark',
            cssLayer: false,
        },
    },
    ripple: preferences.ripple,
};

const pinia = createPinia();
const app = createApp(App);

app.directive('styleclass', StyleClass);

app.use(pinia);
app.use(PrimeVue, primevueConfig);

app.component('Button', Button);

app.mount('#app');