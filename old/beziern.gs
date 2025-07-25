# Infinite bezier (as many control points as you want)
# Binomial function is seperated into the binomial.gs file
struct Node {x, y}
################################################################
list Node de_casteljau_pts;
list Node _get_casteljau;
func get_casteljau(t) Node {
    delete _get_casteljau;
    local i = 1;
    repeat length de_casteljau_pts {
        add de_casteljau_pts[i] to _get_casteljau;
        i++;
    }

    local l = "";
    until l == 2 {
        l = length _get_casteljau;

        repeat length _get_casteljau - 1 {
            add nodes_lerp(_get_casteljau[1], _get_casteljau[2], $t) to _get_casteljau;
            delete _get_casteljau[1];
        }
        delete _get_casteljau[1];
    }
    return _get_casteljau[1];
}
