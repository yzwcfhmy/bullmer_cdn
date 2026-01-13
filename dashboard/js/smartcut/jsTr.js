// 裁剪Str
function cutstr(str, len) {
	var str_length = 0;
	var str_len = 0;
	str_cut = new String();
	str_len = str.length;
	for (var i = 0; i < str_len; i++) {
		a = str.charAt(i);
		str_length++;
		if (escape(a).length > 4) {
			//中文字符的长度经编码之后大于4
			str_length++;
		}
		str_cut = str_cut.concat(a);
		if (str_length >= len) {
			str_cut = str_cut.concat("..");
			return str_cut;
		}
	}
	//如果给定字符串小于指定长度，则返回源字符串；
	if (str_length < len) {
		return str;
	}
}
// 计算长度
function getLength(str) {
	var str_length = 0;
	var str_len = 0;
	str_cut = new String();
	str_len = str.length;
	for (var i = 0; i < str_len; i++) {
		a = str.charAt(i);
		str_length++;
	}
	return str_length;
}
// 执行ajax
function sendRequest(options) {
	$.ajax({
		url: options.url,
		type:options.type,
		contentType:options.contentType,
		dataType:options.dataType,
		data:options.data,
		error: options.error,
		success:options.getresult,
		async: true
	});
}

// 时间段选择器
function chooseTime(time){
	switch(time)
	{
		case 0:
		case 1:
			return 0;
			break;
		case 2:
		case 3:
			return 1;
			break;
		case 4:
		case 5:
			return 2;
			break;
		case 6:
		case 7:
			return 3;
			break;
		case 8:
		case 9:
			return 4;
			break;
		case 10:
		case 11:
			return 5;
			break;
		case 12:
		case 13:
			return 6;
			break;
		case 14:
		case 15:
			return 7;
			break;
		case 16:
		case 17:
			return 8;
			break;
		case 18:
		case 19:
			return 9;
			break;
		case 20:
		case 21:
			return 10;
			break;
		case 22:
		case 23:
			return 11;
			break;
		default:
			return 0;
			break;

	}
}
// 保留小数函数封装
function fomatFloat(src,pos){
	return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
}

function Lidestroy(){
	$wrap.liMarquee('destroy');
}

// 计算距离对应的圆圈
function distanceCalcu(dis) {
	if (dis >= 0 && dis < 10) {
		return 10
	} else if (dis >= 10 && dis < 100) {
		return 100
	} else if (dis >= 100 && dis < 1000) {
		return 1000
	}else if (dis >= 1000 && dis < 5000){
		return 5000
	}else{
		return 10000
	}
}

$(window).load(function() {
	$(".loading").fadeOut()
})


