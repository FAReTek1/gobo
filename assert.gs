# assert certain conditions, if not true, give an error

# assert true
proc assert_t condition, message, dont_break = false {
    if not $condition {
        error $message;
        if not $dont_break {breakpoint;}
    }
}
# assert false
proc assert_f condition, message, dont_break = false {
    if $condition {
        error $message;
        if not $dont_break {breakpoint;}
    }
}

proc assert result, expected, message = "", dont_break = false {
    if $result != $expected {
        error $message & ": expected " & $expected & ", got " & $result;
        if not $dont_break {breakpoint;}
    }    
}
