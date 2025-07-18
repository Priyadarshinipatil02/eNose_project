import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function AlphanumericValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;
        if (!value) {
            return null;
        }

        const hasLatter = /[^\w]+/.test(value);
        return hasLatter ? {alphanumeric:true}: null;
    }
}