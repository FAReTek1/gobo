# Vec2 library based on 3Blue1Brown's series on linear algebra
struct Vec2 {
    x=0, y=0
}

%define Vec2(_x, _y) Vec2{x: _x, y:_y}

%define STR_V2(self) "Vec2(" & self.x & ", " & self.y & ")"

func str_v2(Vec2 self) {
    return STR_V2($self);
}

%define EQ_V2(s, o) ((s.x) == (o.x) and (s.y) == (o.y))

func eq_v2(Vec2 s, Vec2 o) {
    return EQ_V2($s, $o);
}

%define ADD_V2(self, other) Vec2(self.x + other.x, self.y + other.y)

func add_v2(Vec2 self, Vec2 other) Vec2 {
    return ADD_V2($self, $other);
}

%define SUB_V2(self, other) Vec2(self.x - other.x, self.y - other.y)

func sub_v2(Vec2 self, Vec2 other) Vec2 {
    return SUB_V2($self, $other);
}

%define SCALE_V2(self, scalar) Vec2(self.x * scalar, self.y * scalar)

func scale_v2(Vec2 self, scalar) Vec2 {
    return SCALE_V2($self, $scalar);
}

# equivalent to checking if determinant is 0
%define ISALIGNED_V2(s, o) (s.x * o.y == s.y * o.x)

# same as a check for linear dependence
func isaligned_v2(Vec2 self, Vec2 other) {
    return ISALIGNED_V2($self, $other);
}

# get the scalar from other -> self. i.e. self / other
# other * scalar = self?
# if scalar isn't possible, raise error
func div_v2(Vec2 self, Vec2 other) {
    local scalar = $self.x / $other.x;
    if scalar * $other.y == $self.y {
        return scalar;
    } else {
        error STR_V2($self) & " is not divisible by " & STR_V2($other);
        breakpoint;
    }
}

enum Span2 {
    # = rank, starting at 0
    point,
    line,
    plane
}

%define I_HAT Vec2(1, 0)
%define J_HAT Vec2(0, 1)
%define MOUSE_V2() Vec2(mouse_x(), mouse_y())

# tells u the span of 2 vectors
# i.e. the set of all linear combinations of the 2 vectors
func rank_v2(Vec2 s, Vec2 o) {
    if ISALIGNED_V2($s, $o) {
        if $s.x == 0 and $s.y == 0 and $o.x == 0 and $o.y == 0 {
            return Span2.point;
        } else {
            return Span2.line;
        }
    } else {
        return Span2.plane;
    }
}

%define APPLY_BASIS_V2(v, ih, jh) Vec2(\
        v.x * ih.x + v.y * jh.x,\
        v.x * ih.y + v.y * jh.y \
    )

func apply_basis_v2(Vec2 v, Vec2 ih, Vec2 jh) Vec2 {
    return APPLY_BASIS_V2($v, $ih, $jh);
}

%define MAG_V2(s) sqrt(s.x * s.x + s.y * s.y)
func mag_v2(Vec2 s) {
    return MAG_V2($s);
}

%define UNSCALE_V2(s, scalar) Vec2(s.x / scalar, s.y / scalar)
func unscale_v2(Vec2 s, scalar) Vec2 {
    return UNSCALE_V2($s, $scalar);
}

%define NORMAL_R(s) Vec2(s.y, -s.x)
%define NORMAL_L(s) Vec2(-s.y, s.x)

func normalize_v2(Vec2 s) Vec2 {
    local mag = MAG_V2($s);
    return UNSCALE_V2($s, mag);
}

# work out out what v was from result, say v -> u
# alternatively also works to give coefs of ih and jh to get u
# note how if ih and jh are aligned, the denominator will be zero, and a math error will occur - this uses the same math as the isaligned function - a determinant
# equivalent to multiplying by the inverse matrix
func invert_basis_v2(Vec2 u, Vec2 ih, Vec2 jh) Vec2 {
    local y = ($u.y * $ih.x - $u.x * $ih.y) / ($jh.y * $ih.x - $jh.x * $ih.y);
    return Vec2(($u.x - y * $jh.x) / $ih.x, y);
}

