# Color conversion and management for goboscript

# %include ..\string
# %include ..\base
# %include ..\math

# TODO: add macro versions of stamping/pencolor setting
# TODO: add a coonditional compilation to store the current pen colour - what about using a macro hook?
# TODO: testing
############################################ structs ############################################

# Prefixed with a c to avoid naming conflicts with math.gs's RGB macro

struct cHSVA {
    # Hue, saturation, value, alpha
    h = 0, s = 100, v = 100, a = 100
}

%define cHSVA(_h,_s,_v,_a) cHSVA{h:_h, s:_s, v:_v, a:_a}
%define cHSV(_h,_s,_v) cHSVA{h:_h, s:_s, v:_v}

struct cRGBA {
    # Red, Green, Blue & Alpha
    r = 255, g = 0, b = 0, a = 255
}

%define cRGBA(_r, _g, _b, _a) cRGBA{r:_r,g:_g,b:_b, a:_a}
%define cRGB(_r, _g, _b) cRGBA{r:_r,g:_g,b:_b}

struct cCBGBG {
    # Color brightness1 ghost1 brightness2 ghost2
    # The format that allows setting a (red) sprite to any color
    c = 0, b1 = 0, g1 = 0, b2 = 0, g2 = 100 
}

%define cCBGBG(_c,_b1,_g1,_b2,_g2) cCBGBG{c: _c, b1: _b1, g1: _g1, b2: _b2, g2: _g2}

# HEX is just a string, BUT PLEASE DO NOT ADD THE '#' - this will affect performance a bit, so i did not implement it.

############################################ cHSVA stuff ############################################

func HSVA_to_CBGBG (cHSVA c) cCBGBG {
    if $c.a == 0 {
        return cCBGBG{
            # other values are irrelevant; it's completely invisible
            g1: 100,
            g2: 100
        };

    } elif $c.s == 100 and $c.v == 100 {
        return cCBGBG{
            c: 2 * $c.h,
            b1: 0,
            g1: 100 - $c.a,
            g2: 100
        };

    } else {
        local x = (100.0 / 3.0) * floor($c.h / (100.0 / 6.0));
        if ($c.h * 0.06) % 2 > 1 {
            local cCBGBG ret = cCBGBG{
                c: (x + (100.0 / 3.0) + ($c.s / 50) * ($c.h - (x / 2 + (100.0 / 6.0))))
            };
            
        } else {
            local cCBGBG ret = cCBGBG{
                c: x + ($c.s / 50) * ($c.h - x / 2)
            };
        }

        ret.b1 = 100 - $c.s;
        x = 1 - (($c.a * (100 - $c.v)) / 10000);
        ret.g1 = (100 - $c.a) / x;
        ret.b2 = -100;
        ret.g2 = 100 * x;

        return ret;
    }
}

# https://www.rapidtables.com/convert/color/hsv-to-rgb.html
func HSVA_to_RGBA (cHSVA c) cRGBA {
    local h = ($c.h * 3.6) % 360;
    local s = $c.s * 0.01;
    local v = $c.v * 0.01;
    local a = $c.a * 2.55;

    local C = v * s;
    local X = C * (1 - abs(((h  / 60) % 2) - 1));
    local m = v - C;

    if h < 180 {
        if h < 120 {
            if h < 60 {
                return cRGBA{
                    r: (C + m) * 255,
                    g: (X + m) * 255,
                    b: m * 255,
                    a: a
                };
            } else {
                return cRGBA{
                    r: (X + m) * 255,
                    g: (C + m) * 255,
                    b: m * 255,
                    a: a
                };
            }
        } else {
            return cRGBA{
                r: m * 255,
                g: (C + m) * 255,
                b: (X + m) * 255,
                a: a
            };
        }
    } else {
        if h < 300 {
            if h < 240 {
                return cRGBA{
                    r: m * 255,
                    g: (X + m) * 255,
                    b: (C + m) * 255,
                    a: a
                };
            } else {
                return cRGBA{
                    r: (X + m) * 255,
                    g: m * 255,
                    b: (C + m) * 255,
                    a: a
                };
            }
        } else {
            return cRGBA{
                r: (C + m) * 255,
                g: m * 255,
                b: (X + m) * 255,
                a: a
            };
        }
    }
}

proc set_pen_color_HSVA cHSVA c {
    set_pen_hue $c.h;
    set_pen_saturation $c.s;
    set_pen_brightness $c.v;
    set_pen_transparency 100 - $c.a;
}

proc set_stamp_color_HSVA cHSVA c {
    _stamp_color = HSVA_to_CBGBG($c);
}

proc set_ps_color_HSVA cHSVA c {
    set_pen_hue $c.h;
    set_pen_saturation $c.s;
    set_pen_brightness $c.v;
    set_pen_transparency 100 - $c.a;
    _stamp_color = HSVA_to_CBGBG($c);
}

############################################ cRGBA stuff ############################################

