# Functions to do with the Lambert W function. (needs to be improved)

func lambert_w_approx(x){ # Very inaccurate but 'faster' lambert w approximation
    return ln($x / ln($x / ln($x / ln($x / ln($x / ln($x / ln($x)))))));
}
