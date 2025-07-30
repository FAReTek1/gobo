# !> pref=v2, V2
# !> author=faretek
# !> credits=\
# 3Blue1Brown's Linear algebra series
# !> desc=2D vectors and 2x2 matrices

struct Vec2 {
    x=0, y=0
}

%define Vec2(_x, _y) (Vec2{x: _x, y:_y})

%define V2_TUP(v) v.x, v.y

%define V2_STR(self) "Vec2(" & self.x & ", " & self.y & ")"

func v2_str(Vec2 self) {
    return V2_STR($self);
}

%define V2_EQ(s, o) ((s.x) == (o.x) and (s.y) == (o.y))

func v2_eq(Vec2 s, Vec2 o) {
    return V2_EQ($s, $o);
}

%define V2_ADD(self, other) Vec2(self.x + other.x, self.y + other.y)

func v2_add(Vec2 self, Vec2 other) Vec2 {
    return V2_ADD($self, $other);
}

%define V2_SUB(self, other) Vec2(self.x - other.x, self.y - other.y)

func v2_sub(Vec2 self, Vec2 other) Vec2 {
    return V2_SUB($self, $other);
}

%define V2_SCALE(self, scalar) Vec2(self.x * scalar, self.y * scalar)

func v2_scale(Vec2 self, scalar) Vec2 {
    return V2_SCALE($self, $scalar);
}

# equivalent to checking if determinant is 0
%define V2_ISALIGNED(s, o) (s.x * o.y == s.y * o.x)

# same as a check for linear dependence
func v2_isaligned(Vec2 self, Vec2 other) {
    return V2_ISALIGNED($self, $other);
}

