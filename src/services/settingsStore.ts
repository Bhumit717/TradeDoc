import type { CompanyProfile } from '../types';
import { emptyCompany } from '../utils/mockData';

const SETTINGS_KEY = 'doc_gen_app_settings';

export const getSavedCompanyProfile = (): CompanyProfile => {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error("Failed to load settings", e);
    }
    return emptyCompany;
};

export const saveCompanyProfile = (profile: CompanyProfile): void => {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(profile));
        // Dispatch a custom event so other components (like DocumentEditor) can react if needed, 
        // though usually they will just read fresh on new doc creation.
        window.dispatchEvent(new Event('settings-updated'));
    } catch (e) {
        console.error("Failed to save settings", e);
    }
};
