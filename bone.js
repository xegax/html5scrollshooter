function DragObj(opts)
{
	var obj={x:0, y:0, ofX:0, ofY:0, target:null, start:true, mode:0};
	merge(obj, opts);
	obj.setOffset=function(ofX, ofY)
	{
		if(this.mode==0)
			this.doOffset(ofX, ofY);
		else if(this.mode==1)
			this.doMove(ofX, ofY);
	}
	
	obj.doOffset=function(ofX, ofY)
	{
		this.ofX=ofX;
		this.ofY=ofY;
		if(this.start)
		{
			this.target.x=this.x+ofX;
			this.target.y=this.y+ofY;
			this.target.updatePos();
		}
		else
		{
			this.target.xe=this.x+ofX;
			this.target.ye=this.y+ofY;
			this.target.updateVec();
		}
	}
	
	obj.doMove=function(ofX, ofY)
	{
		this.ofX=ofX;
		this.ofY=ofY;
		this.target.pvy=this.pvy-ofX;
		this.target.pvx=this.pvx+ofY;
		
		if(this.target.parent)
			this.target.parent.updatePos();
	}
	
	obj.keyStateChanged=function()
	{
		var shift=isKeyDown(16);
		if(shift)
			this.mode=1;
		else
			this.mode=0;
		this.setOffset(this.ofX, this.ofY);
	}
	
	obj.onKeyDown=function(key)
	{
		this.keyStateChanged();
	}
	
	obj.onKeyUp=function(key)
	{
		this.keyStateChanged();
	}
	
	selBone=obj.target;
	obj.pvx=obj.target.pvx;
	obj.pvy=obj.target.pvy;
	return obj;
}
	
