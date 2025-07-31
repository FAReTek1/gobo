# easings from https://easings.net/
# ported to gs by faretek 2025-07-24
# %include ..\math

# conditional compilation doesn't seem to be working...
%define EASING_TIMER timer()
# Macros to make definitions easier
%define _GET_ETIMER(s, l) (EASING_TIMER - s) / (l)

%define _START_DEFINE_EASING \
    local x = _GET_ETIMER($startt, $len); \
    if x > 1 { \
        local t = 1; \
        return $endv; \
    } elif x < 0 { \
        local t = 0; \
        return $startv; \
    }

%define _END_DEFINE_EASING return LERP($startv, $endv, t)

%define _DEFINE_SIMPLE_EASING(tcalc) \
        _START_DEFINE_EASING; \
        local t = tcalc; \
        _END_DEFINE_EASING

# special calcs
func get_back_bounce_constant(p=10) {
    # Formula from Vaschex on stackoverflow (optimised):
    # https://stackoverflow.com/questions/46624541/how-to-calculate-this-constant-in-various-easing-functions
    # Allows you to calculate a different value that 1.70158 for the back easing. 1.70158 ~= 10% bounce
    
    local p = $p / 10;
    local m27p = -27 * p;
    local m27p_sqrd = m27p * m27p;

    local c1 = ((-1166400 * p + 2 * m27p_sqrd * m27p) - 524880 * p * p) / 3456000;
    local c2 = sqrt(c1 * c1 + (-6480 * p - m27p_sqrd) * (-6480 * p - m27p_sqrd) * (-6480 * p - m27p_sqrd) / 2985984000000);

    return POW(c2 - c1, 1.0 / 3.0) + 
           POW(-c1 - c2, 1.0 / 3.0) 
           - m27p / 120;
}

# Define Easing

func ease_in_sine(startv, endv, startt=0, len=1) {
    _DEFINE_SIMPLE_EASING(1 - cos(90 * x));
}
func ease_out_sine(startv, endv, startt=0, len=1) {
    _DEFINE_SIMPLE_EASING(sin(90 * x));
}
func ease_inout_sine(startv, endv, startt=0, len=1) {
    _DEFINE_SIMPLE_EASING((1 - cos(180 * x)) / 2);
}
func ease_in_pow(startv, endv, startt=0, len=1, rate=2) {
    _DEFINE_SIMPLE_EASING(POW(x, $rate));
}
func ease_out_pow(startv, endv, startt=0, len=1, rate=2) {
    _DEFINE_SIMPLE_EASING(1 - POW(1 - x, $rate));
}

func ease_inout_pow(startv, endv, startt=0, len=1, rate=2) {
    _START_DEFINE_EASING;
    if x < 0.5 {
        local t = POW(2 * x, $rate) / 2;
    } else {
        local t = 1 - POW(2 - 2 * x, $rate) / 2;
    }
    _END_DEFINE_EASING;
}

func ease_in_expo(startv, endv, startt=0, len=1) {
    _DEFINE_SIMPLE_EASING(antiln(6.931471805599453 * (x-1)) + (1 - x) * 0.0009765625);
}

func ease_out_expo(startv, endv, startt=0, len=1) {
    _DEFINE_SIMPLE_EASING(1 - (antiln(-6.931471805599453 * x) + x * 0.0009765625));
}

func ease_inout_expo(startv, endv, startt=0, len=1) {
    _START_DEFINE_EASING;
    if x < 0.5 {
        local t = 0.5 * (antiln(13.862943611198906 * x - 6.931471805599453) + 0.0009765625 - (0.001953125 * x));
    } else {
        local t = 0.5 * (2 - (antiln(-13.860990486198906 * (x - 0.5))));
    }
    _END_DEFINE_EASING;
}
func ease_in_circ(startv, endv, startt=0, len=1) {
    _DEFINE_SIMPLE_EASING(1 - sqrt(1 - x * x));
}
func ease_out_circ(startv, endv, startt=0, len=1) {
    _DEFINE_SIMPLE_EASING(sqrt(1 - (1 - x) * (1 - x)));
}
func ease_inout_circ(startv, endv, startt=0, len=1) {
    _START_DEFINE_EASING;
    if x < 0.5 {
        local t = 0.5 * (1 - sqrt(1 - 4 * x * x));
    } else {
        local t = 0.5 + 0.5 * sqrt(1 - 4 * (1 - x) * (1 - x));
    }
    _END_DEFINE_EASING;
}
func ease_in_back(startv, endv, startt=0, len=1, rate=1.70158) {
    _DEFINE_SIMPLE_EASING(x * x * (($rate + 1) * x - $rate));
}

