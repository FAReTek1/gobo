# spritecontrol.gs
This is a sprite control library which is built for [goboscript](https://github.com/aspizu/goboscript).
It is designed to be used with [backpack](https://github.com/aspizu/backpack)

## Installation
To use this, make sure to install [backpack](https://github.com/aspizu/backpack)

You can use the spritecontrol library by adding these lines to goboscript.toml:
```toml
[dependencies]
spritecontrol = "https://github.com/FAReTek1/spritecontrol@<the version you want to use>"
```

Then, add this %include to your gs file:
you can also use this to just %include everything
```rs
%include backpack/spritecontrol/spritecontrol
```