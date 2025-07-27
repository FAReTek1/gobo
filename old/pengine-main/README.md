  # pengine.gs
  This is a pen engine which is built for [goboscript](https://github.com/aspizu/goboscript).
  It is designed to be used with [backpack](https://github.com/aspizu/backpack)
  
  ## Installation
  To use this, make sure to install [backpack](https://github.com/aspizu/backpack)
  
  You can use the pengine library by adding these lines to goboscript.toml:
  ```toml
  [dependencies]
  pengine = "https://github.com/FAReTek1/pengine@<the version you want to use>"
  ```
  
  Then, add this %include to your gs file:
  you can also use this to just %include everything
  ```rs
  %include backpack/pengine/pengine
  ```