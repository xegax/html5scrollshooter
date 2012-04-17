function saveValue(key, value)
{
	if((typeof value) != "string")
		value = JSON.stringify(value);
	$.ajax({url: "appr.php?key="+key+"&act=set", type:"POST", data: value}).done(function(msg){});
}

function loadValue(key, callback)
{
	$.ajax({url:"appr.php?key="+key+"&act=get"}).done(function(msg)
	{
		callback(JSON.parse(msg));
	}).error(function()
	{
		$.ajax({url:"animData.js"}).done(function(msg)
		{
			callback(JSON.parse(msg));
		});
	});
}