$( Echart = function() {
	// 左下角七日四大时间
	echarts_1();
	// 最新10次的速度
	echarts_2();
	// 有效利用率
	echarts_3();
	// 时段产量
	echarts_4();
	// 磨损程度测定 设备保养维护
	echarts_5();
	// 右下角单日时间分布图
	echarts_6();
	zb1();
	zb2();
	zb3();
	// 显示当前版图名称
	DangQianBantu();
	// 左侧清单滚动页面
	LeftListRoll();
	// 右侧页面
	RightRank();

	// 左下角七日四大时间
	function echarts_1() {

		var crossTime;
		var cutTime;
		var pauseTime;
		var cutEmptyTime;
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('echart1'));

		myChart.showLoading();

		// 定义传入的东西

		var param = {}
		param.crossTime = $("#crossTime").val();
		param.cutTime = $("#cutTime").val();
		param.pauseTime = $("#pauseTime").val();
		param.cutEmptyTime = $("#cutEmptyTime").val();

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4CutTime",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
				// 回调函数区域
				//响应成功后回调函数
				//alert("收到响应");
				crossTime = data.crossTime;
				cutTime = data.cutTime;
				pauseTime = data.pauseTime;
				cutEmptyTime = data.cutEmptyTime;
				//alert(cutEmptyTime);
				option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						},
						formatter: function(params) {
							// 格式化tooltip显示，保留两位小数
							var result = params[0].name + ' : ';
							if(params[0].data && params[0].data.value) {
								result += parseFloat(params[0].data.value).toFixed(2) + ' min';
							} else {
								result += '0.00 min';
							}
							return result;
						},
						textStyle: {
							fontSize: 16
						}
					},
					legend: {
						right: 0,
						top: 30,
						height: 160,
						itemWidth: 10,
						itemHeight: 10,
						itemGap: 10,
						textStyle: {
							color: 'rgba(255,255,255,.6)',
							fontSize: 20
						},
						orient: 'vertical',
						data: ['Kesim Demosu', 'Pozisyonlama', 'Aktarma', 'Kesim']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '15%', // 增加底部边距，为标签留出空间
						containLabel: true
					},
					xAxis: {
						type: 'category',
						data: ['Kesim Demosu', 'Pozisyonlama', 'Aktarma', 'Kesim'],
						axisLabel: {
							color: 'rgba(255,255,255,.6)',
							interval: 0, // 强制显示所有标签
							rotate: 30, // 标签旋转30度，防止重叠
							fontSize: 12
						}
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							color: 'rgba(255,255,255,.6)',
							formatter: '{value} min'
						}
					},
					series: [{
						name: 'Time Distribution',
						type: 'bar',
						data: [
							{
								value: parseFloat(cutEmptyTime || 0).toFixed(2),
								name: 'Kesim Demosu',
								itemStyle: {
									color: '#ff806c'
								}
							},
							{
								value: parseFloat(pauseTime || 0).toFixed(2),
								name: 'Pozisyonlama',
								itemStyle: {
									color: '#00eeff'
								}
							},
							{
								value: parseFloat(crossTime || 0).toFixed(2),
								name: 'Aktarma',
								itemStyle: {
									color: '#ffff00'
								}
							},
							{
								value: parseFloat(cutTime || 0).toFixed(2),
								name: 'Kesim',
								itemStyle: {
									color: '#00aaff'
								}
							}
						],
						barWidth: '60%',
						label: {
							show: true,
							position: 'top',
							formatter: function(params) {
								// 柱子上方标签保留两位小数
								if(params.data && params.data.value) {
									return parseFloat(params.data.value).toFixed(2) + ' min';
								}
								return '0.00 min';
							},
							color: 'white',
							fontSize: 12
						},
						itemStyle: {
							barBorderRadius: 5
						}
					}]
				};
				myChart.setOption(option);

				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
		// 执行Ajax
		// setTimeout('sendRequest(options)',500);
		// 定时刷新
		setInterval(function() {
			sendRequest(options);
		}, 30000);
		window.addEventListener("resize", function() {
			myChart.resize();
		});

		sendRequest(options);
	}

	// 最新10次的速度
	function echarts_2() {

		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('echart2'));

		var speedList = [];

		myChart.showLoading();

		// 定义传入的东西

		var param = {}
		param.sendSpeedList = $("#sendSpeedList").val();

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4Last10Speed",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
				// 回调函数区域
				//响应成功后回调函数
				if (data){
					speedList = [];
					for (var i = 0; i < data.length; i++) {
						speedList.push(data[i]);
						// alert(speedList[i]);
					}
				}
				console.log(speedList);
				option = {
					textStyle: {
						color: '#ffffff'
					},
					title: {
						text: 'Son Kesim Hızı： ' + speedList[0] + 'M/min',

						textStyle: {
							fontWeight: 'normal',              //标题颜色
							color: '#ffffff'
						}
					},
					tooltip: {},
					legend: {
						data: ['Kesim Hızı'],
						textStyle: {
							fontWeight: 'normal',              //标题颜色
							color: '#ffffff'
						}
					},
					xAxis: {
						// inverse:true,
						data: ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50']
					},
					yAxis: {

					},
					series: [{
						type: 'line',
						smooth: true,
						data: speedList,
						color:  [ '#15ff00'],
						areaStyle: {
							color: '#91ff66',
							opacity: 0.3
						},
						itemStyle : {
							normal: {
								label : {
									show: true
								}
							}
						}
					}]
				};
				// 指定图表的配置项和数据
				myChart.setOption(option);
				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
		// 执行Ajax
		// setTimeout('sendRequest(options)',500);
		// 定时刷新
		setInterval(function() {
			sendRequest(options);
		}, 30000);
		sendRequest(options);

		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}

	// 右下角单日时间分布图
	function echarts_6() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('echart6'));

		var param = {}
		param.cuttime = $("#cuttime").val();
		param.bitetime = $("#bitetime").val();
		param.secondarytime = $("#secondarytime").val();
		param.breaktime = $("#breaktime").val();
		param.aborttime = $("#aborttime").val();

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4CutToday",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {

				option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						},
						formatter: function(params) {
							// 格式化tooltip显示，保留两位小数
							var result = params[0].name + ' : ';
							if(params[0].data && params[0].data.value) {
								result += parseFloat(params[0].data.value).toFixed(2) + ' min';
							} else {
								result += '0.00 min';
							}
							return result;
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						data: ['Interruption', 'Break', 'Cutting', 'Bitefeed', 'SecondaryT'],
						axisLabel: {
							color: 'rgba(255,255,255,.6)',
							interval: 0, // 强制显示所有标签
							rotate: 30, // 标签旋转30度，防止重叠
						}
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							color: 'rgba(255,255,255,.6)',
							formatter: '{value} min'
						}
					},
					series: [{
						name: 'Time Distribution',
						type: 'bar',
						data: [
							{
								value: parseFloat(data.aborttime || 0).toFixed(2),
								name: 'İptal',
								itemStyle: {
									color: '#c9c862'
								}
							},
							{
								value: parseFloat(data.breaktime || 0).toFixed(2),
								name: 'Mola',
								itemStyle: {
									color: '#c98b62'
								}
							},
							{
								value: parseFloat(data.cuttime || 0).toFixed(2),
								name: 'Kesim',
								itemStyle: {
									color: '#c962b9'
								}
							},
							{
								value:  parseFloat(data.bitetime || 0).toFixed(2),
								name: 'Aktarma',
								itemStyle: {
									color: '#c96262'
								}
							},
							{
								value: parseFloat(data.secondarytime || 0).toFixed(2),
								name: 'Pozisyonlama',
								itemStyle: {
									color: '#62c98d'
								}
							}
						],
						barWidth: '60%',
						label: {
							show: true,
							position: 'top',
							formatter: function(params) {
								// 柱子上方标签保留两位小数
								if(params.data && params.data.value) {
									return parseFloat(params.data.value).toFixed(2) + ' min';
								}
								return '0.00 min';
							},
							color: 'white',
							fontSize: 12
						},
						itemStyle: {
							barBorderRadius: 5
						}
					}]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);

				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};

		// 使用刚指定的配置项和数据显示图表。
		sendRequest(options);
		// 定时刷新
		setInterval(function() {
			sendRequest(options);
		}, 30000);
		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}

	// 有效利用率
	function echarts_3() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('echart3'));

		var week = new Array(7);
		var jobtime = new Array(7);
		var cuttime = new Array(7);
		var EUB = new Array(7);

		var param = {}
		param.jobtime = $("#jobtime").val();
		param.cuttime = $("#cuttime").val();
		param.date = $("#date").val();
		param.dateOri = $("#dateOri").val();

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4EUB",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {

				for (let i = 0; i < week.length; i++) {
					week[i] = 0;
					jobtime[i] = 0;
					cuttime[i] = 0;
					EUB[i] = 0;
				}

				for (let i = 0; i < data.length; i++) {
					if (i == 0){
						week[i] = data[i].dateOri + "     ";
					}else if (i == data.length-1){
						week[i] = "     " + data[i].dateOri;
					}else {
						week[i] = data[i].dateOri;
					}
					jobtime[i] = data[i].jobtime;
					cuttime[i] = data[i].cuttime;

					EUB[i] = fomatFloat((cuttime[i] / jobtime[i])* 100,2);

					if (isNaN(EUB[i])){
						EUB[i] = 0;
					}
					// console.log(EUB);
				}

				option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							lineStyle: {
								color: '#57617B'
							}
						}
					},
					legend: {
						//icon: 'vertical',
						data: ['Etkin Kullanılabilirlik', 'Çalışma Süresi(dak)'],
						//align: 'center',
						// right: '35%',
						top: '0',
						textStyle: {
							color: '#fff'
						},
						// itemWidth: 15,
						// itemHeight: 15,
						itemGap: 20
					},
					grid: {
						left: '0',
						right: '20',
						top: '10',
						bottom: '20',
						containLabel: true
					},
					xAxis: [
						{
							type: 'category',
							boundaryGap: false,
							inverse: true,
							axisLabel: {
								show: true,
								textStyle: {
									color: 'rgba(255,255,255,.6)'
								}
							},
							axisLine: {
								lineStyle: {
									color: 'rgba(255,255,255,.1)'
								}
							},
							data: week
						},
						{}
					],
					yAxis: [
						{
							axisLabel: {
								show: true,
								textStyle: {
									color: 'rgba(255,255,255,.6)'
								}
							},
							axisLine: {
								lineStyle: {
									color: 'rgba(255,255,255,.1)'
								}
							},
							splitLine: {
								lineStyle: {
									color: 'rgba(255,255,255,.1)'
								}
							}
						}
					],
					series: [
						{
							name: 'Etkin Kullanılabilirlik',
							type: 'line',
							smooth: true,
							symbol: 'circle',
							symbolSize: 5,

							lineStyle: {
								normal: {
									width: 2
								}
							},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(
										0,
										0,
										0,
										1,
										[
											{
												offset: 0,
												color: 'rgba(24, 163, 64, 0.3)'
											},
											{
												offset: 0.8,
												color: 'rgba(24, 163, 64, 0)'
											}
										],
										false
									),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
									shadowBlur: 10
								}
							},
							itemStyle: {
								normal: {
									label: {
										show: true,
										formatter: '{c}%',//显示百分号
										valueAnimation: true
									},
									color: '#cdba00',
									borderColor: 'rgba(137,189,2,0.27)',
									borderWidth: 12
								}
							},
							data: EUB
						},
						{
							name: 'Çalışma Süresi(dak)',
							type: 'line',
							smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							lineStyle: {
								normal: {
									width: 2
								}
							},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(
										0,
										0,
										0,
										1,
										[
											{
												offset: 0,
												color: 'rgba(39, 122,206, 0.3)'
											},
											{
												offset: 0.8,
												color: 'rgba(39, 122,206, 0)'
											}
										],
										false
									),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
									shadowBlur: 10
								}
							},
							itemStyle: {
								normal: {
									label: {
										show: true,
										valueAnimation: true
									},
									color: '#277ace',
									borderColor: 'rgba(0,136,212,0.2)',
									borderWidth: 12
								}
							},
							data: cuttime
						}
					]
				};
				// option
				myChart.setOption(option);

				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
		// 定时刷新
		setInterval(function() {
			sendRequest(options);
		}, 30000);

		sendRequest(options);
		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}

	// 时段产量
	function echarts_4() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('echart4'));

		var piece;
		var workCount;
		var smallTime;
		var bigTime;
		var TimeList = [];

		var timeArr = new Array(12);
		var piceArr = new Array(12);
		var PiceChuYTimeArr = new Array(12);

		var param = {}
		param.piece = $("#piece").val();
		param.workCount = $("#workCount").val();
		param.smallTime = $("#smallTime").val();
		param.bigTime = $("#bigTime").val();

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4TimePeriodYieldStatistics",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
				// 回调函数区域
				//响应成功后回调函数
				//alert("收到响应");

				for (let i = 0; i < timeArr.length; i++) {
					timeArr[i] = 0;
					piceArr[i] = 0;
					PiceChuYTimeArr[i] = 0;
				}

				for (let i = 0; i < data.length; i++) {
					var myDate = new Date(data[i].smallTime);
					// console.log("Timer is == > " + myDate.getHours());
					timeArr[chooseTime(myDate.getHours())]++;
					piceArr[chooseTime(myDate.getHours())] += data[i].piece;
					PiceChuYTimeArr[chooseTime(myDate.getHours())] += fomatFloat((data[i].piece / timeArr[chooseTime(myDate.getHours())]),2);
				}

				// console.log(timeArr);
				// console.log(piceArr);
				// console.log(PiceChuYTimeArr);

				//alert(cutEmptyTime);
				option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							lineStyle: {
								color: '#57617B'
							}
						}
					},
					"legend": {

						"data": [{
							"name": "Çıktı (Sayıları)"
						},
							{
								"name": "Çıktı (Tekstil parçaları)"
							},
							{
								"name": "Çıktı/ 2 saat"
							}
						],
						"top": "top",
						"textStyle": {
							"color": "rgba(255,255,255,0.9)" //图例文字
						}
					},

					"xAxis": [{
						"type": "category",
						data: ['0Saat', '2Saat', '4Saat', '6Saat', '8Saat', '10Saat', '12Saat', '14Saat', '16Saat', '18Saat', '20Saat', '22Saat'],
						axisLine: {
							lineStyle: {
								color: "rgba(255,255,255,.1)"
							}
						},
						axisLabel: {
							textStyle: {
								color: "rgba(255,255,255,.6)",
								fontSize: '14',
							},
						},

					}, ],
					"yAxis": [{
						"type": "value",
						"name": "---Aralıklı=2 Saat",
						// "min": 0,
						// "max": 300,
						// "interval": 100,
						"axisLabel": {
							"show": true,
							"fontSize": 10
						},
						splitLine:false,
						axisLine: {
							lineStyle: {
								color: 'rgba(255,255,255,.4)'
							}
						}, //左线色

					},
						{
							"type": "value",
							"name": "Çıktı/ 2 saat",
							"show": true,
							"axisLabel": {
								"show": true,

							},
							axisLine: {
								lineStyle: {
									color: 'rgba(255,255,255,.4)'
								}
							}, //右线色
							splitLine: {
								show: false,
								lineStyle: {
									color: "#001e94"
								}
							}, //x轴线
						},
					],
					"grid": {
						"top": "10%",
						"right": "30",
						"bottom": "30",
						"left": "30",
						// "height":"250"
					},
					"series": [{
						"name": "Çıktı (Sayıları)",
						"type": "bar",
						"data": timeArr,
						symbol: 'circle',
						symbolSize: 5,
						"barWidth": "auto",
						"itemStyle": {
							"normal": {
								label: {
									show: true,      //开启显示
									position: 'top', //在上方显示
									textStyle: {     //数值样式
										color: 'white',
										fontSize: 16
									}
								},
								"color": {
									"type": "linear",
									"x": 0,
									"y": 0,
									"x2": 0,
									"y2": 1,
									"colorStops": [{
										"offset": 0,
										"color": "#609db8"
									},

										{
											"offset": 1,
											"color": "#609db8"
										}
									]

								}
							}
						}
					},
						{
							"name": "Çıktı (Tekstil parçaları)",
							"type": "bar",
							"data": piceArr,
							"barWidth": "auto",
							"itemStyle": {
								"normal": {
									label: {
										formatter: "{c}"+"Parça",
										show: true,      //开启显示
										position: 'top', //在上方显示
										textStyle: {     //数值样式
											color: '#00ff03',
											fontSize: 15
										},

									},
									"color": {
										"type": "linear",
										"x": 0,
										"y": 0,
										"x2": 0,
										"y2": 1,
										"colorStops": [{
											"offset": 0,
											"color": "#66b8a7"
										},
											{
												"offset": 1,
												"color": "#66b8a7"
											}
										],
										"globalCoord": false
									}
								}
							},
							"barGap": "0"
						},
						{
							"name": "Çıktı/ 2 saat",
							"type": "line",
							"yAxisIndex": 1,

							"data": PiceChuYTimeArr,
							lineStyle: {
								normal: {
									width: 2,
									label: {
										show: true,      //开启显示
										position: 'top', //在上方显示
										textStyle: {     //数值样式
											color: 'white',
											fontSize: 16
										}
									}
								},
							},
							"itemStyle": {
								"normal": {
									"color": "#cdba00",

								}
							},
							"smooth": true
						}
					]
				};
				myChart.setOption(option);

				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};

		// 使用刚指定的配置项和数据显示图表。
		sendRequest(options);
		// 定时刷新
		setInterval(function() {
			sendRequest(options);
		}, 30000);
		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}

	// 磨损程度测定 设备保养维护
	function echarts_5() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('echart5'));
		// 颜色
		var lightBlue = {
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0,
			y2: 1,
			colorStops: [{
				offset: 0,
				color: 'rgba(41, 121, 255, 1)'
			}, {
				offset: 1,
				color: 'rgba(0, 192, 255, 1)'
			}],
			globalCoord: false
		}


		myChart.showLoading();

		var param = {};

		param.name = $("#name").val();
		param.maxValue = $("#maxValue").val();
		param.usage = $("#usages").val();


		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4MaintenanceNewer",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {

				var maintenceUsage = new Array(data.length);
				var maintenanceName = new Array(data.length);
				var maintenceMax = new Array(data.length);

				for (var i = 0; i < data.length; i++) { // 构建长度
					maintenanceName[i] = data[i].name;
					maintenceMax[i] = (100);
					// if (data[i].maxValue <= data[i].usage){ data[i].usage = data[i].maxValue } // 如果超过那就平等

					var maxvalue = data[i].maxValue;
					var usage = data[i].usage;
					if ((maxvalue - usage) < 0){
						maxvalue = usage;
					}
					var finla = ((maxvalue - usage) / maxvalue) * 100;
					finla = fomatFloat(finla,2);
					maintenceUsage[i] = finla;
					// console.log(maxvalue + "\n==" + usage + "\n剩余寿命是：" + (maxvalue - usage) + "\n被除总之后是" + ((maxvalue - usage) / maxvalue) + "\n最终：" + finla);

				}


				var option = {
					tooltip: {
						show: false
					},
					grid: {
						top: '0%',
						left: '80',
						right: '10%',
						bottom: '0%',
					},
					xAxis: {
						min: 0,
						max: 100,
						splitLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},
						axisLabel: {
							show: false
						}
					},
					yAxis: {
						data: maintenanceName,
						//offset: 15,
						axisTick: {
							show: false
						},
						axisLine: {
							show: true
						},
						axisLabel: {
							color: 'rgba(255,255,255,.6)',
							fontSize: 14
						}
					},
					series: [{
						type: 'bar',
						label: {
							show: true,
							zlevel: 10000,
							position: 'right',
							padding: 10,
							color: '#49bcf7',
							fontSize: 10,
							formatter: '{c}%'

						},
						itemStyle: {
							color: '#49bcf7'
						},
						barWidth: '16',
						data: maintenceUsage, // 实际数据在这
						z: 10
					}, {
						type: 'bar',
						barGap: '-100%',
						itemStyle: {
							color: '#fff',
							opacity: 0.1
						},
						barWidth: '15',
						data: maintenceMax,
						z: 5
					}],
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};


		// 定时刷新
		setInterval(function() {
			sendRequest(options);
		}, 30000);

		window.addEventListener("resize", function() {
			myChart.resize();
		});
		sendRequest(options);
	}

	function zb1() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('zb1'));

		var v1 = 298; //男消费
		var v2 = 523; //主
		var v3 = 8 * 60; //总消费

		var speedList = [];

		myChart.showLoading();

		// 定义传入的东西

		var param = {};
		param.sendSpeedList = $("#sendSpeedList").val();

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4WorkTime",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
				// 回调函数区域
				//响应成功后回调函数
				if (data){
					for (var i = 0; i < data.length; i++) {
						speedList.push(data[i]);
						// alert(speedList[i]);
					}
					v2 = fomatFloat(speedList[0],2);
					console.log("Debug ==> " + v2);
				}else{
					console.log("Error!")
				}
				// CircleNo2 = speedList[1];
				// alert(v2);
				option = {
					series: [{

						type: 'pie',
						radius: ['60%', '70%'],
						color: '#49bcf7',
						label: {
							normal: {
								position: 'center'
							}
						},
						data: [{
							value: v3,
							name: '女消费',
							label: {
								normal: {
									formatter: fomatFloat(v2,2) + 'dak',
									textStyle: {
										fontSize: 20,
										color: '#fff',
									}
								}
							}
						}, {
							value: v3 - v1,
							name: '男消费',
							label: {
								normal: {
									formatter: function(params) {

										return 'Süre oranı son ' + fomatFloat(Math.round((v2 / v3) * 100),2) + ' saat%'
									},
									textStyle: {
										color: '#aaa',
										fontSize: 12
									}
								}
							},
							itemStyle: {
								normal: {
									color: 'rgba(255,255,255,.2)'
								},
								emphasis: {
									color: '#fff'
								}
							},
						}]
					}]
				};
				// 指定图表的配置项和数据
				myChart.setOption(option);
				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
		// 执行Ajax
		// 定时刷新
		setInterval(function() {
			console.log("RUN");
			sendRequest(options);
		}, 30000);
		sendRequest(options);

		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}

	function zb2() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('zb2'));
		var v1 = 0 ;//男消费
		var v2 = 50 ;//女消费
		var v3 = 0 ;//总消费

		var speedList = [];

		myChart.showLoading();

		// 定义传入的东西

		var param = {};
		param.sendSpeedList = $("#sendSpeedList").val();

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4WorkTime",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
				// 回调函数区域
				//响应成功后回调函数
				if (data){
					for (var i = 0; i < data.length; i++) {
						speedList.push(data[i]);
						// alert(speedList[i]);
					}
				}
				v3 = speedList[0];
				v1 = speedList[1];

				v3 = fomatFloat(v3,2);
				v1 = fomatFloat(v1,2);
				v2 = fomatFloat(v1,2);

				option = {

					//animation: false,
					series: [{
						type: 'pie',
						radius: ['60%', '70%'],
						color: '#cdba00',
						label: {
							normal: {
								position: 'center'
							}
						},
						data: [{
							value: v1,
							name: '男消费',
							label: {
								normal: {
									formatter: v1 + 'dak',
									textStyle: {
										fontSize: 20,
										color: '#fff',
									}
								}
							}
						}, {
							value: v3 - v2,
							name: '女消费',
							label: {
								normal: {
									formatter: function(params) {
										return 'ÇS/KS' + fomatFloat(Math.round(v1 / v3 * 100),2) + '%'
									},
									textStyle: {
										color: '#aaa',
										fontSize: 12
									}
								}
							},
							itemStyle: {
								normal: {
									color: 'rgba(255,255,255,.2)'
								},
								emphasis: {
									color: '#fff'
								}
							},
						}]
					}]
				};
				// 指定图表的配置项和数据
				myChart.setOption(option);
				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
		// 执行Ajax
		// 定时刷新
		setInterval(function() {
			sendRequest(options);
		}, 30000);
		sendRequest(options);
		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}

	function zb3() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('zb3'));
		var v1 = 100 //男消费
		var v2 = 0 //女消费
		var v3 = v1 + v2 //总消费

		var speedList = [];

		myChart.showLoading();

		// 定义传入的东西

		var param = {}
		param.sendSpeedList = $("#sendSpeedList").val();

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4WorkTime",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
				// 回调函数区域
				//响应成功后回调函数
				if (data){
					for (var i = 0; i < data.length; i++) {
						speedList.push(data[i]);
						// alert(speedList[i]);
					}
				}
				v2 = fomatFloat(speedList[2],2);
				v3 = distanceCalcu(v2);
				v1 = v3;
				// alert(v2);
				option = {
					series: [{

						type: 'pie',
						radius: ['60%', '70%'],
						color: '#62c98d',
						label: {
							normal: {
								position: 'center'
							}
						},
						data: [{
							value: v2,
							name: '女消费',
							label: {
								normal: {
									formatter: v2 + 'm',
									textStyle: {
										fontSize: 20,
										color: '#fff',
									}
								}
							}
						}, {
							value: v3 - v2,
							name: '男消费',
							label: {
								normal: {
									formatter: function(params) {

										return v3 + 'm/' + fomatFloat(Math.round(v2 / v3 * 100),2) + '%'
									},
									textStyle: {
										color: '#aaa',
										fontSize: 12
									}
								}
							},
							itemStyle: {
								normal: {
									color: 'rgba(255,255,255,.2)'
								},
								emphasis: {
									color: '#fff'
								}
							},
						}]
					}]
				};
				// 指定图表的配置项和数据
				myChart.setOption(option);
				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
		// 执行Ajax
		// 定时刷新
		setInterval(function() {
			sendRequest(options);
		}, 30000);
		sendRequest(options);

		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}

	// 显示当前版图名称
	function DangQianBantu(){


		// 定义传入的东西
		var param = {}
		param.layerNowName = $("#layerNowName").val();
		param.layerLastTime = $("#layerLastTime").val();


		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4LastCutAndName",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
				// 回调函数区域
				// alert(data.layerNowName);
				// console.log(getLength(data.layerNowName));
				if (getLength(data.layerNowName) >= 10 && getLength(data.layerNowName) < 16){
					$(".numtxt").css("font-size", 43);
				}else if (getLength(data.layerNowName) >= 16 && getLength(data.layerNowName) < 20){
					$(".numtxt").css("font-size", 35);
				}else if (getLength(data.layerNowName) >= 20 && getLength(data.layerNowName) < 26){
					$(".numtxt").css("font-size", 25);
				}else {
					$(".numtxt").css("font-size", 50);
				}
				data.layerNowName = cutstr(data.layerNowName, 26);
				document.getElementById("LayerNow").innerText = data.layerNowName;
			},
			error:function () {
				console.log("error");
				document.getElementById("LayerNow").innerText = "查询异常，请联系管理员！";
			}
		};
		// 执行Ajax
		// setTimeout('sendRequest(options)',500);
		setInterval(function() {
			sendRequest(options);
		}, 30000);
		sendRequest(options);
	}

	// 左侧清单滚动页面
	function LeftListRoll(){

		// 定义传入的东西
		var param = {};

		param.times = $("#times").val();
		param.markName = $("#markName").val();
		param.finishBeans = $("#finishBeans").val();

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4LeftList",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
				// // 回调函数区域
				// alert(data[0].times);
				//

				$('.wrap,.adduser').liMarquee('destroy');

				var str = "";
				for (var i = 0; i < data.length; i++) {
					data[i].markName = cutstr(data[i].markName,35);
					str += "<li><p><span>&nbsp;&nbsp;" + (i+1) + "</span><span>" + data[i].markName + "</span><span></span><span>" + data[i].times + "</span></p></li>";
				}

				var html = str;
				//alert(data);
				$('#ulBody').html(html);
				// 滚动函数
				// dom的class标签   和 方法名：adduser是自定义的
				$('.wrap,.adduser').liMarquee({
					direction: 'up',/*身上滚动*/
					runshort: false,/*内容不足时不滚动*/
					scrollamount: 15/*速度*/
				});
			},
			error:function () {
				console.log("左侧订单区域错误");
			}
		};

		setInterval(function() {
			sendRequest(options);
		}, 60000);
		sendRequest(options);


	}

	// 右侧页面
	function RightRank(){
		var param = {}
		param.marker = $("#marker").val();
		param.counter = $("#counter").val();
		param.effection = $("#effection").val();

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4Rank",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {

				var str = "<tr> <th scope=\"col\">Sıralama</th> <th scope=\"col\">Pastal</th> <th scope=\"col\">Kullanım Sayısı</th> <th scope=\"col\">Kullanım</th> </tr>";
				for (let i = 0; i < data.length; i++) {
					if (i < 5){
						data[i].marker = cutstr(data[i].marker, 16);
						str += "<tr> <td><span>" + (i+1) + "</span></td> <td>" + data[i].marker + "</td> <td>" + data[i].counter + "<br></td> <td>"
						+ fomatFloat(data[i].effection,2) + "%<br></td> </tr>";
					}
				}
				if (data.length == 0){
					str += "<tr> <td><span>" + "X" + "</span></td> <td>" + "No records" + "</td> <td>" + "None"  + "<br></td> <td>" + " -- " + " %<br></td> </tr>"
				}
				$('#ulBodyRank').html(str);
				str = "";
			},
			error:function () {
				console.log("error");
			}
		};

		// 使用刚指定的配置项和数据显示图表。
		sendRequest(options);
		// 定时刷新
		setInterval(function() {
			sendRequest(options);
		}, 30000);
	}
})