proc draw_v2_dot Vec2 p {
    goto $p.x, $p.y;
    pen_down;
    pen_up;
}

proc draw_v2 Vec2 s, arrowhead_size=2.5, back_ratio=2 {
    local scalar = $arrowhead_size / MAG_V2($s);
    local Vec2 v = SCALE_V2($s, scalar);

    local Vec2 back = Vec2($s.x - v.x * $back_ratio, $s.y - v.y * $back_ratio);

    goto 0, 0;
    pen_down;
    goto $s.x, $s.y;
    goto back.x + v.y, back.y - v.x;
    goto back.x - v.y, back.y + v.x;
    goto $s.x, $s.y;
    pen_up;
}


proc draw_v2_from Vec2 origin, Vec2 s, arrowhead_size=2.5, back_ratio=2 {
    local scalar = $arrowhead_size / MAG_V2($s);
    local Vec2 v = SCALE_V2($s, scalar);

    local Vec2 back = Vec2($s.x - v.x * $back_ratio, $s.y - v.y * $back_ratio);

    goto $origin.x, $origin.y;
    pen_down;
    goto $origin.x + $s.x, $origin.y + $s.y;
    goto $origin.x + back.x + v.y, $origin.y + back.y - v.x;
    goto $origin.x + back.x - v.y, $origin.y + back.y + v.x;
    goto $origin.x + $s.x, $origin.y + $s.y;
    pen_up;
}

struct Mat2 {
    a, b, 
    c, d
}

%define Mat2(_a, _b, _c, _d) Mat2{a: _a, b: _b, c: _c, d: _d}

# this can be used for generating a Change of basis matrix
%define MAT2_V2(i, j) Mat2{a: i.x, c: i.y, b: j.x, d: j.y}

# rotation matrix anticlockwise
%define ROTATION_MATRIX(t) Mat2(\
    cos(t), -sin(t),\
    sin(t), cos(t)\
)

%define IH_MAT2(m) Vec2(m.a, m.c)
%define JH_MAT2(m) Vec2(m.b, m.d)

%define INDENTIY_MAT2 Mat2(1, 0, 0, 1)
%define SHEAR_MATRIX(amt) Mat2(1, amt, 0, 1) 

%define STR_MAT2(m) "Mat2(" & m.a & ", " & m.b & ", " & m.c & ", " & m.d & ")"
func str_mat2x2(Mat2 m) {
    return STR_MAT2($m);
}

%define MUL_MAT2_V2(m, v) Vec2(\
        v.x * m.a + v.y * m.b, \
        v.x * m.c + v.y * m.d \
    )

func mul_mat2x2_v2(Mat2 m, Vec2 v) Vec2 {
    return MUL_MAT2_V2($m, $v);
}

%define MUL_MAT2(m1, m2) Mat2(\
    m2.a * m1.a + m2.c * m1.b, m2.b * m1.a + m2.d * m1.b,\
    m2.a * m1.c + m2.c * m1.d, m2.b * m1.c + m2.d * m1.d \
)

func mul_mat2x2(Mat2 m1, Mat2 m2) Mat2 {
    return MUL_MAT2($m1, $m2);
}

# calculate determinants
%define DET_MAT2(m) (m.a * m.d - m.c * m.b)
func det_mat2x2(Mat2 m) {
    return DET_MAT2($m);
}

%define INVERSE_MAT2(m, d) Mat2(\
        m.d / d, -m.b / d,\
        -m.c / d, m.a / d \
    )

func inverse_mat2x2(Mat2 m) Mat2 {
    local d = DET_MAT2($m);
    return INVERSE_MAT2($m, d);
}

%define DOT_V2(u, v) u.x * v.x + u.y * v.y

func dot_v2(Vec2 u, Vec2 v) {
    return DOT_V2($u, $v);
}


