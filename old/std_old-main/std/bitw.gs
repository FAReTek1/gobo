# Bitwise operators.

################################################################
# Adapted from https://github.com/some100/chip8-interpreter-scratch/blob/54292952b1c56821f11a3ee9237d603f33e7ab12/include/bitwise.gs#L1C1-L69C2
# Bitwise operators on numbers

func bwAND(x, y) {
    local result = 0;
    local i = 1;
    local j = $x;
    local k = $y;
    until j == 0 or k == 0 {
        if (j % 2 == 1) and (k % 2 == 1) {
            result += i;
        }
        j //= 2;
        k //= 2;
        i *= 2;
    }
    return result;
}

func bwOR(x, y) {
    local result = 0;
    local i = 1;
    local j = $x;
    local k = $y;
    until j == 0 and k == 0 {
        if (j % 2 == 1) or (k % 2 == 1) {
            result += i;
        }
        j //= 2;
        k //= 2;
        i *= 2;
    }
    return result;
}

func bwXOR(x, y) {
    local result = 0;
    local i = 1;
    local j = $x;
    local k = $y;
    until j == 0 and k == 0 {
        if ((j % 2 == 1) and (k % 2 == 0)) or ((j % 2 == 0) and (k % 2 == 1)) {
            result += i;
        }
        j //= 2;
        k //= 2;
        i *= 2;
    }
    return result;
}

func lshift(x, y) { # Simulate bit shifting (multiply number by power of 2)
    return $x * antiln(ln 2 * $y);
}

func rshift(x, y) { # Simulate bit shifting (divide number by power of 2)
    return floor($x / antiln(ln 2 * $y));
}

################################################################
# Bitwise operators on strings of 1 or 0
func bwAND_str (bits1, bits2) {
    # Perform a bitwise AND on two strings. Assumes that they are equal length
    local i = 1;

    ret = "";
    repeat length($bits1) {
        ret &= "" + ($bits1[i] and $bits2[i]);
        i++;
    }

    return ret;
}


func bwOR_str (bits1, bits2) {
    # Perform a bitwise OR on two strings. Assumes that they are equal length
    local i = 1;

    ret = "";
    repeat length($bits1) {
        ret &= "" + ($bits1[i] or $bits2[i]);
        i++;
    }

    return ret;
}

func bwNOT_str (bits) {
    # Perform a bitwise OR on two strings. Assumes that they are equal length
    local i = 1;

    ret = "";
    repeat length($bits) {
        ret &= "" + not $bits[i];
        i++;
    }

    return ret;
}

func bwXOR_str (bits1, bits2) {
    # Perform a bitwise OR on two strings. Assumes that they are equal length
    local i = 1;

    ret = "";
    repeat length($bits1) {
        # you can find the XOR macro in std/math.gs
        ret &= "" + ($bits1[i] != $bits2[i]);
        i++;
    }

    return ret;
}

