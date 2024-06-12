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
    setPhoneNo(text);
    const regex = /^[0-9]+$/;
    if (text === '' || regex.test(text)) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validateDateOfBirth (text: string, setDateOfBirth: Function, setError: Function) {
    setDateOfBirth(text);
    const regex = /^[0-9/]+$/;
    if (text === '' || regex.test(text)) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validateNIC (text: string, setNIC: Function, setError: Function) {
    setNIC(text);
    const regex = /^[0-9v]+$/i;
    if (text === '' || regex.test(text)) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validateAccountNo (text: string, setAccountNo: Function, setError: Function) {
    setAccountNo(text);
    const regex = /^[0-9-]+$/;
    if (text === '' || regex.test(text)) {
        setError(false);
    }
    else {
        setError(true);
    }
};

export function validateBankName (text: string, setBankName: Function, setError: Function) {
    setBankName(text);
    const regex = /^[a-z ]+$/i;
    if (text === '' || regex.test(text)) {
        setError(false);
    }
    else {
        setError(true);
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
    if (text === '' || regex.test(text)) {
        setError(false);
    }
    else {
        setError(true);
    }
};
