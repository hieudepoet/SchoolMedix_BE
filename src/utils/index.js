
export function generateRandomPassword() {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!#$%';

    const allChars = uppercase + lowercase + numbers + special;
    const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

    let password = [
        getRandom(uppercase),
        getRandom(lowercase),
        getRandom(numbers),
        getRandom(special),
    ];

    for (let i = 0; i < 4; i++) {
        password.push(getRandom(allChars));
    }

    return password.sort(() => Math.random() - 0.5).join('');
}
