list _binomial_LUT;
list binomial_cache;

proc binomial_init ct=100 {
    until length _binomial_LUT > $ct {
        binomial_init_row;
    }
}

proc binomial_init_row {
    if length _binomial_LUT == 0 {
        add 1 to _binomial_LUT;
    } else {
        local row = "";
        local i = 1;
        local prev = 0;
        local curr = "";

        until i > length _binomial_LUT["last"] {
            until _binomial_LUT["last"][i] in" " {
                curr &= _binomial_LUT["last"][i];
                i++;
            }
            row &= curr + prev & " ";
            prev = curr;
            curr = "";
            i++;
        }
        row &= curr + prev;
        add row to _binomial_LUT;
    }
}

proc binomial_cache_row i {
    if $i + 1 != length binomial_cache {
        delete binomial_cache;

        binomial_init $i;
        local row = _binomial_LUT[$i + 1];
        local i = 1;
        local curr = "";
        repeat length row {
            if row[i] in " " {
                add curr to binomial_cache;
                curr = "";
            } else {
                curr &= row[i];
            }
            i++;
        }
        add curr to binomial_cache;
    }
}
func binomial(n, k) {
    binomial_cache_row $n;
    return binomial_cache[$k];
}
