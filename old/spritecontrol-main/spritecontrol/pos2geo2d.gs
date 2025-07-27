# Conversions between geo2d and spritecontrol structs (mostly just pos)

func circle_from_pos(pos p) Circle {
    return Circle{x: $p.x, y: $p.y, r: $p.s};
}