function Bone(opts)
{
	var bone={x: 0, y: 0, vl: 83, vx: 0, vy: 1, id:0, sprite:new GameObj(), parent:null, childs:[], imgId:"hand", ofY:14, pvx:0, pvy:0, imgAngle:0, animTime:1, frame:-1, keyFrame:-1};
	merge(bone, opts);
	bone.sprite.makeSprite(bone.imgId);
	
	var vn=normVec(bone.vx, bone.vy);
	bone.vx=vn[0];
	bone.vy=vn[1];
	bone.xe=bone.x+bone.vx*bone.vl;
	bone.ye=bone.y+bone.vy*bone.vl;
	bone.updateSprite=function()
	{
		this.sprite.makeSprite(this.imgId);
	}
	bone.render=function()
	{
		var rad=20;
		/*drawCircle([this.x, this.y], rad);
		drawCircle([this.xe, this.ye], rad);
		drawLine([this.x, this.y], [this.xe, this.ye]);
		
		drawLine([this.xe-rad/2, this.ye], [this.xe+rad/2,this.ye]);
		drawLine([this.xe, this.ye-rad/2], [this.xe,this.ye+rad/2]);*/
		
		this.sprite.x=this.x;
		this.sprite.y=this.y;
		this.sprite.ofX=this.sprite.sprite.w/2;
		this.sprite.ofY=this.sprite.sprite.h/2;
		this.sprite.angle=Math.PI*2-vecToAngle(this.vx, this.vy);
		
		var sz=[this.sprite.sprite.w/2, this.sprite.sprite.h/2];
		var from=[this.x+sz[0], this.y+sz[1]];
		var sin=Math.sin(this.sprite.angle);
		var cos=Math.cos(this.sprite.angle);
		
		sz[1]-=this.ofY;
		var to=[from[0]+sin*sz[1], from[1]-cos*sz[1]];
		this.sprite.x-=to[0]-this.x;
		this.sprite.y-=to[1]-this.y;
		this.sprite.angle+=this.imgAngle;
		this.sprite.render();
		
		var n=-1;
		while(++n<this.childs.length)
			this.childs[n].render();
	}
	
	bone.updateVec=function()
	{
		var vec={x: this.xe-this.x, y: this.ye-this.y};
		vec=normVec(vec.x, vec.y);
		this.vx=vec[0];
		this.vy=vec[1];
		this.xe=this.x+this.vx*this.vl;
		this.ye=this.y+this.vy*this.vl;
		
		var n=-1;
		while(++n<this.childs.length)
		{
			var child=this.childs[n];
			child.x=this.xe+this.vx*child.pvx-this.vy*child.pvy;
			child.y=this.ye+this.vy*child.pvx+this.vx*child.pvy;
			child.updatePos();
		}
	}
	
	bone.updatePos=function()
	{
		var vn=normVec(this.vx, this.vy);
		this.xe=this.x+vn[0]*this.vl;
		this.ye=this.y+vn[1]*this.vl;
		
		var n=-1;
		while(++n<this.childs.length)
		{
			var child=this.childs[n];
			child.x=this.xe+this.vx*child.pvx-this.vy*child.pvy;
			child.y=this.ye+this.vy*child.pvx+this.vx*child.pvy;
			child.updatePos();
		}
	}
	
	bone.hitTest=function(pt)
	{
		var rad=20;
		var l1=lenBetween(pt, {x:0, y:0});
		if(l1<rad)
		{
			if(this.parent)
				return null;
				
			return new DragObj({target:this, x:this.x, y:this.y});
		}
		
		var l2=lenBetween(pt, {x:this.xe-this.x, y:this.ye-this.y});
		if(l2<rad)
			return new DragObj({target:this, start:false, x:this.xe, y:this.ye});
			
		var n=-1;
		while(++n<this.childs.length)
		{
			var child=this.childs[n];
			var localPt={x: (pt.x+this.x)-child.x, y: (pt.y+this.y)-child.y};
			var child=child.hitTest(localPt);
			if(!child)
				continue;
			return child;
		}
		return null;
	}
	
	bone.addChild=function(child)
	{
		this.childs.push(child);
		objs.remove(child);
		
		child.x=this.xe;
		child.y=this.ye;
		child.updatePos();
		child.parent=this;
		
		return this;
	}
	
	/*
		[
			[state],
			[
				[child state1],
				...
				[child stateN]
			]
		]
	*/
	bone.getState=function(opts)
	{
		if(typeof opts=="undefined")
			opts={};
			
		if(typeof opts.state=="undefined")
			opts.state=[];
		
		if(typeof opts.base=="undefined")
			opts.base=[];
		
		if(typeof opts.skipChilds=="undefined")
			opts.skipChilds=false;
		
		var arr=[];
		if(this.parent==null)
		{
			arr[0]=parseInt(this.x);
			arr[1]=parseInt(this.y);
		}
		
		var vx=parseInt(this.vx*1000)/1000;
		var vy=parseInt(this.vy*1000)/1000;
		if(opts.base[2]!=vx)
			arr[2]=vx;
			
		if(opts.base[3]!=vy)
			arr[3]=vy;
		
		if(opts.base[4]!=this.imgId)
			arr[4]=this.imgId;
		
		if(this.parent!=null)
		{
			x=parseInt(this.pvx);
			y=parseInt(this.pvy);
			if(x!=opts.base[5])
				arr[5]=x;
			if(y!=opts.base[6])
				arr[6]=y;
		}
		
		opts.state[this.id]=arr;
		
		if(opts.skipChilds)
			return opts.state;
			
		var n=-1;
		while(++n<this.childs.length)
		{
			var child=this.childs[n];
			child.getState(opts);
		}

		return opts.state;
	}
	
	bone.animTo=function(time)
	{
		var n=-1;
		while(++n<this.childs.length)
			this.childs[n].animTo(time);
			
		var st=this.newState;
		var cs=this.currState;
		if(cs.length>0 && st.length>0)
		{
			var pos=animPt([cs[0], cs[1]], [st[0], st[1]], time);
			this.x=pos[0];
			this.y=pos[1];
			
			var pv=animPt([cs[5], cs[6]], [st[5], st[6]], time);
			this.pvx=pv[0];
			this.pvy=pv[1];
			
			var ep=animPt([cs[0]+cs[2]*this.vl, cs[1]+cs[3]*this.vl], [st[0]+st[2]*this.vl, st[1]+st[3]*this.vl], time);
			this.vx=ep[0]-this.x;
			this.vy=ep[1]-this.y;
		}
		
		this.updatePos();
		this.updateVec();
	}
	
	function fromBase(state, base)
	{
		if(typeof base=="undefined")
			return state;
			
		var n=-1;
		while(++n<6)
		{
			if(n >= base.length)
				continue;
				
			if(typeof state[n]=="undefined")
				state[n]=base[n];
		}
		
		return state;
	}
	
	bone.setState=function(state, base)
	{
		if(typeof base=="undefined")
			base=[];
			
		this.newState=fromBase(state[this.id], base[this.id]);
		
		this.currState=this.getState({base: base, skipChilds:true});
		this.currState=fromBase(this.currState[this.id], base[this.id]);
		
		if(this.newState[4]!=this.imgId)
		{
			this.imgId=this.newState[4];
			this.updateSprite();
		}
		
		var n=-1;
		while(++n<this.childs.length)
			this.childs[n].setState(state, base);
	}
	
	bone.updateFrame=function(newState, currState, kf)
	{
		this.newState=newState[this.id];
		this.currState=currState[this.id];
		this.keyFrame=kf;
		
		if(this.currState[4]!=this.imgId)
		{
			this.imgId=this.currState[4];
			this.updateSprite();
		}
		
		var n=-1;
		while(++n<this.childs.length)
			this.childs[n].updateFrame(newState, currState, kf);
	}
	
	bone.setFrame=function(opts)
	{
		n = opts.n;
		seq = opts.seq;
		animTo = opts.animTo;
		
		if(typeof n=="undefined")
			n=0;
			
		if(typeof seq=="undefined")
			seq=new sjs.List();
		
		if(typeof animTo=="undefined")
			animTo=true;
			
		var fn = seq.length-1;
		n = n%fn;
		var kf=Math.floor(n);
		var nextFrame=(kf+1)%fn;
		if(kf!=this.keyFrame)
			this.updateFrame(seq[kf].data, seq[nextFrame].data, kf);
		
		if(animTo==false)
			return;
			
		var time=n-kf;
		this.animTo(time);
	}
	
	bone.makeIds=function(opts)
	{
		if(typeof opts=="undefined")
			opts={nextId:0};
		this.id=opts.nextId;
		opts.nextId++;
		
		var n=-1;
		while(++n<this.childs.length)
		{
			var child=this.childs[n];
			child.makeIds(opts);
		}
	}
	
	objs.add(bone);
	return bone;
}