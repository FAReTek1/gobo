# Functions for prime number stuff

################################################################
# Sieves
# https://www.geeksforgeeks.org/sieve-of-atkin/
list atkin_primes;
list sieve_of_atkin;
proc sieve_of_atkin limit {
    # 2 and 3 are known
    # to be prime
    if $limit > 2 {
        add 2 to atkin_primes;
        if $limit > 3 {
            add 3 to atkin_primes;
        }
    }

    # Initialise the sieve
    # array with False values
    delete atkin_primes;
    delete sieve_of_atkin;

    repeat $limit {add false to sieve_of_atkin;}

    # Mark sieve[n] is True if
    # one of the following is True:

    # a) n = (4*x*x)+(y*y) has odd
    #    number of solutions, i.e.,
    #    there exist odd number of
    #    distinct pairs (x, y) that
    #    satisfy the equation and
    #    n % 12 = 1 or n % 12 = 5.

    # b) n = (3*x*x)+(y*y) has
    #    odd number of solutions
    #    and n % 12 = 7

    # c) n = (3*x*x)-(y*y) has
    #    odd number of solutions,
    #    x > y and n % 12 = 11

    local i = 1;
    until (i * i) > $limit {
        local j = 1;
        until (j * j) > $limit {
            # Main part of
            # Sieve of Atkin
            local cmp = 4 * i * i + j * j;
            if cmp <= $limit and (cmp % 12 == 1 or cmp % 12 == 5) {
                sieve_of_atkin[cmp] = not sieve_of_atkin[cmp];
            }

            cmp = 3 * i * i + j * j;
            if cmp <= $limit and cmp % 12 == 7 {
                sieve_of_atkin[cmp] = not sieve_of_atkin[cmp];
            }

            cmp = 3 * i * i - j * j;
            if cmp <= $limit and i > j and cmp % 12 == 11 {
                sieve_of_atkin[cmp] = not sieve_of_atkin[cmp];
            }

            j ++;
        }
        i ++;
    }

    # Mark all multiples of
    # squares as non-prime
    local i = 5;
    until (i * i) > $limit {
        if sieve_of_atkin[i] {
            local sq = i * i;
            until sq > $limit {
                sieve_of_atkin[sq] = false;
                sq += i * i;                
            }
        }
        i ++;
    }
    
    # Return primes
    # using sieve[]

    i = 1;
    repeat length sieve_of_atkin{
        if sieve_of_atkin[i] {
            add i to atkin_primes;
        }
        i++;
    }
}
