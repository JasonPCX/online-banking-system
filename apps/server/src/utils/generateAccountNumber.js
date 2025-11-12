const bankId = '773';
export const branches = {
    browser: '001',
    mobile: '002',
};
export const accountTypes = {
    'Checking account': {
        id: '1',
    },
    'Savings account': {
        id: '2',
    },
};

export const accountTypeNames = Object.keys(accountTypes);

function generateAccountNumber(
    accountType = 'Checking account',
    branch = 'browser'
) {
    let accountNumber =
        bankId + branches[branch] + accountTypes[accountType].id + Date.now();

    let finalAccountNumber = `${accountNumber}${calculateCheckDigit(
        accountNumber
    )}`;
    return finalAccountNumber;
}

function calculateCheckDigit(accountNumber) {
    const accountNumberArr = accountNumber.split('').map(str => parseInt(str));
    for (let i = 1; i < accountNumberArr.length; i += 2) {
        let n = accountNumberArr[i] * 2;
        if (n > 9) {
            const splitted = n.toString().split('');
            let acc = 0;
            for (let j = 0; j < splitted.length; j++) {
                acc += parseFloat(splitted[j]);
            }
            n = acc;
        }
        accountNumberArr[i] = n;
    }
    let sum = 0;
    for (let i = 0; i < accountNumberArr.length; i++) {
        sum += parseFloat(accountNumberArr[i]);
    }
    const checkDigit = 10 - (sum % 10);
    return checkDigit;
}

export default generateAccountNumber;
