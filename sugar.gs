# !> pref=
# !> author=faretek
# !> credits=
# !> desc=syntactical sugar stuff or just neat simple utilities. might go against name conventions to look nicer
# !> date=2025-07-27

%define pen_du pen_down;pen_up

proc change_xy dx, dy {
    # Even with tw no fencing enabled, this is not equivalent to change x by dx; change y by dy;
    # because it causes differences when the pen is down
    goto x_position() + $dx, y_position() + $dy;
}

%define onbool(b) ontimer > 0.0000000000001 / (b)

proc c txt {}  # visible comment

%define MOUSE_TUP mouse_x(), mouse_y()
%define POS_TUP x_position(), y_position()
