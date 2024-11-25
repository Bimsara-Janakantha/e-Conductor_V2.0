export function validateName (text: string, setName: Function, setError: Function) {
    setName(text);
    const regex = /^[a-z .]+$/i;
    if (text === '' || regex.test(text)) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validatePhoneNo (text: string, setPhoneNo: Function, setError: Function) {
    var validFormat = false;
    const textLength = text.length;

    validFormat = (textLength == 10 && text.charAt(0) == '0');
    setPhoneNo(text);
    const regex = /^[0-9]+$/;
    if (text === '' || (regex.test(text) && validFormat)) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validateEmail(text: string, setEmail: Function, setError: Function) {
    setEmail(text);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text === '' || regex.test(text)) {
        setError(false);
    } else {
        setError(true);
    }
}

export function validateNIC (text: string, setNIC: Function, setError: Function) {
    var validFormat = false;
    const textLength = text.length;
    const lastChar = text.charAt(textLength - 1);

    validFormat = (textLength == 12 && /^[0-9]+$/.test(text)) || (textLength == 10 && /^v+$/i.test(lastChar));
    setNIC(text);
    const regex = /^[0-9v]+$/i;
    if (text === '' || (regex.test(text) && validFormat)) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validateAccountNo (text: string, setAccountNo: Function, setError: Function) {
    var validFormat = false;
    const textLength = text.length;

    validFormat = (textLength == 12);
    setAccountNo(text);
    const regex = /^[0-9]+$/;
    if (text === '' || (regex.test(text) && validFormat)) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validateBankName (text: string, setBankName: Function, setError: Function) {
    setBankName(text);
    if (text === '') {
        setError(true);
    } else {
        setError(false);
    }
};

export function validateBranchName (text: string, setBranchName: Function, setError: Function) {
    setBranchName(text);
    const regex = /^[a-z ]+$/i;
    if (text === '' || regex.test(text)) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validateOTP (text: string, setOTP: Function, setError: Function) {
    setOTP(text);
    const regex = /^[0-9]+$/;
    if (text === '' || regex.test(text)|| text.length <= 6) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validateNTCNo (text: string, setNTC: Function, setError: Function) {
    var validFormat = false;
    const textLength = text.length;

    validFormat = (textLength == 7);
    setNTC(text);
    const regex = /^[0-9a-z-]+$/i;
    if (text === '' || (regex.test(text) && validFormat)) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validateLicenseNo (text: string, setLicenseNo: Function, setError: Function) {
    var validFormat = false;
    const textLength = text.length;

    validFormat = (textLength == 8);
    setLicenseNo(text);
    const regex = /^[0-9abcdegj]+$/i;
    if (text === '' || (regex.test(text) && validFormat)) {
        setError(false);
    }
    else {
        setError(true);
    }
};