func RGBA_to_HEX(cRGBA c) {
    return zfill(convert_base($c.r, B10_DIGITS, B16_DIGITS), 2) & 
           zfill(convert_base($c.g, B10_DIGITS, B16_DIGITS), 2) & 
           zfill(convert_base($c.b, B10_DIGITS, B16_DIGITS), 2) & 
           zfill(convert_base($c.a, B10_DIGITS, B16_DIGITS), 2);
}

# Adapted from https://scratch.mit.edu/projects/623945749/ by @-Rex- on scratch
func RGBA_to_CBGBG(cRGBA c) cCBGBG {
    local a = $c.a / 255;
    if $c.r < $c.g or $c.r < $c.b {
        if $c.g < $c.r or $c.g < $c.b {
            local temp1 = $c.b;
            local temp4 = 133.33333333333333;

            if $c.r > $c.g {
                local temp2 = $c.r;
                local temp3 = $c.g;
                local temp5 = 33.333333333333333;
            } else {
                local temp2 = $c.g;
                local temp3 = $c.r;
                local temp5 = -33.333333333333333;
            }

        } else {
            local temp1 = $c.g;
            local temp4 = 66.66666666666667;

            if $c.r > $c.b {
                local temp2 = $c.r;
                local temp3 = $c.b;
                local temp5 = -33.333333333333333;
            } else {
                local temp2 = $c.b;
                local temp3 = $c.r;
                local temp5 = 33.333333333333333;
            }
        }
    } else {
        local temp1 = $c.r;
        if $c.g > $c.b {
            local temp4 = 0;
            local temp2 = $c.g;
            local temp3 = $c.b;
            local temp5 = 33.333333333333333;
        } else {
            local temp4 = 200;
            local temp2 = $c.b;
            local temp3 = $c.g;
            local temp5 = -33.333333333333333;
        }
    }

    local cCBGBG ret = cCBGBG{};
    if temp1 < 128 {
        ret.b2 = 100;
        ret.b1 = (255 * (temp1 - temp3)) / (255 - temp3);
        ret.c = temp4 + temp5 * ((((255 * (temp2 - temp3)) / (255 - temp3)) + (255 - ret.b1)) / 255);
        ret.b1 = 0.39215686274509803 * ret.b1 - 100;
        ret.g2 = 100 - 0.39215686274509803 * temp3;
    } else {
        ret.b2 = -100;
        ret.b1 = 100 * (temp3 / temp1);
        ret.c = temp4 + temp5 * ((temp2 - temp3) / temp1);
        ret.g2 = 0.39215686274509803 * temp1;
    }

    if a >= 1 {
        ret.g1 = 0;
    } elif a > 0 {
        ret.g1 = 100 - 100 * ((a * ret.g2) / (100 - (a * (100 - ret.g2))));
        ret.g2 = 100 - a * (100 - ret.g2);
    } else {
        ret.g1 = 0;
        ret.g2 = 0;
    }

    if ret.g2 <= 0 {
        ret.g1 = 100;
    }

    return ret;
}

# https://www.rapidtables.com/convert/color/rgb-to-hsv.html
func RGBA_to_HSVA(cRGBA c) cHSVA {
    local r = $c.r / 255;
    local g = $c.g / 255;
    local b = $c.b / 255;

    if r > g and r > b {
        local cmax = r;
    } elif g > r and g > b {
        local cmax = g;
    } else {
        local cmax = b;
    }

    if r < g and r < b {
        local cmin = r;
    } elif g < r and g < b {
        local cmin = g;
    } else {
        local cmin = b;
    }

    local delta = cmax - cmin;

    if delta == 0 {
        local cHSVA ret = cHSVA{
            h: 0
        };
    } elif cmax == r {
        local cHSVA ret = cHSVA{
            h: (100.0 / 6.0) * (((g - b) / delta) % 6)
        };
    } elif cmax == g {
        local cHSVA ret = cHSVA{
            h: (100.0 / 6.0) * ((b - r) / delta + 2)
        };
    } else {
        local cHSVA ret = cHSVA{
            h: (100.0 / 6.0) * ((r - g) / delta + 4)
        };
    }
    ret.s = (delta / cmax) * 100;
    ret.v = cmax * 100;
    ret.a = $c.a / 2.55;

    return ret;    
}

proc set_pen_color_RGBA cRGBA c {
    set_pen_color RGBA($c.r, $c.g, $c.b, $c.a);
}
proc set_stamp_color_RGBA cRGBA c {
    _stamp_color = RGBA_to_CBGBG($c);
}

proc set_stamp_color_RGB cRGBA c {
    _stamp_color = RGBA_to_CBGBG(cRGBA{r: $c.r, g: $c.g, b: $c.b});
}

proc set_ps_color_RGB cRGBA c {
    set_pen_color RGB($c.r, $c.g, $c.b);
    _stamp_color = RGBA_to_CBGBG(cRGBA{r: $c.r, g: $c.g, b: $c.b});
}

