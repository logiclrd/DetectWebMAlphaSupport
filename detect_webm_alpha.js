//
// detect_webm_alpha.js -- https://github.com/logiclrd/DetectWebMAlphaSupport/
//
function DetectWebMAlpha()
{
	return new Promise(
		(resolve, reject) =>
		{
			try
			{
				var video = document.createElement("video");
		
				video.autoplay = false;
				video.loop = false;
				video.style.display = "none";

				function AddElement() { document.body.appendChild(video); }
				function RemoveElement() { document.body.removeChild(video); }
		
				video.addEventListener(
					"loadeddata",
					function()
					{
						RemoveElement();

						// Try compositing the video within a canvas.
						var canvas = document.createElement("canvas");

						var context = canvas.getContext && canvas.getContext("2d");

						if (!context)
						{
							// If we don't support <canvas> then we definitely don't support WebM with alpha.
							reject();
						}
						else
						{
							// Fill the frame with solid white.
							context.fillStyle = "white";
							context.rect(0, 0, 64, 64);
							context.fill();

							// Draw a frame of the video.
							context.drawImage(video, 0, 0);

							// Check that the video was composited correctly.
							var topLeftPixel = context.getImageData(2, 2, 1, 1);

							var blendResult = topLeftPixel.data[0];

							// If alpha is supported, then we've just blended 50% of (128, 128, 128) onto
							// (255, 255, 255). The result will lie about halfway between 128 and 255.
							// If the result is 255, then the drawImage call had no effect. If the result
							// is 128, then the drawImage call didn't process alpha and just replaced the
							// pixels. Apparently, in some non-supporting IE versions, the result might
							// also be 0, presumably because getImageData doesn't actually function.
							//
							// Safari, naturally, does its own thing and produces pixels with a value of
							// 138 or 139. The correct blended result is 191 or 192.
							if ((blendResult > 180) && (blendResult < 200))
								resolve();
							else
								reject();
						}
					});

				video.addEventListener("error", () => { RemoveElement(); reject(); });
				video.addEventListener("stalled", () => { RemoveElement(); reject(); });
				video.addEventListener("abort", () => { RemoveElement(); reject(); });

				var source = document.createElement("source");

				source.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAIREU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHYTbuMU6uEElTDZ1OsggEpTbuMU6uEHFO7a1OsggH77AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmsirXsYMPQkBNgI1MYXZmNjAuMTYuMTAwV0GNTGF2ZjYwLjE2LjEwMESJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgVQM9yjABNrpyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBQLqBQJqBAlPAgQFVsIRVuYEBElTDZ0CAc3OgY8CAZ8iaRaOHRU5DT0RFUkSHjUxhdmY2MC4xNi4xMDBzc9pjwItjxYgVQM9yjABNrmfIpUWjh0VOQ09ERVJEh5hMYXZjNjAuMzEuMTAyIGxpYnZweC12cDlnyKFFo4hEVVJBVElPTkSHkzAwOjAwOjAwLjA0MDAwMDAwMAAfQ7Z1x+eBAKDCoZ+BAAAAgkmDQgAD8AP2ADgkHBhKAAAwYAAAE7gYAAAAdaGeppzugQGll4JJg0IAA/AD9gA4JBwYSgAAMGAAAE+AHFO7a5G7j7OBALeK94EB8YIBr/CBAw==";

				source.addEventListener("error", (q) => { RemoveElement(); reject(); });

				video.appendChild(source);

				AddElement();
			}
			catch (e)
			{
				reject(e);
			}
		});
}
