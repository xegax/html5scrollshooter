function GameObj(opts)
{
	var obj={x:0, y:0, w:32, h:32, scale:1, angle:0, sprite:null, vx: 0, vy:0, shown: false, alpha:1};
	merge(obj, opts);
	
	obj.live=true;
	obj.id=idCounter++;
	obj.ofX=0;
	obj.ofY=0;
	obj.childs=[];
	obj.parent=null;
	
	obj.render=function()
	{
		if(this.sprite==null)
			return;
		
		var xOrig=0;
		var yOrig=0;
		if(this.parent!=null)
		{
			var ap=this.parent.getAbsPos();
			xOrig=ap[0];
			yOrig=ap[1];
		}
		
		this.sprite.position(xOrig+(this.x-this.sprite.w/2+this.ofX), yOrig+(this.y-this.sprite.h/2+this.ofY));
		this.sprite.setAngle(/*Math.PI*3-*/this.angle);
		this.sprite.scale(this.scale);
		this.sprite.setOpacity(this.alpha);
		this.sprite.update();
		
		
		drawCircle({x:this.x, y:this.y}, 10);
		var n=-1;
		while(++n<this.childs.length)
		{
			var child=this.childs[n];
			child.updateSprite();
			child.alpha=this.alpha;
		}
	}
	

	obj.makeSprite=function(img, scene, layer)
	{
		if(!scene)
			scene=rootScene;
			
		if(this.sprite!=null)
			this.sprite.remove();
		
		this.anim=animMgr.get(img);
		this.sprite=scene.Sprite(this.anim.src, layer);
		
		var f=this.anim.frameInfo(0);
		this.frames=f.num;
		this.sprite.size(f.w, f.h);
	}
	obj.updateVector=function()
	{
		this.vx=Math.sin(this.angle);
		this.vy=Math.cos(this.angle);
	}
	
	obj.doRemove=function(time)
	{
		this.live=false;
		
		this.sprite.remove();
		objs.remove(this);
	}
	
	obj.intersect=function(x_, y_, w_, h_)
	{
		var x2 = Math.min(this.x+this.w, x_+w_);
		var y2 = Math.min(this.y+this.h, y_+h_);
		x_ = Math.max(this.x, x_);
		y_ = Math.max(this.y, y_);
		
		w_=x2-x_+1;
		h_=y2-y_+1;
		return w_>0 && h_>0;
	}
	
	obj.getTurnAngle=function(newAngle, turnSpeed)
	{
		var na=newAngle-this.angle;
		if(na<0)
			na+=Math.PI*2;
		else if(na>Math.PI*2)
			na-=Math.PI*2;
		
		if(na>Math.PI)
			return this.angle-turnSpeed;
		return this.angle+turnSpeed;
	}
	
	obj.addChild=function(child)
	{
		this.childs.push(child);
		child.parent=this;
		objs.remove(child);
		return child;
	}
	
	obj.getAbsPos=function()
	{
		var pos=[this.x+this.ofX, this.y+this.ofY];
		
		var p=this.parent;
		while(p!=null)
		{
			pos[0]+=p.x+p.ofX;
			pos[1]+=p.y+p.ofY;
			p=p.parent;
		}
		
		return pos;
	}
	
	obj.hitTest=function(pt)
	{
		return null;
		n=-1;
		while(++n<this.childs.length)
		{
			var child=this.childs[n];
			var localPt={x: pt.x-child.x, y: pt.y-child.y};
			child=child.hitTest(localPt);
			if(!child)
				continue;
			return child;
		}
		
		var hit=Math.abs(pt.x)<this.w/2 && Math.abs(pt.y)<this.h/2;
		if(hit)
			return this;
		return null;
	}
	
	objs.add(obj);
	return obj;
}