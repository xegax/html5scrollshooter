function drawLine(from, to, opts)
{
	var width=1;
	var color='#000000';
	var ctx=rootScene.layers.default.ctx;
	
	ctx.save();
	ctx.lineWidth = width;
	ctx.strokeStyle=color;
	ctx.beginPath();
	ctx.moveTo(from[0],from[1]);
	ctx.lineTo(to[0], to[1]);
	ctx.stroke();
	ctx.restore();
}

function drawCircle(center, radius, opts)
{
	var width=1;
	var color='#000000';
	var ctx=rootScene.layers.default.ctx;
	
	ctx.save();
	ctx.lineWidth = width;
	ctx.strokeStyle=color;
	
	ctx.beginPath();
	ctx.arc(center[0],center[1],radius,0,Math.PI*2,true);
	ctx.stroke();
	ctx.restore();
}