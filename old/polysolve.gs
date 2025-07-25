# Polynomial solvers (for 2 <= n <= 4)

# todo: use vec2/3/4 etc instead of ret234
struct Ret2 {a, b}
struct Ret3 {a, b, c}
struct Ret4 {a, b, c, d}

func solve_quadractic(a, b, c) Ret2 {
    local discrim = $b * $b - 4 * $a * $c;
    if discrim < 0 {
        # complex
        # Return complex numbers as strings
        # there is a function for this in the cmath library
    } else {
        discrim = sqrt(discrim);
        return Ret2 {
            a: (discrim - $b) / (2 * $a),
            b: (discrim + $b) / (-2 * $a)
        };
    }
}


# https://turbowarp.org/913918502/editor
# func solve_cubic(a, b, c, d) Ret3 {
#     
# }

# func solve_quartic(a, b, c, d, e) Ret4 {
#     
# }