func ease_out_back(startv, endv, startt=0, len=1, rate=1.70158) {
    _DEFINE_SIMPLE_EASING(1 - (1 - x) * (1 - x) * (($rate + 1) * (1 - x) - $rate));
}

func ease_inout_back(startv, endv, startt=0, len=1, rate=1.70158) {
    _START_DEFINE_EASING;
    if x < 0.5 {
        local t = 2 * x * x * (2 * ($rate + 1) * x - $rate);
    } else {
        local t = 1 - 2 * (1 - x) * (1 - x) * (($rate + 1) * 2 * (1 - x) - $rate);
    }
    _END_DEFINE_EASING;
}

func ease_in_elastic(startv, endv, startt=0, len=1) {
    _DEFINE_SIMPLE_EASING(sin(1200 * x - 1290) * (0.0009765625 * (x - 1) - antiln(6.931471805599453 * x - 6.931471805599453)));
}
func ease_out_elastic(startv, endv, startt=0, len=1) {
    _DEFINE_SIMPLE_EASING(1 - sin(90 + 1200 * x) * (antiln(-6.931471805599453 * x) - 0.0009765625 * x));
}

func ease_inout_elastic(startv, endv, startt=0, len=1) {
    _START_DEFINE_EASING;
    if x < 0.5 {
        local t = 0.5 * (sin(2400 * x - 1290) * (0.001953125 * (x - 0.5) - antiln(13.862943611198906 * x - 6.931471805599453)));
    } else {
        local t = 1 - 0.5 * sin(2400 * (1 - x) - 1290) * (0.001953125 * (0.5 - x) - antiln(13.862943611198906 * (0.5 - x)));
    }
    _END_DEFINE_EASING;
}

func ease_in_bounce(startv, endv, startt=0, len=1) {
    _START_DEFINE_EASING;
    
    if x > 0.636363636364 {
        local t = 1 - 7.5625 * (1 - x) * (1 - x);
    } elif x > 0.27272727272700004 {
        local t =  0.25 - 7.5625 * (0.45454545454499995 - x) * (0.45454545454499995 - x);
    } elif x > 0.09090909090900001 {
        local t =  0.0625 - 7.5625 * (0.18181818181800002 - x) * (0.18181818181800002 - x);
    } else {
        local t = 0.015625 - 7.5625 * (0.04545454545500005 - x) * (0.04545454545500005 - x);
    }
    _END_DEFINE_EASING;
}
func ease_out_bounce(startv, endv, startt=0, len=1) {
    _START_DEFINE_EASING;

    if x < 0.36363636363600005 {
        local t = 7.5625 * (x) * (x);
    } elif x < 0.727272727273 {
        local t = 0.75 + 7.5625 * (x - 0.5454545454550002) * (x - 0.5454545454550002);
    } elif x < 0.909090909091 {
        local t =  0.9375 + 7.5625 * (x - 0.818181818182) * (x - 0.818181818182);
    } else {
        local t = 0.984375 + 7.5625 * (x - 0.954545454545) * (x - 0.954545454545);
    }
    _END_DEFINE_EASING;
}

func ease_inout_bounce(startv, endv, startt=0, len=1) {
    _START_DEFINE_EASING;

    local ogx = x;
    if ogx < 0.5 {
        x *= 2;
    } else {
        x = (1 - x) * 2;
    }

    if x > 0.636363636364 {
        local t = 1 - 7.5625 * (1 - x) * (1 - x);
    } elif x > 0.27272727272700004 {
        local t =  0.25 - 7.5625 * (0.45454545454499995 - x) * (0.45454545454499995 - x);
    } elif x > 0.09090909090900001 {
        local t =  0.0625 - 7.5625 * (0.18181818181800002 - x) * (0.18181818181800002 - x);
    } else {
        local t = 0.015625 - 7.5625 * (0.04545454545500005 - x) * (0.04545454545500005 - x);
    }

    if ogx < 0.5 {
        t *= 0.5;
    } else {
        t = 1 - 0.5 * t;
    }

    _END_DEFINE_EASING;
}
