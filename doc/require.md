# Requirements for the project

## Application properties

* $APP_NAME: app name (site title, etc);
* $APP_DESC: app description (homepage, manifest);
* favicon (ICO);
* PWA manifest:
    * background_color
    * description
    * icons (PNG, 180x180, 192x192, 512x512)
    * name
    * short_name
    * theme_color

## Questions

* What is a type of the app: personal usage of public? Where should we save data - IDB (front) or RDB (back)?
* What is the limit for an image size?
* What is the limit for total images count?
* Should we store original titles or can we change it to lower case?
* Should we store original filenames?
* How should we inform user about events ('file is uploaded' or on error)?
* What should be an order for images in the result list (by id desc)?
* What is a preferred control mode: keyboard, mouse or taps?