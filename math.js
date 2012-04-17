function degAngle(a)
{
	return a*Math.PI/180;
}

function vecToAngle(vx, vy)
{
	var len=Math.sqrt(vx*vx+vy*vy);
	if(len>1)
	{
		vx/=len;
		vy/=len;
	}
	if(vx==0)
		vx=0.000001;
	var a=Math.atan(vy/vx)+Math.PI/2;
	a=Math.PI*2-a;
	if(vx>0)
		a+=Math.PI;
		
	while(a<0)
		a+=Math.PI*2;
	while(a>Math.PI*2)
		a-=Math.PI*2;
	return a;
}

function normVec(vx, vy)
{
	var len=Math.sqrt(vx*vx+vy*vy);
	return [vx/len, vy/len];
}

function lenBetween(pt1, pt2)
{
	var x=pt1.x-pt2.x;
	var y=pt1.y-pt2.y;
	return Math.sqrt(x*x+y*y);
}

function animPt(src, dst, time)
{
	var vec=[dst[0]-src[0], dst[1]-src[1]];
	var len=Math.sqrt(vec[0]*vec[0]+vec[1]*vec[1]);
	if(vec[0]==0 && vec[1]==0)
		return [src[0], src[1]];
	vec=normVec(vec[0], vec[1]);
	return [src[0]+vec[0]*len*time, src[1]+vec[1]*len*time];
}