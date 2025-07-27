# !> pref=fnc
# !> author=faretek
# !> credits=
# !> desc=Bypass sprite fencing

costumes "../assets/size0.svg" as "pos_hack.gs//size0",
         "../assets/size1.svg" as "pos_hack.gs//size1",
         "../assets/size2.svg" as "pos_hack.gs//size2";

%define _POS_HACK_SWITCH_COSTUME_FOR_SIZE(s) switch_costume "pos_hack.gs//size" & (s < 100) + (s < 1); set_size s

proc fnc_set_size size {
    local old_costume = costume_number();
    _POS_HACK_SWITCH_COSTUME_FOR_SIZE($size);
    switch_costume old_costume;
}

proc fnc_goto_set_size x, y, size {
    local old_costume = costume_number();

    switch_costume "pos_hack.gs//size0";
    set_size "Infinity";
    goto $x, $y;

    _POS_HACK_SWITCH_COSTUME_FOR_SIZE($size);
    switch_costume old_costume;
}

proc fnc_goto x, y {
    fnc_goto_set_size $x, $y, size();
}

proc fnc_change_xy dx, dy {
    fnc_goto x_position() + $dx, 
               y_position() + $dy;
}

proc fnc_move_steps steps {
    fnc_change_xy sin(direction()) * $steps,
                  cos(direction()) * $steps;
}
