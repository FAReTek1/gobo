%include ..\gamma
%include std\string

# this is bad
func choose(n, k) {
    return gamma($n + 1) / (gamma($k + 1) * gamma($n - $k + 1));
}

# Since we need a 2d list, we use a list of strings whose elements are comma delimeted. The inner elements won't have commas themselves.
list _binomial_lut = [
      "1",
     "1,1",
    "1,2,1",
   "1,3,3,1",
  "1,4,6,4,1",
 "1,5,10,10,5,1",
"1,6,15,20,15,6,1",
];

list _binomial_lut_gen;

# TODO: stop using split and JOIN here
func binomial(n, k) {
    until $n <= length _binomial_lut {
        delete _binomial_lut_gen;
        local prev = _binomial_lut["last"];

        split prev, ","; # This outputs to the split list

        local i = 1;
        repeat length split + 1 {
            add split[i - 1] + split[i] to _binomial_lut_gen;
            i++;
        }

        local store = "";
        JOIN(_binomial_lut_gen, ",", store)
        add store to _binomial_lut;
    }
    split _binomial_lut[$n], ",";
    return split[$k];
}
