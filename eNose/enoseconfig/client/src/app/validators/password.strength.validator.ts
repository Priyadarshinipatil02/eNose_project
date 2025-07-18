import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;
        if (!value) {
            return null;
        }

        const hasLatter = /[A-Za-z]+/.test(value);
        const hasNumeric = /[0-9]+/.test(value);
        const hasSymbol = /[^\w]/.test(value);
        const passwordValid = hasLatter && hasNumeric && hasSymbol;
        return !passwordValid ? {passwordStrength:true}: null;
    }
}