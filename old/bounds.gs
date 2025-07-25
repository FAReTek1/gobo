# min, max stuff
# you can find simple stuff in math.gs

%include ..\math

# smooth min & max from blender apparently
func smooth_min(x, y, s) { # s = smoothing factor
    local c = (MAX($s - abs($x - $y), 0)) / $s;
    return MIN($x, $y) - (($s/6) * c * c * c);
}

func smooth_max(x, y, s) { # s = smoothing factor
    local c = (MAX($s - abs($x - $y), 0)) / $s;
    return MAX($x, $y) + (($s/6) * c * c * c);
}
