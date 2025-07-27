# !> pref=
# !> author=faretek
# !> credits=
# !> desc=(probably bad) macros/funcs for simple calculus operations 

%define DERIV(f, t, dt) (((f(((t) + (dt)))) - (f((t)))) / (dt))
