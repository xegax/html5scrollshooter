//1. задан fn = 1 - w и h вычисляются
//2. задан w и h - rn, cn, fn вычисляется
//3. не задан src - src = img/name.png
function AnimMgr()
{
	var mgr={};
	AnimMgrGet=function()
	{
		return mgr;
	}
	
	mgr.graph=[];
	mgr.get=function(name)
	{
		var ref=this.graph[name];
		if(ref && !ref.frameInfo)
			ref.frameInfo=function(n)
			{
				n=Math.min(n,this.fn);
				var rn=parseInt(n/this.cn);
				var cn=n-rn*this.cn;
				return {x: cn*this.w, y:rn*this.h, w:this.w, h:this.h, num:this.fn};
			}
		return ref;
	}
	
	mgr.add=function(name, opts)
	{
		var graph=this.graph;
		graph[name]=opts;
	}
	
	mgr.load=function(callback)
	{
		var graph=mgr.graph;
		
		var imgs=[];
		for(var name in graph)
		{
			if(typeof graph[name]==="function")
				continue;
				
			var g=graph[name];
			if(!g['src'])
				g.src="img/"+name+".png";
			imgs.push(g.src);
			if(!g['fn'] && !g['rn'] && !g['cn'] && !g['w'] && !g['h'])
			{
				g.fn=1;
				g.rc=1;
				g.cn=1;
			}
		}
		
		rootScene.loadImages(imgs, function()
		{
			for(var name in graph)
			{
				if(typeof graph[name]==="function")
					continue;
					
				var g=graph[name];
				var spr=rootScene.Sprite(g.src);
				if(g['fn']==1 && !g['w'] && !g['h'])
				{
					g.w=spr.w;
					g.h=spr.h;
				}
				else if(!g['fn'] && g['w'] && g['h'])
				{
					g.cn=spr.w/g.w;
					g.rn=spr.h/g.h;
					g.fn=g.cn*g.rn;
				}
				else if(g['fn'] && !g['w'] && !g['h'])
				{
					if(spr.w>spr.h)
					{
						g.rn=1;
						g.cn=g.fn;
						g.w=spr.w/g.fn
						g.h=spr.h;
					}
					else
					{
						g.cn=1;
						g.rn=g.fn;
						g.h=spr.h/g.fn
						g.w=spr.w;
					}
				}
				else if(g['rn'] && g['cn'] && !g['w'] && !g['h'])
				{
					g.w=spr.w/g.cn;
					g.h=spr.h/g.rn;
					
					if(!g['fn'])
						g.fn=g.cn*g.rn;
					g.fn=Math.min(g.cn*g.rn, g.fn);
				}
				
				spr.remove();
			}
			
			if(callback)
				callback();
		});
	}
	
	return mgr;
}