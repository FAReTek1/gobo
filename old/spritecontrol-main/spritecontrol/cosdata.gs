# Getting information from/about costumes.


func costume_count() {
    local old_costume = costume_number();
    switch_costume 0;
    local ret = costume_number();
    switch_costume old_costume;
    return ret;
}


# Measure costume dimensions

struct WxH {
    w, h
} 
# Width & height struct

list WxH costume_dimensions;
proc cache_costume_dims{
    # Make sure to run this with a direction value of 90
    delete costume_dimensions;

    local i = 1;
    local ct = costume_count();
    repeat ct { 
        # You could actually do a repeat until costume # == 1 but
        # you have to make sure it does the first iteration
        switch_costume i;
        add measure_costume_wxh() to costume_dimensions;        
        i++;
    }
}

func measure_costume_wxh() WxH {
    return WxH{
        w: measure_costume_width(),
        h: measure_costume_height()
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
    size_hack($s);

    goto "Infinity", 0;
    local width = x_position() - 240;
    goto "-Infinity", 0;
    width += -210 - x_position();

    if width > 40 {
        pos_hack $x, $y;
        return (width / size()) * 100;

    } elif $rd > 2 {
        pos_hack $x, $y;
        return 0;
    }

    else {
        return _measure_width(10 * $s, 1 + $rd, $x, $y);
    }
}
