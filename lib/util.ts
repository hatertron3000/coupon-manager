import { CouponListItem } from "@types"

export const makeDataUrl = (coupons: CouponListItem[]): string => {
    let csvString = 'code,current_uses,max_uses,max_uses_per_customer,created\r\n'

    coupons.forEach(({code, current_uses, max_uses, max_uses_per_customer, created}) => {
     csvString += `${code},${current_uses},${max_uses},${max_uses_per_customer},${created}\r\n`
    })

    return `data:text/plain;charset=utf-8,${encodeURIComponent(csvString)}`

}