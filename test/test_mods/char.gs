%include ..\char
%include ..\assert

proc test_char {
    assert_eq ord("a"), 97;
    assert_eq ord("A"), 65;

    assert_eq chr(64), "@";

    assert chr_islower("a");
    assert_f chr_islower("A");

    assert chr_isupper("A");
    assert_f chr_isupper("a");

    assert chr_check("a", "a");
    assert_f chr_check("a", "A");

    assert chr_check(chr_upper("a"), "A");
    assert_f chr_check(chr_upper("a"), "a");

    assert chr_check(chr_lower("A"), "a");
    assert_f chr_check(chr_lower("A"), "A");
}

%if RUN_TEST_MODULE
onflag {test_char;}
%endif
