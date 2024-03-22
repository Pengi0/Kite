

export const config = {
    ip: import.meta.env.VITE_DB_IP
}

export async function send(x: any) {

    const sen = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(x)
    }
    try {
        const ret = await fetch(config.ip, sen)
        const data = await ret.json()
        console.log(data);
        return data
    } 
    catch(error) {
        console.log('ERROR: ', error)
        return null
    }
}

export function validateEmail(email: string) {
    // Regular expression for validating email addresses
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Test the email against the regular expression
    return regex.test(email);
}

export function isAlphaNum(x: string) {
    
    const regex = /^[a-zA-Z0-9_]/;

    return regex.test(x);
}

export function toImg(x: string) {
    return config.ip+x
}