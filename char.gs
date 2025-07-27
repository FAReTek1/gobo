# !> pref=chr
# !> author=faretek
# !> credits=\
# Unicode list: https://scratch.mit.edu/projects/616351443/
# !> desc=Utilites for single chars.

# This could be internally used by ../string.gs to support a string version of these functions

# change these if you need to have detection e.g. for ä vs Ä
%define _CHAR_LOWERCASE "abcdefghijklmnopqrstuvwxyz"
%define _CHAR_UPPERCASE "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
%define _CHAR_PFX "char.gs//"
%define _CHAR_COSTUME "char.gs//abcdefghijklmnopqrstuvwxyz"
%define _CHAR_NULLCOS "char.gs//0"

costumes "../assets/blank.svg" as _CHAR_NULLCOS;
costumes "../assets/blank.svg" as _CHAR_COSTUME;

list unicode = file ```..\_unicode.txt```;

func _char_inner_ord(char, low, high) {
    # The item #(str) of (list) block is a pretty slow block and ideally 
    # you wouldn't use it with large lists (it's a linear search)

    # But in this case, you can actually just binary sort for a unicode character lol
    # TODO: benchmark this
    local low = $low;
    local high = $high;

    forever{
        local mid = (low + high) // 2;
        if $char > unicode[mid] {
            low = mid;
        } elif $char < unicode[mid] {
            high = mid + 1;
        } else {
            return mid;
        }
    }
}

# Return the unicode index of char
# Only works with single chars
func ord(char) {
    if length $char == 1 {
        if $char in _CHAR_LOWERCASE {
            local chr_idx = "";

            local cos_name = _CHAR_PFX;
            i = 1;
            repeat 26 {
                if $char == _CHAR_LOWERCASE[i] {
                    chr_idx = i;
                    cos_name &= $char;
                } else {
                    cos_name &= _CHAR_LOWERCASE[i];
                }
                i++;
            }

            local old_cos = costume_number();
            switch_costume _CHAR_NULLCOS;
            switch_costume cos_name;
            local islower = costume_name() == _CHAR_COSTUME;

            switch_costume old_cos;
            return chr_idx + 64 + 32 * islower;

        } elif $char == 0 { 
            # 0 is a special case because it is considered equal to the tab character
            # I'm not sure if there are other cases where this occurs
            if $char in "0"{
                return 48;
            } else {
                return 9; # It's a tab
            }
            
        } else {
            return _char_inner_ord($char, 1, length unicode);
        }
    }
}

%define chr(i) (unicode[(i)])

func chr_islower(char) {
    if $char in _CHAR_LOWERCASE {
        local cos_name = _CHAR_PFX;

        i = 1;
        repeat 26 {
            if $char == _CHAR_LOWERCASE[i] {
                chr_idx = i;
                cos_name &= $char;
            } else {
                cos_name &= _CHAR_LOWERCASE[i];
            }
            i++;
        }

        local old_cos = costume_number();

        switch_costume _CHAR_NULLCOS;
        switch_costume cos_name;
        local islower = costume_name() == _CHAR_COSTUME;

        switch_costume old_cos;
        return islower;

    } else {
            # Not a letter; not applicable
            return false;
    }
}

func chr_isupper(char) {
    if $char in _CHAR_LOWERCASE {
        local cos_name = _CHAR_PFX;

        i = 1;
        repeat 26 {
            if $char == _CHAR_LOWERCASE[i] {
                chr_idx = i;
                cos_name &= $char;
            } else {
                cos_name &= _CHAR_LOWERCASE[i];
            }
            i++;
        }

        local old_cos = costume_number();

        switch_costume _CHAR_NULLCOS;
        switch_costume cos_name;
        local isupper = costume_name() != _CHAR_COSTUME;

        switch_costume old_cos;
        return isupper;

    } else {
            # Not a letter; not applicable
            return false;
    }
}

func chr_lower(char) {
    if $char in _CHAR_LOWERCASE {
        return chr(32 + ($char in unicode)); # In this case, as we are dealing with a-z, this is simpler and possibly faster
    } else {
        return $char;
    }
}

func chr_upper(char) {
    if $char in _CHAR_LOWERCASE {
        return chr($char in unicode); # In this case, as we are dealing with a-z, this is simpler and possibly faster
    } else {
        return $char;
    }
}

func chr_check(c1, c2) {
    if $c1 == $c2 {
        if $c1 in "\t0" & _CHAR_LOWERCASE { # include 0 & \t as well to consider tabs
            return ord($c1) == ord($c2);
        } else {
            return true;
        }
    } else {
        return false;
    }
}
