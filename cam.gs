# meant to be used with node.gs
# allows for converting a camera-like system to a node, which can be appeneded

%define CAM_RESET pos CAM = pos(0, 0, 1, 0)
%define CAM_MAT_RESET CAM_RESET; Mat2 CMATRIX = Mat2(1, 0, 0, 1)

%define NODE_CAM node_add_pos(pos(-CAM.x, -CAM.y, CAM.s, CAM.d))
%define NODE_CAM_MAT node_add_posm pos(-CAM.x, -CAM.y, CAM.s, CAM.d), CMATRIX

onflag {
    CAM_MAT_RESET;
}
