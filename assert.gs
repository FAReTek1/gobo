# !> pref=
# !> author=faretek
# !> credits=aspizu
# !> desc=assert certain conditions, if not true, give an error

# assert true
proc assert condition, message = "", dont_break = false {
    if not $condition {
        error $message;
        if not $dont_break {breakpoint;}
    }
}
# assert false
proc assert_f condition, message = "", dont_break = false {
    if $condition {
        error $message;
        if not $dont_break {breakpoint;}
    }
}

proc assert_eq result, expected, message = "", dont_break = false {
    if $result != $expected {
        error $message & "Expected " & $expected & ", got " & $result;
        if not $dont_break {breakpoint;}
    }
}
