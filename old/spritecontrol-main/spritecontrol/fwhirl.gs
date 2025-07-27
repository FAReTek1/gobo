# Fisheye & whirl calculations.
# If you want fisheye 3D or a fisheye stretch, you will want the cosfx package (not released as of 30/1/2025)

################################################################
# fisheye

%define NORM_FISHEYE(f) (((f) + 100) / 100)

%define DENORM_FISHEYE(f) ((f) * 100 - 100)

func apply_fisheye(f, Polar p) Polar {
    return Polar{
        r: POW(2 * $p.r, 1 / NORM_FISHEYE($f)) / 2,
        t: $p.t
    };
}

func inverse_fisheye(Polar old, Polar new) {
    return DENORM_FISHEYE((ln(2 * $old.r) / ln(2 * $new.r)));
}

################################################################
# whirl

%define NORM_WHIRL(w) ((w) * 0.01745329251) # pi / 180

%define DENORM_WHIRL(w) ((w) / 0.01745329251)

func apply_whirl(w, Polar p) Polar {
    return Polar{
        r: $p.r,
        t: $p.t - NORM_WHIRL($w) * antiln(0.6931471805599453 - 1.3862943611198906 * $p.r) # 1 - 2r^2
    };
}

func inverse_whirl(Polar old, Polar new) {
    return DENORM_WHIRL(($old.t - $new.t) / antiln(0.6931471805599453 - 1.3862943611198906 * $old.r));
}
