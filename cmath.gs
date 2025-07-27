# !> pref=c
# !> author=faretek
# !> credits=
# !> desc=complex number struct and complex math
# !> date=2025-07-23

# %include ../math

struct Complex {
    r=0,
    i=0
}

%define Complex(_r, _i) (Complex{r:_r, i:_i})

# Simple ops
%define C_STR(s) "Complex(" & s.r & " + " & s.i & "i)"
func c_str(Complex s) {return C_STR($s);}

# Arithmetic operators
%define C_ADD(s, o) Complex(s.r + o.r, s.i + o.i)
func c_add(Complex s, Complex o) Complex {return C_ADD($s, $o);}

%define C_SUB(s, o) Complex(s.r - o.r, s.i - o.i)
func c_sub(Complex s, Complex o) Complex {return C_SUB($s, $o);}

%define C_NEG(s) Complex(-s.r, -s.i)
func c_neg(Complex s) Complex {return C_NEG($s);}

%define C_MUL(s, o) Complex(s.r * o.r - s.i * o.i, s.r * o.i + s.i * o.r)
func c_mul(Complex s, Complex o) Complex {return C_MUL($s, $o);}

%define C_CONJ(s) Complex(s.r, -s.i)
func c_conj(Complex s) Complex {return C_CONJ($s);}

%define C_DIV(s, o) Complex(\
        (s.r * o.r + s.i * o.i) / (o.r * o.r + o.i * o.i),\
        (s.i * o.r - s.r * o.i) / (o.r * o.r + o.i * o.i))
func c_div(Complex s, Complex o) Complex {
    local den = $o.r * $o.r + $o.i * $o.i;
    return Complex(($s.r * $o.r + $s.i * $o.i) / den,
                   ($s.i * $o.r - $s.r * $o.i) / den);
}

%define C_ABS(s) sqrt(s.r * s.r + s.i * s.i)
func c_abs(Complex s) {return C_ABS($s);}

%define C_ARG(s) ATAN2(s.i, s.r) / 57.2957795131
func c_arg(Complex s) {
    return C_ARG($s);
}

%define C_LN(s) Complex(ln(C_ABS(s)), C_ARG(s))
func c_ln(Complex s) Complex {return C_LN($s);}

# antiln
%define C_EXP(s) Complex(antiln(s.r) * cos(s.i * 57.2957795131), antiln(s.r) * sin(s.i * 57.2957795131))
func c_exp(Complex s) Complex {return C_EXP($s);}

func c_pow(Complex x, Complex y) Complex {
    local Complex ln_x = C_LN($x);
    local Complex yln_x = C_MUL($y, ln_x);
    return C_EXP(yln_x);
}

func c_sqrt(Complex s) Complex {
    local Complex ln_x_2 = Complex(sqrt(C_ABS($s)), ATAN2($s.i, $s.r) / 2);
    return Complex(ln_x_2.r * cos(ln_x_2.i), ln_x_2.r * sin(ln_x_2.i));
}

%define C_SIN(s) Complex(sin(s.r * 57.2957795131) * (antiln(s.i) + antiln(-s.i)) / 2,\
                         cos(s.r * 57.2957795131) * (antiln(s.i) - antiln(-s.i)) / 2)
func c_sin(Complex s) Complex {
    return C_SIN($s);
}

%define C_COS(s) Complex(cos(s.r * 57.2957795131) * (antiln(-s.i) + antiln(s.i)) / 2,\
                         sin(s.r * 57.2957795131) * (antiln(-s.i) - antiln(s.i)) / 2)
func c_cos(Complex s) Complex {
    return C_COS($s);
}

# Not sure if this can be simplified further
func c_tan(Complex s) Complex {
    local ep = antiln(2 * $s.i) + antiln(-2 * $s.i);

    return Complex(
        4 / ((ep + 2) / tan(57.2957795131 * $s.r) + (ep - 2) * tan(57.2957795131 * $s.r)),
        (antiln(2 * $s.i) - antiln(-2 * $s.i)) / (ep + 2 * cos(114.5915590262 * $s.r))
    );
}

func c_asin(Complex s) Complex {
    local Complex z0 = C_MUL($s, $s);
    local Complex z1 = c_sqrt(Complex(1 - z0.r, -z0.i));
    local Complex z2 = Complex(z1.r - $s.i, z1.i + $s.r);
    return Complex(ATAN2(z2.i, z2.r) / 57.2957795131, -ln(C_ABS(z2)));
}

func c_acos(Complex s) Complex {
    local Complex z0 = C_MUL($s, $s);
    local Complex z1 = c_sqrt(Complex(1 - z0.r, -z0.i));
    local Complex z2 = Complex($s.r - z1.i, $s.i + z1.r);
    return Complex(ATAN2(z2.i, z2.r) / -57.2957795131, ln(C_ABS(z2)));
}

func c_atan(Complex s) Complex {
    # TODO: this division can be slightly optimised
    local Complex z0 = c_div(Complex($s.r, $s.i + 1), Complex(-$s.r, 1 - $s.i));
    return Complex(ATAN2(z0.i, z0.r) / -114.5915590262, 0.5 * ln(C_ABS(z0)));
}

# TODO: these last 4 seem to be buggy
%define C_SINH(s) Complex(\
    SINH(s.r) * cos(s.i * 57.2957795131),\
    COSH(s.r) * sin(s.i * 57.2957795131))
func c_sinh(Complex s) Complex {
    return C_SINH($s);
}

%define C_COSH(s) Complex(\
    COSH(s.r) * cos(s.i * 57.2957795131),\
    SINH(s.r) * sin(s.i * -57.2957795131))
func c_cosh(Complex s) Complex {
    return C_COSH($s);
}

func c_asinh(Complex s) Complex {
    local Complex z0 = C_MUL($s, $s);
    local Complex z1 = c_sqrt(Complex(1 + z0.r, z0.i));
    local Complex z2 = C_ADD($s, z1);
    return C_LN(z2);
}

func c_acosh(Complex s) Complex {
    local Complex z0 = C_MUL($s, $s);
    local Complex z1 = c_sqrt(Complex(-z0.r, z0.i));
    local Complex z2 = C_ADD($s, z1);
    return C_LN(z2);
}
