# !> pref=
# !> author=faretek
# !> credits=
# !> desc=syntactical sugar stuff or just neat simple utilities. might go against name conventions to look nicer
# !> date=2025-07-27

# just forces a semicolon. Unforunately, doesn't compile nicely..
%define pass _ = ""
%define pen_du pen_down;pen_up
proc change_xy dx, dy {
    # Even with tw no fencing enabled, this is not equivalent to change x by dx; change y by dy;
    # because it causes differences when the pen is down
    goto x_position() + $dx, y_position() + $dy;
}
