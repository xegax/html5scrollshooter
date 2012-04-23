function AnimCtrlr(opts)
{
	var obj={list:[]};
	merge(obj, opts);
		
	obj.animate=function(bone, newState, time, base)
	{
		bone.setState(newState, base);
		
		var idx=this.list.indexOf(bone);
		if(idx==-1)
		{
			this.list.push(bone);
			if(bone.__anim__)
				throw "__anim__ already defined";
		}

		bone.__anim__={startTime: getTimer(), delta: time};
	}
		
	obj.doAnimate=function()
	{
		var n=this.list.length;
		while(--n>=0)
		{
			var bone=this.list[n];
			var elapsed=(getTimer()-bone.__anim__.startTime)/bone.__anim__.delta;
			elapsed=Math.min(1, elapsed);
			bone.animTo(elapsed);
			if(elapsed>=1)
			{
				this.list.splice(n, 1);
				delete bone.__anim__;
			}
		}
	}
		
	obj.timerId=setInterval(function()
	{
		obj.doAnimate();
	}, 10);
	return obj;
}