proc set_ps_color_RGBA cRGBA c {
    set_pen_color RGBA($c.r, $c.g, $c.b, $c.a);
    _stamp_color = RGBA_to_CBGBG($c);
}
############################################ cCBGBG stuff ############################################

onflag {
    cCBGBG _stamp_color = cCBGBG{
        c: 0, b1: 0, g1: 0, b2: -100, g2: 100
    };
}


%define CBGBG_STAMP(cbg)                                                                            \
    if cbg.g1 < 100 {                                                                               \
        set_color_effect cbg.c;                                                                     \
        set_brightness_effect cbg.b1;                                                               \
        set_ghost_effect cbg.g1;                                                                    \
        stamp;                                                                                      \
    }                                                                                               \
    if cbg.g2 < 100 {                                                                               \
        set_brightness_effect cbg.b2;                                                               \
        set_ghost_effect cbg.g2;                                                                    \
        stamp;                                                                                      \
    }
    
proc CBGBG_stamp cCBGBG c {
    CBGBG_STAMP($c);
}

proc cstamp {
    CBGBG_STAMP(_stamp_color);
}


%define SET_STAMP_COLOR_CBGBG(c) _stamp_color = c;

# no cbgbg set color, i dont want to reverse the process

############################################ HEX stuff ############################################
func HEX_to_RGB (hex) cRGBA {
    return cRGBA{
        r: HEX($hex[1] & $hex[2]),
        g: HEX($hex[3] & $hex[4]),
        b: HEX($hex[5] & $hex[6])
    };
}
func HEX_to_RGBA (hex) cRGBA {
    if length $hex < 8 {
        return cRGBA(
            HEX($hex[1] & $hex[2]),
            HEX($hex[3] & $hex[4]),
            HEX($hex[5] & $hex[6]),
            255
        );
    }

    return cRGBA(
        HEX($hex[3] & $hex[4]),
        HEX($hex[5] & $hex[6]),
        HEX($hex[7] & $hex[8]),
        HEX($hex[1] & $hex[2])
    );
}

func HEX_to_CBGBG(hex) cCBGBG {
    return RGBA_to_CBGBG(HEX_to_RGBA($hex));
}

%define SET_PEN_COLOR_HEX(hex) set_pen_color "#" & hex
# for hex, u should probably just use the normal pen color block

proc set_stamp_color_HEX c {
    _stamp_color = HEX_to_CBGBG($c);
}

proc set_ps_color_HEX c {
    set_pen_color "0x" & $c;
    _stamp_color = HEX_to_CBGBG($c);
}

############################################ color filters/effects ############################################

func clamp_RGB (cRGBA c) cRGBA {
    # Floor an RGB and clamp it
    return cRGBA {
        r: floor(CLAMP($c.r, 0, 255)),
        g: floor(CLAMP($c.g, 0, 255)),
        b: floor(CLAMP($c.b, 0, 255))
    };
}

# The functions starting with an underscore are inner functions
func _posterise_value(i) {
    if $i < 128 {
        if $i < 64 {
            return 31;
        } else {
            return 95;
        }
    } else {
        if $i < 192 {
            return 159;
        } else {
            return 223;
        }
    }
}

func posterise_RGB (cRGBA c) cRGBA {
    return cRGBA {
        r: _posterise_value($c.r),
        g: _posterise_value($c.g),
        b: _posterise_value($c.b)
    };
}

func sepia_RGB (cRGBA c) cRGBA {
    return clamp_RGB(cRGBA{
        r: (0.393 * $c.r + 0.769 * $c.g + 0.189 * $c.b),
        g: (0.349 * $c.r + 0.686 * $c.g + 0.168 * $c.b),
        b: (0.272 * $c.r + 0.534 * $c.g + 0.131 * $c.b)
    });
}

func invert_RGB (cRGBA c) cRGBA {
    return clamp_RGB(cRGBA{
        r: 255-$c.r,
        g: 255-$c.g,
        b: 255-$c.b
    });
}

func NTSC_gray_RGB (cRGBA c) cRGBA {
    # Convert an RGB to grayscale using the NTSC formula
    local val = round(0.299 * $c.r + 0.587 * $c.g + 0.114 * $c.b);
    return cRGBA{r: val, g: val, b: val};
}

func gray_RGB (cRGBA c) cRGBA {
    # Convert an RGB to grayscale by taking an average
    local val = round(($c.r + $c.g + $c.b) / 3);
    return cRGBA{r: val, g: val, b: val};
}

func _solarise_value(v, threshold) {
    if $v < $threshold {
        return 255 - $v;
    } else {
        return $v;
    }
}

func solarize (cRGBA c, threshold) cRGBA {
    return cRGBA{
        r: _solarise_value($c.r, $threshold),
        g: _solarise_value($c.g, $threshold),
        b: _solarise_value($c.b, $threshold)
    };
}
