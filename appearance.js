var prevVals=[];
function saveValue(key, value)
{
	if((typeof value) != "string")
		value = JSON.stringify(value);
	if(prevVals[key]==value)
		return;
		
	prevVals[key]=value;
	
	$.ajax({url: "appr.php?key="+key+"&act=set", type:"POST", data: value}).done(function(msg){});
}

function removeNulls(arr)
{
	for(var k in arr)
	{
		v=arr[k];
		if(typeof v=="object" && v===null)
			delete arr[k];
		else if(v instanceof Array)
			removeNulls(v);
		else if(v instanceof Object)
			removeNulls(v);
	}
}
	
function loadValue(key, callback)
{
	$.ajax({url:"appr.php?key="+key+"&act=get"}).done(function(msg)
	{
		var arr=JSON.parse(msg);
		removeNulls(arr);
		callback(arr);
	}).error(function()
	{
		$.ajax({url:"animData.js"}).done(function(msg)
		{
			var arr=JSON.parse(msg);
			removeNulls(arr);
			callback(arr);
		});
	});
}