# base conversion

%include ..\string

%define B10_DIGITS "0123456789"
%define B2_DIGITS "01"
%define B8_DIGITS "01234567"
%define B16_DIGITS "0123456789ABCDEF"

# Based on https://www.rapidtables.com/convert/number/base-converter.html

# Convert a base n integer to base 10. By default converts from HEX
func base_convto10(n, digits=B16_DIGITS) {
    if $n[1] == "-" {
        return -base_convto10(slice($n, 2, length $n + 1), $digits);
    }

    local base = length $digits;

    local i = 1;
    local ret = 0;
    repeat length $n {
        ret += (findchar($digits, $n[i]) - 1) * round(POW(base, length $n - i));
        i++;
    }
    return ret;
}

# convert a decimal integer to another base
func base_conv10to(n, digits=B16_DIGITS) {
    local base = length $digits;

    local ret = "";

    local n = abs($n);
    until n < 1 {
        local remainder = n % base;
        n //= base;

        ret = $digits[remainder + 1] & ret;
    }
    if $n < 0 {
        ret = "-" & ret;
    }

    return ret;
}

# Convert an integer from 1 base to another
func base_conv(n, og_digits, new_digits=B16_DIGITS) {
    return base_conv10to(base_convto10($n, $og_digits), $new_digits);
}