# assert certain conditions, if not true, give an error

# assert true
proc assert_t condition, message {
    if not $condition {
        error $message;
    }
}
# assert false
proc assert_f condition, message {
    if $condition {
        error $message;
    }
}
