%include ..\sdf
%include ..\assert

proc test_sdf {
    Vec2 a = Vec2(2, 5);
    Vec2 b = Vec2(3, 8);

    assert_eq SDF_V2(a, b), 3.1622776601683795;
    assert_eq sdf_v2(a, b), 3.1622776601683795;
}

%if RUN_TEST_MODULE
onflag {test_sdf;}
%endif
