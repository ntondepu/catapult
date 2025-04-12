// src/riskFlagger.js

function flagRisk(values) {
    return values.map(value => {
        if (value < 10) {
            return { value, flag: 'green' }; // Safe
        } else if (value < 20) {
            return { value, flag: 'yellow' }; // Caution
        } else {
            return { value, flag: 'red' }; // Risky
        }
    });
}

