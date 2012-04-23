function merge(dst, src)
{
	for(var n in src)
		dst[n]=src[n];
}

function getTimer()
{
	return new Date().getTime();
}

function getMousePos(e, relative)
{
	var rX=0;
	var rY=0;
	if(relative)
	{
		rX=relative.offsetLeft;
		rY=relative.offsetTop;
	}
	return {x: e.clientX-rX, y: e.clientY-rY};
}