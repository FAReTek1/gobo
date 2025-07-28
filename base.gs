# !> pref=base
# !> author=faretek
# !> credits=https://www.rapidtables.com/convert/number/base-converter.html
# !> desc=base conversion
# !> date=
# !> globals=

# %include ..\string

%define B10_DIGITS "0123456789"
%define B2_DIGITS "01"
%define B8_DIGITS "01234567"
%define B16_DIGITS "0123456789ABCDEF"

# TODO: Optimise to remove use of slice()
# Convert a base n integer to base 10. By default converts from HEX (note this particular case can be optimised to use the macro)
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

# convert a decimal integer to another base. By default converts to HEX
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

# convert a float to base 10. default is hex (note this particular case can be optimised to use the macro in math.gs)
func base_convfto10(f, digits=B16_DIGITS) {
    if $f[1] == "-" {
        return -base_convto10(slice($f, 2, length $f + 1), $digits);
    }
    local base = length $digits;

    # convert integer part
    local ilen = findchar($f, ".") - 1;

    local i = 1;
    local ret = 0;
    repeat ilen {
        ret += (findchar($digits, $f[i]) - 1) * round(POW(base, ilen - i));
        i++;
    }

    # decimal portion
    # increasing ilen by 1 helps simplify calcs
    ilen++;
    repeat length $f - ilen {
        i++;
        ret += (findchar($digits, $f[i]) - 1) * POW(base, ilen - i);
    }

    return ret;
}

# maximum res ~= 10. if you want better res, reimplement this using an infinite res decimal engine.
# if you have a better idea, which is not improbable, file an issue on github
func base_convf10to(f, digits=B16_DIGITS, res=6) {
    local base = length $digits;
    
    local f = abs(floor($f * POW(base, $res))); # quotient
    local ret = "";

    # decimal portion
    repeat $res {
        local remainder = f % base;
        f //= base; 
        ret = $digits[remainder + 1] & ret;
    }
    ret = "." & ret;

    # integer portion
    until f < 1 {
        local remainder = f % base;
        f //= base; 
        ret = $digits[remainder + 1] & ret;
    }

    return ret;
}

func base_convf(f, og_digits, new_digits=B16_DIGITS, res=6) {
    return base_convf10to(base_convfto10($f, $og_digits), $new_digits, res: $res);
}