# get the scalar from other -> self. i.e. self / other
# other * scalar = self?
# if scalar isn't possible, raise error
func v2_div(Vec2 self, Vec2 other) {
    local scalar = $self.x / $other.x;
    if scalar * $other.y == $self.y {
        return scalar;
    } else {
        error V2_STR($self) & " is not divisible by " & V2_STR($other);
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
%define V2_MOUSE() Vec2(mouse_x(), mouse_y())
func v2_mouse() Vec2 {return V2_MOUSE();}

%define V2_GOTO(v) goto v.x, v.y
# tells u the span of 2 vectors
# i.e. the set of all linear combinations of the 2 vectors
func v2_rank(Vec2 s, Vec2 o) {
    if V2_ISALIGNED($s, $o) {
        if $s.x == 0 and $s.y == 0 and $o.x == 0 and $o.y == 0 {
            return Span2.point;
        } else {
            return Span2.line;
        }
    } else {
        return Span2.plane;
    }
}

%define V2_APPLY_BASIS(v, ih, jh) Vec2(\
        v.x * ih.x + v.y * jh.x,\
        v.x * ih.y + v.y * jh.y \
    )

func v2_apply_basis(Vec2 v, Vec2 ih, Vec2 jh) Vec2 {
    return V2_APPLY_BASIS($v, $ih, $jh);
}

%define V2_MAG(s) sqrt(s.x * s.x + s.y * s.y)
func v2_mag(Vec2 s) {
    return V2_MAG($s);
}
# square magnitude
%define V2_MAG2(s) (s.x * s.x + s.y * s.y)
func v2_mag2(Vec2 s) {
    return V2_MAG2($s);
}

%define V2_DIST(s, o) sqrt((s.x - o.x) * (s.x - o.x) + (s.y - o.y) * (s.y - o.y)) 
func v2_dist(Vec2 s, Vec2 o) {
    return V2_DIST($s, $o);
}

%define V2_UNSCALE(s, scalar) Vec2(s.x / scalar, s.y / scalar)
func v2_unscale(Vec2 s, scalar) Vec2 {
    return V2_UNSCALE($s, $scalar);
}

%define V2_NORMAL_R(s) Vec2(s.y, -s.x)
%define V2_NORMAL_L(s) Vec2(-s.y, s.x)

func v2_normalize(Vec2 s) Vec2 {
    local mag = V2_MAG($s);
    return V2_UNSCALE($s, mag);
}

# determinant
%define V2_AREA(a,b) MAT2_DET(MAT2_V2(a, b))

# work out out what v was from result, say v -> u
# alternatively also works to give coefs of ih and jh to get u
# note how if ih and jh are aligned, the denominator will be zero, and a math error will occur - this uses the same math as the isaligned function - a determinant
# equivalent to multiplying by the inverse matrix
func v2_invert_basis(Vec2 u, Vec2 ih, Vec2 jh) Vec2 {
    local y = ($u.y * $ih.x - $u.x * $ih.y) / ($jh.y * $ih.x - $jh.x * $ih.y);
    return Vec2(($u.x - y * $jh.x) / $ih.x, y);
}

proc v2_draw_dot Vec2 p {
    goto $p.x, $p.y;
    pen_down;
    pen_up;
}

proc v2_draw Vec2 s, arrowhead_size=2.5, back_ratio=2 {
    local scalar = $arrowhead_size / V2_MAG($s);
    local Vec2 v = V2_SCALE($s, scalar);

    local Vec2 back = Vec2($s.x - v.x * $back_ratio, $s.y - v.y * $back_ratio);

    goto 0, 0;
    pen_down;
    goto $s.x, $s.y;
    goto back.x + v.y, back.y - v.x;
    goto back.x - v.y, back.y + v.x;
    goto $s.x, $s.y;
    pen_up;
}


proc v2_draw_from Vec2 origin, Vec2 s, arrowhead_size=2.5, back_ratio=2 {
    local scalar = $arrowhead_size / V2_MAG($s);
    local Vec2 v = V2_SCALE($s, scalar);

    local Vec2 back = Vec2($s.x - v.x * $back_ratio, $s.y - v.y * $back_ratio);

    goto $origin.x, $origin.y;
    pen_down;
    goto $origin.x + $s.x, $origin.y + $s.y;
    goto $origin.x + back.x + v.y, $origin.y + back.y - v.x;
    goto $origin.x + back.x - v.y, $origin.y + back.y + v.x;
    goto $origin.x + $s.x, $origin.y + $s.y;
    pen_up;
}

%define V2_POS() Vec2(x_position(), y_position())
func v2_pos() Vec2 {return V2_POS();}

%define V2_LERP(a,b,t) Vec2(a.x + (t) * (b.x - a.x), a.y + (t) * (b.y - a.y))
func v2_lerp(Vec2 a, Vec2 b, t) Vec2 {return V2_LERP($a, $b, $t);}

struct Mat2 {
    a, b, 
    c, d
}

%define Mat2(_a, _b, _c, _d) (Mat2{a: _a, b: _b, c: _c, d: _d})

# this can be used for generating a Change of basis matrix
%define MAT2_V2(i, j) (Mat2{a: i.x, c: i.y, b: j.x, d: j.y})

# rotation matrix anticlockwise
%define MAT2_ROTATION(t) Mat2(\
    cos(t), -sin(t),\
    sin(t), cos(t)\
)

%define MAT2_IH(m) Vec2(m.a, m.c)
%define MAT2_JH(m) Vec2(m.b, m.d)

%define MAT2_INDENTIY Mat2(1, 0, 0, 1)
%define MAT2_SHEAR(amt) Mat2(1, amt, 0, 1) 

%define MAT2_STR(m) "Mat2(" & m.a & ", " & m.b & ", " & m.c & ", " & m.d & ")"
func mat2_str(Mat2 m) {
    return MAT2_STR($m);
}

%define MAT2_MUL_V2(m, v) Vec2(\
        v.x * m.a + v.y * m.b, \
        v.x * m.c + v.y * m.d \
    )

func mat2_mul_v2(Mat2 m, Vec2 v) Vec2 {
    return MAT2_MUL_V2($m, $v);
}

%define MAT2_MUL(m1, m2) Mat2(\
    m2.a * m1.a + m2.c * m1.b, m2.b * m1.a + m2.d * m1.b,\
    m2.a * m1.c + m2.c * m1.d, m2.b * m1.c + m2.d * m1.d \
)

func mat2_mul(Mat2 m1, Mat2 m2) Mat2 {
    return MAT2_MUL($m1, $m2);
}

# calculate determinants
%define MAT2_DET(m) (m.a * m.d - m.c * m.b)
func mat2_det(Mat2 m) {
    return MAT2_DET($m);
}

%define MAT2_INVERSE(m, d) Mat2(\
        m.d / d, -m.b / d,\
        -m.c / d, m.a / d \
    )

func mat2_inverse(Mat2 m) Mat2 {
    local d = MAT2_DET($m);
    return MAT2_INVERSE($m, d);
}

%define V2_DOT(u, v) u.x * v.x + u.y * v.y

func v2_dot(Vec2 u, Vec2 v) {
    return V2_DOT($u, $v);
}


# in 2d, cross product isn't really defined, but existing implentations just package 2 vectors into a matrix and get determinant
# if you want a perpendicular vector, use `V2_NORMAL_L` or `V2_NORMAL_R` instead 
# (by default use `V2_NORMAL_R`, as that has the same attributes when dealing with a vector, with regards that when taking a dot product
#  with it and some other vector, you get the determinant of the matrix formed by the 'some other vector' and the original vector 
# you plugged into `V2_NORMAL_R` - note that this means it only takes in 1 input)
%define V2_CROSS(a, b) a.x * b.y - a.y * b.x
func v2_cross(Vec2 a, Vec2 b) {
    return V2_CROSS($a, $b);
}

enum SpecialEigenvectorResult {
    none="NaN",
    plane="Plane"
}

# In this case, a Vec2 is used as a package for 2 results
%define MAT2_GET_EIGENVECTOR_D(m) (m.a + m.d) * (m.a + m.d) + 4 * (m.b * m.c - m.a * m.d)
%define MAT2_GET_EIGENVALUES(m, d) Vec2(((m.a + m.d) + d) / 2,\
                                        ((m.a + m.d) - d) / 2)

func mat2_get_eigenvalues(Mat2 m) Vec2 {
    local d = sqrt(MAT2_GET_EIGENVECTOR_D($m));
    if d == "NaN" {
        return Vec2("NaN", "NaN");
    }

    return MAT2_GET_EIGENVALUES($m, d);
}

# this just checks if a matrix is simply a scalar multiple of the identity matrix, i.e., a scalar matrix
%define MAT2_HAS_PLANE_EIGENVECTORS(m) (m.b == m.c and m.a == 0 and m.d == 0)

# pass in 1 eigenvalue and get the corresponding gradient
%define MAT2_EIGENVECTOR_GRADIENT_FROM_EIGENVAL(m, l) (m.a + m.c - l) / (l - m.b - m.d)
func mat2_eigenvector_gradient_from_eigenval(Mat2 m, l) {
    if MAT2_HAS_PLANE_EIGENVECTORS($m) {
        return SpecialEigenvectorResult.plane;
    }

    return MAT2_EIGENVECTOR_GRADIENT_FROM_EIGENVAL($m, $l);    
}

func mat2_eigenvector_gradients_from_eigenvalues(Mat2 m, Vec2 l) Vec2 {
    if $l == "NaN" {
        return Vec2("NaN", "NaN");
    }

    if MAT2_HAS_PLANE_EIGENVECTORS($m) {
        return Vec2(SpecialEigenvectorResult.plane, SpecialEigenvectorResult.plane);
    }

    return Vec2(MAT2_EIGENVECTOR_GRADIENT_FROM_EIGENVAL($m, $l.x),
                MAT2_EIGENVECTOR_GRADIENT_FROM_EIGENVAL($m, $l.y));
}

func mat2_get_eigenvector_gradients(Mat2 m) Vec2 {
    if MAT2_HAS_PLANE_EIGENVECTORS($m) {
        return Vec2(SpecialEigenvectorResult.plane, SpecialEigenvectorResult.plane);
    }

    local d = sqrt(MAT2_GET_EIGENVECTOR_D($m));
    if d == "NaN" {
        return Vec2("NaN", "NaN");
    }

    local Vec2 eigenvalues = MAT2_GET_EIGENVALUES($m, d);
    return Vec2(MAT2_EIGENVECTOR_GRADIENT_FROM_EIGENVAL($m, eigenvalues.x),
                MAT2_EIGENVECTOR_GRADIENT_FROM_EIGENVAL($m, eigenvalues.y));
}

%define MAT2_TRACE(m) m.a + m.d

func mat2_trace(Mat2 m) {
    return MAT2_TRACE($m);
}

# Get angle from V to C (clockwise) 
%define V2_DIR_TO(V,C) atan (((V.x)-(C.x)) / ((V.y)-(C.y))) + 180 * ((C.y) > (V.y))
func v2_dir_to(Vec2 v, Vec2 c) {return V2_DIR_TO($v, $c);}

# Get angle from V to C (counterclockwise) 
%define V2_DIR_TOCC(V,C) atan (((V.y)-(C.y)) / ((V.x)-(C.x))) + 180 * ((C.x) > (V.x))
func v2_dir_tocc(Vec2 v, Vec2 c) {return V2_DIR_TOCC($v, $c);}

# get clockwise angle
%define V2_DIR(V) atan((V.x) / (V.y)) + 180 * ((V.y) < 0)
func v2_dir(Vec2 v) {return V2_DIR($v);}

# get counter clockwise angle
%define V2_DIRCC(V) atan((V.y) / (V.x)) + 180 * ((V.x) < 0)
func v2_dircc(Vec2 v) {return V2_DIR($v);}

# ignored list
# C7 null space
# C12 inverse orthonormal/orthogonal matrices 5:25
# C12 cramer's rule - just use an inverse matrix or gaussian elimination
# C13 translating a matrix - translate to own, apply own transformation, translate back (multiply these 3 matrices 11:00)

# this would work better if the macro bug is fixed
%define V2_ROT(v, t) MAT2_MUL_V2(MAT2_ROTATION(t), v)
%define V2_ROT_C(v, c, t) V2_ADD(MAT2_MUL_V2(MAT2_ROTATION(t), V2_SUB(v, c)), c)

%define V2_RAND(x, y) Vec2(random(-x,x), random(-y,y))
%define V2_RANDSCR() V2_RAND(240, 180)
