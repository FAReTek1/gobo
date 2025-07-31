# Getting information from/about costumes.

# %include ..\vec2

func costume_count() {
    local zero = 0;
    local old_costume = costume_number();
    switch_costume zero;
    local ret = costume_number();
    switch_costume old_costume;
    return ret;
}

# Measure costume dimensions
# It is a planned feature to include this builtin, but that will need time to be implemented

list Vec2 costume_dimensions;
proc cache_costume_dims warn_90=true {
    # Make sure to run this with a direction value of 90
    if $warn_90 and direction() != 90{
        warn "Called cache_costume_dims with direction=" & direction() & ", expected 90. If you want to disable this warning, call this with $warn_90=false";
    }
    delete costume_dimensions;

    local i = 1;
    local ct = costume_count();
    repeat ct { 
        # You could actually do a repeat until costume # == 1 but
        # you have to make sure it does the first iteration
        switch_costume i;
        add measure_costume_dims() to costume_dimensions;        
        i++;
    }
}

func measure_costume_dims() Vec2 {
    return Vec2{
        x: measure_costume_width(),
        y: measure_costume_height()
    };
}

func measure_costume_width(){
    return _measure_width(size(), 0, x_position(), y_position());
}

func measure_costume_height(){
    turn_right 90;
    local ret = _measure_width(size(), 0, x_position(), y_position());
    turn_left 90;
    return ret;
}

func _measure_width(s, rd, x, y) { # rd = recursion depth
    fnc_set_size $s;

    goto "Infinity", 0;
    local width = x_position() - 240;
    goto "-Infinity", 0;
    width += -210 - x_position();

    if width > 40 {
        fnc_goto $x, $y;
        return (width / size()) * 100;

    } elif $rd > 2 {
        fnc_goto $x, $y;
        return 0;
    }

    else {
        return _measure_width(10 * $s, 1 + $rd, $x, $y);
    }
}
