# base conversion

%include ..\string

%define B10_DIGITS "0123456789"
%define B2_DIGITS "01"
%define B8_DIGITS "01234567"
%define B16_DIGITS "0123456789ABCDEF"

# Based on https://www.rapidtables.com/convert/number/base-converter.html
func convert_base(val, og_digits=B10_DIGITS, new_digits=B16_DIGITS) {
    local og_base = length $og_digits;
    local new_base = length $new_digits;
    
    # Convert to base 10
    local b10 = 0;
    local i = 1;
    repeat length $val {
        b10 += (findchar($og_digits, $val[i]) - 1) * POW(og_base, length $val - i);
        i++;
    }

    ret = "";
    until b10 < 1 {
        ret = $new_digits[b10 % new_base + 1] & ret;
        b10 /= new_base;        
    }
    return ret;
}

func convert_base_dp(val, og_digits=B10_DIGITS, new_digits=B16_DIGITS, res=10) {
    local dpi = findchar($val, ".");

    if dpi == 0 {
        return convert_base($val, $og_digits, $new_digits);
    }

    local og_base = length $og_digits;
    local new_base = length $new_digits;

    local whole = slice($val, 1, dpi - 1);
    local dec = slice($val, dpi + 1, length $val);

    local b10 = 0;
    local i = 1;
    repeat length whole {
        b10 += (findchar($og_digits, whole[i]) - 1) * POW(og_base, length whole - i);
        i++;
    }

    i = 1;
    repeat length dec{
        b10 += (findchar($og_digits, dec[i]) - 1) * POW(og_base, -i);
        i++;
    }

    b10 = floor(b10 * POW(new_base, $res));
    local ret = convert_base(b10, "0123456789", $new_digits);

    local dpi = length ret - $res;    
    return slice(ret, 1, dpi) & "." & slice(ret, dpi + 1, length ret);
}