# in 2d, cross product isn't really defined, but existing implentations just package 2 vectors into a matrix and get determinant
# if you want a perpendicular vector, use `NORMAL_L` or `NORMAL_R` instead 
# (by default use `NORMAL_R`, as that has the same attributes when dealing with a vector, with regards that when taking a dot product
#  with it and some other vector, you get the determinant of the matrix formed by the 'some other vector' and the original vector 
# you plugged into `NORMAL_R` - note that this means it only takes in 1 input)
%define CROSS_V2(a, b) a.x * b.y - a.y * b.x
func cross_v2(Vec2 a, Vec2 b) {
    return CROSS_V2($a, $b);
}

enum SpecialEigenvectorResult {
    none="NaN",
    plane="Plane"
}

# In this case, a Vec2 is used as a package for 2 results
%define GET_EIGENVECTOR_D(m) (m.a + m.d) * (m.a + m.d) + 4 * (m.b * m.c - m.a * m.d)
%define GET_EIGENVALUES_MAT2(m, d) Vec2(((m.a + m.d) + d) / 2,\
                                        ((m.a + m.d) - d) / 2)

func get_eigenvalues_mat2(Mat2 m) Vec2 {
    local d = sqrt(GET_EIGENVECTOR_D($m));
    if d == "NaN" {
        return Vec2("NaN", "NaN");
    }

    return GET_EIGENVALUES_MAT2($m, d);
}

# this just checks if a matrix is simply a scalar multiple of the identity matrix, i.e., a scalar matrix
%define HAS_PLANE_EIGENVECTORS_MAT2(m) (m.b == m.c and m.a == 0 and m.d == 0)

# pass in 1 eigenvalue and get the corresponding gradient
%define EIGENVECTOR_GRADIENT_FROM_EIGENVAL_MAT2(m, l) (m.a + m.c - l) / (l - m.b - m.d)
func eigenvector_gradient_from_eigenval_mat2(Mat2 m, l) {
    if HAS_PLANE_EIGENVECTORS_MAT2($m) {
        return SpecialEigenvectorResult.plane;
    }

    return EIGENVECTOR_GRADIENT_FROM_EIGENVAL_MAT2($m, $l);    
}

func eigenvector_gradients_from_eigenvalues_mat2(Mat2 m, Vec2 l) Vec2 {
    if $l == "NaN" {
        return Vec2("NaN", "NaN");
    }

    if HAS_PLANE_EIGENVECTORS_MAT2($m) {
        return Vec2(SpecialEigenvectorResult.plane, SpecialEigenvectorResult.plane);
    }

    return Vec2(EIGENVECTOR_GRADIENT_FROM_EIGENVAL_MAT2($m, $l.x),
                EIGENVECTOR_GRADIENT_FROM_EIGENVAL_MAT2($m, $l.y));
}

func get_eigenvector_gradients_mat2(Mat2 m) Vec2 {
    if HAS_PLANE_EIGENVECTORS_MAT2($m) {
        return Vec2(SpecialEigenvectorResult.plane, SpecialEigenvectorResult.plane);
    }

    local d = sqrt(GET_EIGENVECTOR_D($m));
    if d == "NaN" {
        return Vec2("NaN", "NaN");
    }

    local Vec2 eigenvalues = GET_EIGENVALUES_MAT2($m, d);
    return Vec2(EIGENVECTOR_GRADIENT_FROM_EIGENVAL_MAT2($m, eigenvalues.x),
                EIGENVECTOR_GRADIENT_FROM_EIGENVAL_MAT2($m, eigenvalues.y));
}

%define TRACE_MAT2(m) m.a + m.d

func trace_mat2(Mat2 m) {
    return TRACE_MAT2($m);
}

# ignored list
# C7 null space
# C12 inverse orthonormal/orthogonal matrices 5:25
# C12 cramer's rule - just use an inverse matrix or gaussian elimination
# C13 translating a matrix - translate to own, apply own transformation, translate back (multiply these 3 matrices 11:00)
