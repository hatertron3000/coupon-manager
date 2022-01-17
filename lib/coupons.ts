export function makeCode(length: number, codes: string[] = []): string {
    let result           = ''
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const charactersLength = characters.length
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    // Do not return duplicate codes
    if (codes.includes(result))
        return makeCode(length, codes)

    return result
}

export function generateCodes(quantity: number, length:number): string[] {     
    const codes = []

    for (let i = 0; i < quantity; i++) {
        const code = makeCode(length, codes)
        codes.push(code)
    }

    return codes
}