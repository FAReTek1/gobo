# std.gs
This is a standard library which is built upon [goboscript](https://github.com/aspizu/goboscript)'s [original standard library](https://github.com/aspizu/goboscript/tree/523b4aa68530e504c125d48121307430db6a236f/std).
It is designed to be used with [backpack](https://github.com/aspizu/backpack)

## Installation
To use this, make sure to install [backpack](https://github.com/aspizu/backpack)

You can use the standard library by adding these lines to goboscript.toml:
```toml
[dependencies]
std = "https://github.com/FAReTek1/std@<the version you want to use>"
```

Then, add this %include to your gs file:
```rs
%include backpack/std/std/<std module you want to use>
```
you can also use this to just %include everything
```rs
%include backpack/std/std
```
