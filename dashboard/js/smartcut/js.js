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

function formatLocalDateTime(date) {
    const pad = (n) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getCurrentMonthStartAndNow() {
    const now = new Date();

    // 当月第一天 00:00:00（本地时间）
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const firstDay = `${year}-${month}-01 00:00:00`;

    // 当前时间（本地时间）
    const nowFormatted = formatLocalDateTime(now);

    return [firstDay, nowFormatted];
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

// 自动刷新函数
function register_AutoFlush() {
    setInterval(requestAll, 60000);
}

function requestAll(){
    console.log("请求一次数据");
    // 左下角七日四大时间
	echarts_1();
	// 最新10次的速度
	echarts_2();
	// 有效利用率
	echarts_3();
	// 时段产量
	echarts_4();
	// 磨损程度测定 设备保养维护
	// echarts_5();
    Performance();

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
	loadPatternUsageData();
}

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
		const urlParams = new URLSearchParams(window.location.search);
		var param = {};
		param.crossTime = $("#crossTime").val();
		param.cutTime = $("#cutTime").val();
		param.pauseTime = $("#pauseTime").val();
		param.cutEmptyTime = $("#cutEmptyTime").val();
		param.sncode =  $("#device").find("option:selected").val();
		param.cutType = urlParams.get('cutType');
		// console.log("param.sncode"+param.sncode)

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
				crossTime = fomatFloat(data.crossTime, 0);
				cutTime = fomatFloat(data.cutTime, 0);
				pauseTime = fomatFloat(data.pauseTime, 0);
				cutEmptyTime = fomatFloat(data.cutEmptyTime, 0);

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
						top: 20,
						height: 160,
						itemWidth: 10,
						itemHeight: 10,
						itemGap: 10,
						textStyle: {
							color: 'rgba(255,255,255,.6)',
							fontSize: 16
						},
						orient: 'vertical',
						data: [echarts_1_emptyTime, echarts_1_OtherTime, echarts_1_BieetfeedTime, echarts_1_cutTime]
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '15%', // 增加底部边距，为标签留出空间
						containLabel: true
					},
					xAxis: {
						type: 'category',
						data: [echarts_1_emptyTime, echarts_1_OtherTime, echarts_1_BieetfeedTime, echarts_1_cutTime],
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
								name: echarts_1_emptyTime,
								itemStyle: {
									color: '#ff806c'
								}
							},
							{
								value: parseFloat(pauseTime || 0).toFixed(2),
								name: echarts_1_OtherTime,
								itemStyle: {
									color: '#00eeff'
								}
							},
							{
								value: parseFloat(crossTime || 0).toFixed(2),
								name: echarts_1_BieetfeedTime,
								itemStyle: {
									color: '#ffff00'
								}
							},
							{
								value: parseFloat(cutTime || 0).toFixed(2),
								name:echarts_1_cutTime,
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

                myChart.clear(); // 清空之前的所有内容，防止内存堆积。
				myChart.setOption(option);

				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
		window.addEventListener("resize", function() {
			myChart.resize();
		});
		sendRequest(options);
	}

// 最新10次的速度
function echarts_2() {
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('echart2'));

	myChart.showLoading();

	const urlParams = new URLSearchParams(window.location.search);

	// 定义传入的参数
	var param = {
		sendSpeedList: $("#sendSpeedList").val(),
		sncode: $("#device").find("option:selected").val(),
		cutType: urlParams.get('cutType')
	};

	// 执行Ajax参数封装
	var options = {
		url: "/test/ajax4Last10Speed",
		type: "post",
		contentType: "application/json;charset=utf-8",
		data: JSON.stringify(param),
		dataType: "json",
		getresult: function (data) {
			// 处理返回的数据
			if (data && data.length > 0) {
				// 提取时间和速度数据
				var timeList = [];
				var speedList = [];

                data.forEach(function (item) {
                    var timeStr = item.loadTime.split(' ')[1];
                    timeList.push(timeStr);
                    // 确保是数字，保留2位小数
                    var speed = parseFloat(item.speedLast10);
                    speedList.push(isNaN(speed) ? 0 : Number(speed.toFixed(2)));
                });

				// 图表配置
				var option = {
					textStyle: {
						color: '#ffffff'
					},
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							return params[0].name + '<br/>' + params[0].value + ' M/min';
						}
					},
					legend: {
						data: [echarts_2_cutSpeed],
						textStyle: {
							fontWeight: 'normal',
							color: '#ffffff'
						}
					},
					xAxis: {
						type: 'category',
						data: timeList,
						axisLabel: {
							rotate: 30, // 如果时间标签太长可以旋转
							interval: 0 // 强制显示所有标签
						}
					},
					yAxis: {
						type: 'value',
						name: echarts_2_speedUnit,
						// name: '速度 (CM/S)',
						min: function (value) {
							return Math.max(0, value.min - 1); // 留出一些空间
						}
					},
					series: [{
						name: echarts_2_cutSpeed,
						type: 'line',
						smooth: true,
						data: speedList,
						color: '#15ff00',
						areaStyle: {
							color: '#91ff66',
							opacity: 0.3
						},
						itemStyle: {
							normal: {
								label: {
									show: true,
									formatter: '{c}'
								}
							}
						}
					}]
				};

                myChart.clear(); // 清空之前的所有内容，防止内存堆积。
				myChart.setOption(option);
			} else {
				console.log("无数据");
				myChart.setOption({
					title: {
						text: echarts_2_NoData,
						textStyle: {
							color: '#ffffff'
						}
					}
				});
			}
			myChart.hideLoading();
		},
		error: function () {
			console.log("error");
			myChart.hideLoading();
			myChart.setOption({
				title: {
					text: echarts_2_Error,
					textStyle: {
						color: '#ff0000'
					}
				}
			});
		}
	};

	// 执行Ajax请求
	sendRequest(options);

	// 窗口大小变化时重绘图表
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}

	// 右下角单日时间分布图
	function echarts_6() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('echart6'));

		const urlParams = new URLSearchParams(window.location.search);
		var param = {}
		param.cuttime = $("#cuttime").val();
		param.bitetime = $("#bitetime").val();
		param.secondarytime = $("#secondarytime").val();
		param.breaktime = $("#breaktime").val();
		param.aborttime = $("#aborttime").val();
		param.sncode =  $("#device").find("option:selected").val();
		param.cutType = urlParams.get('cutType');

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
						data:[echarts_6_aborttime, echarts_6_breaktime,echarts_6_cuttime, echarts_6_bitetime, echarts_6_secondarytime],
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
								name: echarts_6_aborttime,
								itemStyle: {
									color: '#c9c862'
								}
							},
							{
								value: parseFloat(data.breaktime || 0).toFixed(2),
								name: echarts_6_breaktime,
								itemStyle: {
									color: '#c98b62'
								}
							},
							{
								value: parseFloat(data.cuttime || 0).toFixed(2),
								name: echarts_6_cuttime,
								itemStyle: {
									color: '#c962b9'
								}
							},
							{
								value:  parseFloat(data.bitetime || 0).toFixed(2),
								name: echarts_6_bitetime,
								itemStyle: {
									color: '#c96262'
								}
							},
							{
								value: parseFloat(data.secondarytime || 0).toFixed(2),
								name: echarts_6_secondarytime,
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

                myChart.clear(); // 清空之前的所有内容，防止内存堆积。
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
		const urlParams = new URLSearchParams(window.location.search);

		var param = {}
		param.jobtime = $("#jobtime").val();
		param.cuttime = $("#cuttime").val();
		param.date = $("#date").val();
		param.dateOri = $("#dateOri").val();
		param.sncode =  $("#device").find("option:selected").val();
		param.cutType = urlParams.get('cutType');

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
					}else if (i == data.length -1){
						week[i] = "     " + data[i].dateOri;
					}else {
						week[i] = data[i].dateOri;
					}
					jobtime[i] = data[i].jobtime;
					cuttime[i] = data[i].cuttime;

					// EUB[i] = fomatFloat((cuttime[i] / jobtime[i])* 100,0);

					// 将日期字符串转换为 Date 对象
					let dateParts = week[i].split('-');
					let year = parseInt('20' + dateParts[0]); // 这里假设年份是20XX年
					let month = parseInt(dateParts[1]) - 1; // 月份从0开始，所以要减1
					let day = parseInt(dateParts[2]);
					let date = new Date(year, month, day);

					// 获取星期几
					let dayOfWeek = date.getDay();

					// 根据星期几设置工作时间
					let weektime;
					if (dayOfWeek === 0 || dayOfWeek === 6) {
						weektime = 9; // 周六周日固定9小时
					} else {
						weektime = 11; // 周一至周五固定11小时
					}

					// 计算 EUB 值（以分钟为单位）
					//let EUBValue = fomatFloat((jobtime[i] / (weektime * 60)) * 100, 0);
					let EUBValue = fomatFloat((cuttime[i] / jobtime[i]) * 100, 0);
					EUB[i] = EUBValue;
					// console.log(cuttime[i] + "---" + (weektime * 60) + "----" + week[i]);

					if (isNaN(EUB[i])){
						EUB[i] = 0;
					}
					// console.log("EUB! = " + EUB);
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
						data: [echarts_3_OEE, echarts_3_CuttingTime],
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
							position: 'left', // 左侧
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
						},
						{
							position: 'right', // 右侧
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
							yAxisIndex: 1,
							name: echarts_3_OEE,
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
							data: EUB,
							max: '130%'
						},
						{
							name: echarts_3_CuttingTime, // 工作时长
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
                myChart.clear(); // 清空之前的所有内容，防止内存堆积。
				// option
				myChart.setOption(option);

				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
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

		const urlParams = new URLSearchParams(window.location.search);

		var param = {};
		param.piece = $("#piece").val();
		param.workCount = $("#workCount").val();
		param.smallTime = $("#smallTime").val();
		param.bigTime = $("#bigTime").val();
		param.sncode =  $("#device").find("option:selected").val();
		param.cutType = urlParams.get('cutType');

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
					PiceChuYTimeArr[chooseTime(myDate.getHours())] += fomatFloat((data[i].piece / timeArr[chooseTime(myDate.getHours())]),0);
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
							"name": echarts_4_output_time
						},
							{
								"name": echarts_4_output_pcs
							},
							{
								"name": echarts_4_output_hrs
							}
						],
						"top": "top",
						"textStyle": {
							"color": "rgba(255,255,255,0.9)" //图例文字
						}
					},

					"xAxis": [{
						"type": "category",
						data: ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
						axisLine: {
							lineStyle: {
								color: "rgba(255,255,255,.1)"
							}
						},
						axisLabel: {
							textStyle: {
								color: "rgba(255,255,255,.6)",
								fontSize: '12',
							},
						},

					}, ],
					"yAxis": [{
						"type": "value",
						"name": echarts_4_interval_hrs,
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
							"name": echarts_4_output_hrs,
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
						"name": echarts_4_output_time,
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
							"name": echarts_4_output_pcs,
							"type": "bar",
							"data": piceArr,
							"barWidth": "auto",
							"itemStyle": {
								"normal": {
									label: {
										formatter: "{c}"+ echarts_4_output_pcs_unit,
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
							"name": echarts_4_output_hrs,
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
                myChart.clear(); // 清空之前的所有内容，防止内存堆积。
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
		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}

    /**
     * 设备性能表现
     **/
    function Performance(){
        const urlParams = new URLSearchParams(window.location.search);
        const [monthStart, nowDatetime] = getCurrentMonthStartAndNow();

        // console.log(monthStart + "--" + nowDatetime);

        const selectedSn = $("#device").find("option:selected").val();
        if (!selectedSn) {
            console.warn("未选择设备");
            return;
        }

        // 准备请求参数
        var requestData = {
            startTime: monthStart,
            endTime: nowDatetime,
            sncode: $("#device").find("option:selected").val(),
            snCodes: selectedSn ? [selectedSn] : [],  // 传数组
            cutType: urlParams.get('cutType')
        };

        $.ajax({
            url: "/statics/timeStatics",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(requestData),
            dataType: "json",
            success: function (response) {
                updatePerformanceData(response);
            },
            error: function () {
                console.error("获取设备表现数据失败");
                showErrorMessage();
            }
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
		const urlParams = new URLSearchParams(window.location.search);

		var param = {};

		param.name = $("#name").val();
		param.maxValue = $("#maxValue").val();
		param.usage = $("#usages").val();
		param.sncode =  $("#device").find("option:selected").val();
		param.cutType = urlParams.get('cutType');


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
					maintenanceName[i] = data[i].Name;
					maintenceMax[i] = (100);
					// if (data[i].maxValue <= data[i].usage){ data[i].usage = data[i].maxValue } // 如果超过那就平等

					var maxvalue = data[i].MaxValue;
					var usage = data[i].Usages;
					if ((maxvalue - usage) < 0){
						maxvalue = usage;
					}
					var finla = ((maxvalue - usage) / maxvalue) * 100;
					finla = fomatFloat(finla,0);
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

                myChart.clear(); // 清空之前的所有内容，防止内存堆积。
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};

		window.addEventListener("resize", function() {
			myChart.resize();
		});
		sendRequest(options);
	}

	function zb1() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('zb1'));

		var v1 = 298; //
		var v2 = 523; //主
		var v3 = 8; //工作时间

		// 获取当前日期的星期几
		let dayOfWeek = (new Date()).getDay(); // 0表示周日，1表示周一，以此类推

		// 根据不同的星期几，设定工作时间
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			v3 = 9; // 周六周日固定9小时
		} else {
			v3 = 11; // 周一至周五固定11小时
		}

		var speedList = [];

		myChart.showLoading();

		// 定义传入的东西

		const urlParams = new URLSearchParams(window.location.search);
		var param = {};
		param.sendSpeedList = $("#sendSpeedList").val();
		param.sncode =  $("#device").find("option:selected").val();
		param.cutType = urlParams.get('cutType');

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4WorkTime",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
                speedList = []; // 清空，避免累积
				// 回调函数区域
				//响应成功后回调函数
				if (data){
					for (var i = 0; i < data.length; i++) {
						speedList.push(data[i]);
						// alert(speedList[i]);
					}
					v2 = fomatFloat(speedList[0],0);
					// console.log("Debug ==> " + v2);
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
							value: v2,
							name: '女消费',
							label: {
								normal: {
									formatter: fomatFloat(v2,0) + zb_min,
									textStyle: {
										fontSize: 20,
										color: '#fff',
									}
								}
							}
						}, {
							value: v1,
							name: '男消费',
							label: {
								normal: {
									formatter: function(params) {

										return  v3 + zb1_RT + fomatFloat(Math.round((v2 / (v3 * 60)) * 100),0) + '%'
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
                myChart.clear(); // 清空之前的所有内容，防止内存堆积。
				// 指定图表的配置项和数据
				myChart.setOption(option);
				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
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
		const urlParams = new URLSearchParams(window.location.search);
		var param = {};
		param.sendSpeedList = $("#sendSpeedList").val();
		param.sncode =  $("#device").find("option:selected").val();
		param.cutType = urlParams.get('cutType');

		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4WorkTime",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
                speedList = []; // 清空，避免累积
				// 回调函数区域
				//响应成功后回调函数
				if (data){
					for (var i = 0; i < data.length; i++) {
						speedList.push(data[i]);
						// alert(speedList[i]);
					}
				}
				// console.log("=-=" + speedList);
				v3 = speedList[0];
				v1 = speedList[1]; // 2是距离 所以不用考虑算进来

				v3 = fomatFloat(v3,0);
				v1 = fomatFloat(v1,0);
				v2 = fomatFloat(v1,0);

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
							// 此处是占有的数量,与下边的value形成对抗，所以要变成剩余的值
							value: v3,
							name: '男消费',
							label: {
								normal: {
									formatter: v1 + zb_min,
									textStyle: {
										fontSize: 20,
										color: '#fff',
									}
								}
							}
						}, {
							// 此处是占有的数量
							value: v3 - v1,
							name: '女消费',
							label: {
								normal: {
									formatter: function(params) {
										return zb2_RT_CT + fomatFloat(Math.round(v1 / v3 * 100),0) + '%'
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
                myChart.clear(); // 清空之前的所有内容，防止内存堆积。
				// 指定图表的配置项和数据
				myChart.setOption(option);
				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
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
		const urlParams = new URLSearchParams(window.location.search);
		var param = {}
		param.sendSpeedList = $("#sendSpeedList").val();
		param.sncode =  $("#device").find("option:selected").val();
		param.cutType = urlParams.get('cutType');


		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4WorkTime",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
			getresult: function(data) {
                speedList = []; // 清空，避免累积
				// 回调函数区域
				//响应成功后回调函数
				if (data){
					for (var i = 0; i < data.length; i++) {
						speedList.push(data[i]);
						// alert(speedList[i]);
					}
				}
				v2 = fomatFloat(speedList[2],0);
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
									formatter: v2 + zb_meter,
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

										return v3 + zb_meter + '/' + fomatFloat(Math.round(v2 / v3 * 100),0) + '%'
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
                myChart.clear(); // 清空之前的所有内容，防止内存堆积。
				// 指定图表的配置项和数据
				myChart.setOption(option);
				myChart.hideLoading();
			},
			error:function () {
				console.log("error");
				myChart.hideLoading();
			}
		};
		sendRequest(options);
		window.addEventListener("resize", function() {
			myChart.resize();
		});
	}

	// 显示当前版图名称
	function DangQianBantu(){

		const urlParams = new URLSearchParams(window.location.search);

		// 定义传入的东西
		var param = {}
		param.layerNowName = $("#layerNowName").val();
		param.layerLastTime = $("#layerLastTime").val();
		param.sncode =  $("#device").find("option:selected").val();
		param.cutType = urlParams.get('cutType');


		// 执行Ajax参数封装
		var options = {
			url:"/test/ajax4LastCutAndName",
			type:"post",
			contentType:"application/json;charset=utf-8",
			data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
			dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
                getresult: function(data) {
                    // 不再根据长度判断字体大小！全部交给 CSS
                    data.layerNowName = cutstr(data.layerNowName, 50); // 避免溢出太长
                    document.getElementById("LayerNow").innerText = data.layerNowName;
                },
			error:function () {
				console.log("error");
				document.getElementById("LayerNow").innerText = echarts_2_Error;
			}
		};
		sendRequest(options);
	}

	// 左侧清单滚动页面
	function LeftListRoll(){

		const urlParams = new URLSearchParams(window.location.search);

		// 定义传入的东西
		var param = {};

		param.times = $("#times").val();
		param.markName = $("#markName").val();
		param.finishBeans = $("#finishBeans").val();
		param.sncode =  $("#device").find("option:selected").val();
		param.cutType = urlParams.get('cutType');

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
					data[i].markName = cutstr(data[i].markName,100);
					str += "<li><p><span>&nbsp;&nbsp;" + (i+1) + "</span><span title='" + data[i].markName + "'>" + data[i].markName + "</span><span></span><span>" + data[i].times + "</span></p></li>";
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
		sendRequest(options);


	}


/**
 * 加载版图使用率数据（定时自动刷新）
 */
function loadPatternUsageData() {
    const urlParams = new URLSearchParams(window.location.search);

    // 准备请求参数
    var requestData = {
        marker: $("#marker").val(),
        counter: $("#counter").val(),
        effection: $("#effection").val(),
        sncode: $("#device").find("option:selected").val(),
        cutType: urlParams.get('cutType')
    };

    $.ajax({
        url: "/test/ajax4Rank",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(requestData),
        dataType: "json",
        success: function (response) {
            updateTableData(response);
        },
        error: function () {
            console.error("获取版图使用率数据失败");
            showErrorMessage();
        }
    });
}

/**
 * 更新表格数据
 * @param {Array} data 从接口获取的数据
 */
function updateTableData(data) {
	var tableBody = $('#ulBodyRank');

	// 清空旧数据（保留表头）
	tableBody.find('tr:gt(0)').remove();

	if (data && data.length > 0) {
		// 只显示前5条数据
		var displayData = data.slice(0, 5);

		// 添加新数据行
		displayData.forEach(function(item, index) {
			var row = '<tr>' +
				'<td><span>' + (index + 1) + '</span></td>' +
				'<td>' + formatPatternName(item.marker) + '</td>' +
				'<td>' + item.counter + '</td>' +
				'<td>' + formatPercentage(item.effection) + '%</td>' +
				'</tr>';
			tableBody.append(row);
		});
	} else {
		showNoDataMessage();
	}
}
/**
 * 更新左上角设备性能表现数据
 * @param {Array} data 从接口获取的数据
 */
function updatePerformanceData(data) {
    // 安全判断：确保 data 是非空数组
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("⚠️ 性能数据为空，无法更新");
        $("#perf_OEE").text("--%");
        $("#perf_workTime").text("--min");
        $("#perf_cutTime").text("--min");
        $("#perf_pauseTime").text("--min");
        $("#perf_offlineTime").text("--min");
        return;
    }

    var item = data[0]; // 取第一条记录

    // console.log("设备 SN:", item.snCode);
    // console.log("效率 effection:", item.effection);
    // console.log("总启动时间 allStartTimes:", item.allStartTimes);
    // console.log("工作时间 worksTimes:", item.worksTimes);
    // console.log("离线时间 offlineTime:", item.offlineTime);
    // console.log("生产件数 parts:", item.parts);
    // console.log("最后在线时间:", item.lastonline);

    // OEE（效率）: effection ， "0.70" → 显示为 "70%"
    const oee = parseFloat(item.effection);
    const oeeDisplay = isNaN(oee) ? "--" : Math.round(oee * 100);
    $("#perf_OEE").text(oeeDisplay + "%");

    // 累计工时（总时间）← allStartTimes
    const workTime = parseFloat(item.allStartTimes);
    $("#perf_workTime").text(isNaN(workTime) ? "--min" : Math.round(workTime) + "min");

    // 裁剪时间 ← worksTimes
    const cutTime = parseFloat(item.worksTimes);
    $("#perf_cutTime").text(isNaN(cutTime) ? "--min" : Math.round(cutTime) + "min");

    // 暂停时间 ← 暂未实现，固定显示 ---min
	const pauseTime = parseFloat(item.pauseTime);
	$("#perf_pauseTime").text(isNaN(pauseTime) ? "--min" : Math.round(pauseTime) + "min");
    // 离线时间 ← offlineTime
    const offlineTime = parseFloat(item.offlineTime);
    $("#perf_offlineTime").text(isNaN(offlineTime) ? "--min" : Math.round(offlineTime) + "min");
}
/**
 * 显示无数据提示
 */
function showNoDataMessage() {

	$('#ulBodyRank').append(
		'<tr>' +
		'<td colspan="4" style="text-align: center;">No Data in 30 Day</td>' +
		'</tr>'
	);
}

/**
 * 显示错误信息
 */
function showErrorMessage() {
	$('#ulBodyRank').append(
		'<tr>' +
		'<td colspan="4" style="text-align: center; color: red;">ERROR</td>' +
		'</tr>'
	);
}

/**
 * 格式化版图名称
 * @param {String} name 原始版图名称
 * @returns {String} 格式化后的名称
 */
function formatPatternName(name) {
	if (!name) return '';
	// 如果名称超过16个字符，显示前16个字符并加省略号
	return name.length > 16 ? name.substring(0, 16) + '...' : name;
}

/**
 * 格式化百分比数值
 * @param {Number} value 原始值
 * @returns {String} 格式化后的百分比字符串
 */
function formatPercentage(value) {
	if (isNaN(value)) return '0';
	// 四舍五入取整
	return Math.round(parseFloat(value));
}


