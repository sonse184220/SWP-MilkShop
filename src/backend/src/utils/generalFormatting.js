export function vndPriceFormat (number) {
    if (isNaN(number)) {
        return number;
    }

    const numStr = number.toString();
    const [integerPart, decimalPart] = numStr.split('.');

    const formattedIntPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const formattedNumber = decimalPart ? `${formattedIntPart}.${decimalPart} VND` : `${formattedIntPart} VND`;

    return formattedNumber;
}