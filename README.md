# Detect WebM Alpha Support

This JavaScript component provides a concise and efficient way to detect whether the current browser supports WebM video files with alpha channels.

## Method

There are multiple ways that a browser might not support WebM video files with alpha. The big one is that it might support WebM files but not process alpha data. I'm looking at you Safari (in 2024).

This function is based on an approach in the following Stack Overflow question:

https://stackoverflow.com/questions/29416579/how-to-feature-detect-if-browser-supports-webm-alpha-transparency

This approach embeds a tiny test WebM file that has alpha data in it, and it uses `<canvas>` to test it. `Canvas` objects conveniently support drawing from a `<video>` directly onto the canvas.

`detect_webm_alpha.js` builds upon this approach in the following ways:

* It uses a JavaScript `Promise` to return the result asynchronously.
* It composites a video with (128, 128, 128, 128) pixels onto a (255, 255, 255) background.

The gray test video with a white background allows us to detect the following circumstances:

* If proper alpha blending occurs, then the pixels will have a value about halfway between 128 and 255.
* If the browser supports WebM files but doesn't process their alpha data, then the pixels will have been overwritten with a component value of 128.
* If the browser doesn't support WebM files (but thinks it does), and as a result the request to draw the video frame _does nothing_, then the pixels will still have the background component value of 255.
* The StackOverflow answer has a comment from @Luixo indicating that some versions of IE11 don't implement `ImageData.data` and just return dummy data with 0 values. I don't know that IE11 is at all relevant any more, but factoring this detail in doesn't cost us anything. :-)

## Usage

To use this library, you need to import the code into your web page with HTML something like this:
```
<script src="detect_webm_alpha.js" type="text/javascript"></script>
```
The `DetectWebMAlpha` function requires that `document.body` be realized, so it cannot be called immediately. It can be used like this:
```
<script type="text/javascript">
	window.addEventListener(
		"load",
		() =>
		{
			DetectWebMAlpha()
				.then(() => alert("'sall good, man"), () => alert("that's a no, joe bloe"));
		});
</script>
```
Place your code that requires WebM with alpha support into the `Promise`'s `onFulfilled` callback. The `onRejected` callback can be used if you need to explicitly handle the case where it is not supported, or it can simply be omitted and ignored.
