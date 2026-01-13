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
    }else if (dis >= 5000 && dis < 10000){
        return 20000
    }else{
        return 30000
    }
}
function distanceCalcuMiter(dis) {
    if (dis >= 0 && dis < 100) {
        return 100
    } else if (dis >= 100 && dis < 1000) {
        return 1000
    } else if (dis >= 1000 && dis < 10000) {
        return 10000
    }else if (dis >= 10000 && dis < 50000){
        return 50000
    }else if (dis >= 50000 && dis < 100000){
        return 200000
    }else{
        return 300000
    }
}

function formatDistanceToKm(distanceInMeters) {
    if (distanceInMeters >= 1000) {
        // Convert to kilometers
        return (distanceInMeters / 1000).toFixed(2) + ' km';
    } else {
        // Keep as meters
        return distanceInMeters + ' m';
    }
}
function distanceCalcuMiter(dis) {
    if (dis >= 0 && dis < 100) {
        return 100
    } else if (dis >= 100 && dis < 1000) {
        return 1000
    } else if (dis >= 1000 && dis < 10000) {
        return 10000
    }else if (dis >= 10000 && dis < 50000){
        return 50000
    }else if (dis >= 50000 && dis < 100000){
        return 200000
    }else{
        return 300000
    }
}
// 保留小数函数封装
function fomatFloat(src,pos){
    return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
}

function showAlert(message) {
    // 创建一个<div>元素作为弹框容器
    var alertBox = document.createElement('div');
    alertBox.className = 'alert-box';

    // 创建并设置弹框中的文本内容
    var messageText = document.createElement('p');
    messageText.innerText = message;

    // 创建一个关闭按钮
    var closeButton = document.createElement('button');
    closeButton.innerText = '关闭';

    // 将文本和关闭按钮添加到弹框容器中
    alertBox.appendChild(messageText);
    alertBox.appendChild(closeButton);

    // 点击关闭按钮时移除弹框
    closeButton.addEventListener('click', function() {
        alertBox.parentNode.removeChild(alertBox);
    });

    // 将弹框容器添加到页面的<body>元素中
    document.body.appendChild(alertBox);
}

function getDevices(){

    // 获取当前 URL
    var url = new URL(window.location.href);
    // 获取 URL 参数
    var params = new URLSearchParams(url.search);
    // 获取 Account 参数的值
    var Account = params.get('snCode');

    // 定义传入的东西
    var param = {};
    param.sncode = Account;

    var options = {
        url:"/spreader/getSnCodeList",
        type:"post",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function(data) {
            var str = "";
            $('#devices').html(str);

            for (let i = 0; i < data.length; i++) {
                str += "<option class=\"deviceBox\" >" + data[i].sncode + "</option>";
            }
            $('#devices').html(str);

            requestAllData(); // 执行更新数据
            // 每60秒执行一次requestAllData函数
            setInterval(requestAllData, 60000); // 60s一次更新数据
        },
        error:function () {
            console.log("error");
        }
    };
    sendRequest(options);
}

$(window).load(function(){$(".loading").fadeOut()});
// 请求页面元素
function requestAllData(schedule){
    getPieces30Day(schedule);   // 获取裁片信息 层数、行走、30日长度、30日层数
    getEveryDaySpeed(schedule);
    echarts_1(schedule); // timeGetingBeans
    echarts_2(schedule);
    echarts_3(schedule);
    echarts_4(schedule);
    echarts_5(schedule);
    zb1(schedule);
    zb2(schedule);
    zb3(schedule);
    zb4(schedule);
}

function getPieces30Day(schedule){
    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;

    // 执行Ajax参数封装
    var options = {
        url:"/spreader/getPieces30Day",
        type:"post",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function(data) {
           /* $('.wrap,.adduser').liMarquee('destroy');

            var str = "";
            var datas = data.cadid.split("^");
            var tempCounter = 0;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i] == ""){ tempCounter++; continue }
                str += "<li><p><span>" + datas[i] + "</span><span></span><span></span><span style='color: greenyellow'>" + getPieces30Day_Done + "</span></p></li>";
            }
            if (datas == '' || tempCounter == datas.length){
                str = "<li><p><span>"+ getPieces30Day_noMark +"</span><span></span><span></span><span style='color: indianred'>" + getPieces30Day_noStatus + "</span></p></li>"
            }
            $('#ulBody').html(str);
            // 滚动函数
            // dom的class标签   和 方法名：adduser是自定义的
            $('.wrap,.adduser').liMarquee({
                direction: 'up',/!*身上滚动*!/
                runshort: false,/!*内容不足时不滚动*!/
                scrollamount: 15/!*速度*!/
            });*/

            document.getElementById("monthLayers").innerText = data.pieces;
            document.getElementById("monthLength").innerText = data.monthLength;
            document.getElementById("runCounts").innerText = getPieces30Day_walkstime + data.counts;
            document.getElementById("monthLayersNums").innerText = getPieces30Day_completedOrders + data.fininshLayer;
        },
        error:function () {
            console.log("error");
            document.getElementById("monthLayers").innerText = "层数异常";
            document.getElementById("runCounts").innerText = "行走数据异常！";
            document.getElementById("monthLayersNums").innerText = "数量获取异常！";
            document.getElementById("monthLength").innerText = "统计异常";
        }
    };
    sendRequest(options);
}

function getEveryDaySpeed(schedule){
    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;

    // 执行Ajax参数封装
    var options = {
        url:"/spreader/getEveryDaySpeed",
        type:"post",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function(data) {
            console.log("Received data:", data); // 调试用

            // 停止任何正在运行的liMarquee动画
            $('.wrap,.adduser').liMarquee('destroy');

            // 清空当前内容
            $('#ulBody').empty();

            // 构建 HTML 字符串
            var str = "";
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    str += "<li><p>" +
                        "<span>" + formatDate(data[i].date) + "</span>" +       // 日期
                        "<span>" + data[i].lengthStr + "</span>" +  // 长度
                        "<span>" + data[i].timeStr + "</span>" +    // 铺布时间
                        "<span>" + data[i].speedStr + "</span>" +   // 速度
                        "</p></li>";
                }
                // 只有有数据时才插入内容
                $('#ulBody').html(str);

                // 重新初始化滚动效果
                $('.wrap,.adduser').liMarquee({
                    direction: 'up',       // 向上滚动
                    runshort: false,       // 内容不足时不滚动
                    scrollamount: 15       // 速度
                });
            } else {
                // 如果没有数据，显示默认提示
                str = ""; // 清空内容
                $('#ulBody').html(str);
            }

             },
        error:function () {
            console.log("error");
        }
    };
    sendRequest(options);
}

function formatDate(dateString) {
    // Split the date string into parts
    const [year, month, day] = dateString.split('-');

    // Extract the last two digits of the year
    const shortYear = year.slice(-2);

    // Return the formatted date string
    return `${shortYear}.${month}.${day}`;
}


/*function echarts_1(schedule) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart1'));
    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;
    console.log("qqqqqqqqqqqqqqqqqqqqq");
    console.log(schedule.scheduleStartTime);
    console.log(schedule.scheduleEndTime);

    // console.log("SN == >" + param.sncode);

    var options = {
        url:"/spreader/getTime",
        type:"post",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function(data) {

            var runTimeSum = 0;
            var sharpenTimeSum = 0;
            var waitTimeSum = 0;
            var cutTimeSum = 0;

            for (let i = 0; i < data.length; i++) {
                runTimeSum += data[i].runTime;
                sharpenTimeSum += data[i].sharpenTime;
                waitTimeSum += data[i].waitTime;
                cutTimeSum += data[i].cutTime;
            }

            option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    right:10,
                    top:30,
                    height:140,
                    itemWidth:10,
                    itemHeight:10,
                    itemGap:10,
                    textStyle:{
                        color: 'rgba(255,255,255,.6)',
                        fontSize:12
                    },
                    orient:'vertical',
                    // data:['工作时间','停机时间','磨刀时间','切刀时间']
                    data:[echarts_1_worktime,echarts_1_shutdowntime,echarts_1_sharpTime,echarts_1_cuttime]
                },
                calculable : true,
                series : [
                    {
                        name:' ',
                        color: ['#62c98d', '#2f89cf', '#4cb9cf', '#53b666', '#62c98d', '#205acf', '#c9c862', '#c98b62', '#c962b9', '#7562c9','#c96262'],
                        type:'pie',
                        radius : [30, 70],
                        center : ['35%', '50%'],
                        roseType : 'center',

                        itemStyle: {
                            borderRadius: 25,
                            borderColor: '#fff',
                            borderWidth: 1
                        },

                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },

                        labelLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },

                        data:[
                            {value:runTimeSum, name:echarts_1_worktime},
                            {value:sharpenTimeSum, name:echarts_1_shutdowntime},
                            {value:waitTimeSum, name:echarts_1_sharpTime},
                            {value:cutTimeSum, name:echarts_1_cuttime}
                        ]
                    },
                ]
            };

            myChart.setOption(option);
            myChart.hideLoading();
            window.addEventListener("resize", function() {
                myChart.resize();
            });
        },
        error:function () {
            console.log("getSpeedInfo error");
            myChart.hideLoading();
        }
    };
    sendRequest(options);
}*/
function formatTime(timeInSeconds) {
    let timeInHours = timeInSeconds / 3600.0;
    let formattedTime = timeInHours.toFixed(1); // 转换为字符串，保留一位小数

    // 检查小数部分是否为零
    if (formattedTime.endsWith('.0')) {
        return formattedTime.split('.')[0]; // 去掉小数部分
    } else {
        return formattedTime; // 保留小数部分
    }
}

function echarts_1(schedule) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart1'));

    // 定义传入的东西
    var param = {};
    param.sncode = $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;

    var options = {
        url: "/spreader/getTime",
        type: "post",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(param),
        dataType: "json",
        getresult: function(data) {
            var runTimeSum = 0;
            var otherTimeSum = 0; // 其它时间 = 磨刀时间 + 等待时间 + 切刀时间


                runTimeSum = data.runTime;
                otherTimeSum = data.onlineTime - data.runTime ;


            var dailyWorkTime = runTimeSum/dayCount; // 日工作时间

            runTimeSum =  formatTime(runTimeSum);
            otherTimeSum = formatTime(otherTimeSum);
            dailyWorkTime = formatTime(dailyWorkTime);


            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}'+zb3_hour+' ({d}%)'
                },
                legend: {
                    top: '5%',
                    left: 'center',
                    textStyle: {
                        color: 'rgba(255,255,255,.6)',
                        fontSize: 12
                    }
                },
                series: [
                    {
                        name: echarts_1_name,
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        padAngle: 5,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 1
                        },
                        color: ['#62c98d', '#2f89cf'], // 工作时间和其它时间的颜色
                        label: {
                            show: true,
                            formatter: '{b}: {c}'+zb3_hour,
                            position: 'outside',
                            alignTo: 'labelLine',
                            bleedMargin: 5,
                            color: 'rgba(255,255,255,.8)'
                        },
                        labelLine: {
                            show: true
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 18,
                                fontWeight: 'bold'
                            }
                        },
                        data: [
                            {
                                value: runTimeSum,
                                name: echarts_1_worktime
                            },
                            {
                                value: otherTimeSum,
                                name: echarts_1_othertime // 需要定义这个变量或直接写'其它时间'
                            }
                        ]
                    }
                ]
            };

            // 在饼图中心添加总开机时间
            option.graphic = [{
                type: 'text',
                left: 'center',
                top: 'center',
                silent: true, // 确保文本元素不受事件影响
                style: {
                    text: echarts_1_dailyWorkTime+'\n' + dailyWorkTime + zb3_hour,
                    textAlign: 'center',
                    fill: '#fff',
                    fontSize: 12,
                    fontWeight: 'bold'
                }
            }];

            myChart.setOption(option);
            myChart.hideLoading();

            window.addEventListener("resize", function() {
                myChart.resize();
            });
        },
        error: function() {
            console.log("getSpeedInfo error");
            myChart.hideLoading();
        }
    };
    sendRequest(options);
}
function echarts_2(schedule) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart2'));

    var layerList = [];
    var timesList = [];

    myChart.showLoading();

    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;
    // console.log("SN == >" + param.sncode);

    // 执行Ajax参数封装
    var options = {
        url: "/spreader/queryLayerChange",
        type: "post",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType: "json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function (data) {
            // 回调函数区域
            //响应成功后回调函数
            if (data) {

                layerList = [];
                timesList = [];

                for (var i = 0; i < data.length; i++) {
                    layerList.push(data[i].layer);
                    timesList.push(data[i].times);
                    // alert(speedList[i]);
                }
            }
            option = {
                textStyle: {
                    color: '#ffffff'
                },
                title: {
                    text: echarts_2_LeastLayer + layerList[0],

                    textStyle: {
                        fontWeight: 'normal',              //标题颜色
                        color: '#ffffff'
                    }
                },
                tooltip: {},
                legend: {
                    data: [echarts_2_cutSpeed],
                    textStyle: {
                        fontWeight: 'normal',              //标题颜色
                        color: '#ffffff'
                    }
                },
                xAxis: {
                    // inverse:true,
                    data: timesList,
                    axisLabel: {
                        rotate: 45}
                },
                yAxis: {},
                series: [{
                    type: 'line',
                    smooth: false,
                    data: layerList,
                    color: ['#15ff00'],
                    areaStyle: {
                        color: '#91ff66',
                        opacity: 0.3
                    },
                    itemStyle: {
                        normal: {
                            label: {
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
        error: function () {
            console.log("error");
            myChart.hideLoading();
        }
    };
    myChart.hideLoading();
    sendRequest(options);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}
function echarts_3(schedule) {
    /*   */
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart3'));

    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    // console.log("SN == >" + param.sncode);
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;

    var count= document.getElementById('dayCount').textContent;
    // console.log(count);
    var dateArr = new Array(count);
    var LayerArr = new Array(count);

    var options = {
        url:"/spreader/getLayer14DayInfo",
        type:"post",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function(data) {

            for (let i = 0; i < data.length; i++) {
                dateArr[i] = data[i].date;
                LayerArr[i] = data[i].layers;
            }

            //console.log(dateArr);
            // console.log(LayerArr);

            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#dddc6b'
                        }
                    }
                },
                legend: {
                    data: [echarts_3_dailyLayerstatistics],
                    // data: ['当日层数统计'],
                    align: 'right',
                    right: '40%',
                    top:'0%',
                    textStyle: {
                        color: "#fff",
                        fontSize: '14',

                    },
                    itemWidth: 16,
                    itemHeight: 16,
                    itemGap: 35
                },
                grid: {
                    left: '10',
                    top: '20',
                    right: '30',
                    bottom: '10',
                    containLabel: true
                },

                xAxis: [{
                    type: 'category',
                    data: dateArr,
                    boundaryGap: false,
                    axisLabel:  {
                        rotate: 45,
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:16,
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }

                    }
                }, {

                    axisPointer: {show: false},
                    axisLine: {  show: false},
                    position: 'bottom',
                    offset: 20,



                }],

                yAxis: [{
                    type: 'value',
                    axisTick: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    },
                    axisLabel:  {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize:16,
                        },
                    },

                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    }
                }],
                series: [
                    {
                        name: echarts_3_dailyLayerstatistics,
                        type: 'line',
                        smooth: true,
                        symbol: 'roundRect',
                        symbolSize: 8,
                        showSymbol: true,
                        lineStyle: {

                            normal: {
                                color: '#dddc6b',
                                width: 4
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(221, 220, 107, 0.4)'
                                }, {
                                    offset: 0.8,
                                    color: 'rgba(221, 220, 107, 0.1)'
                                }], false),
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                            }
                        },
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true, //开启显示
                                    color: 'rgba(199, 202, 26, .9)',
                                    fontSize: 16
                                },
                                color: '#dddc6b',
                                borderColor: 'rgba(221, 220, 107, .1)',
                                borderWidth: 12
                            }
                        },
                        data: LayerArr

                    },

                ]

            };
            myChart.setOption(option);

            myChart.hideLoading();
        },
        error:function () {
            console.log("getLayer14DayInfo error");
            myChart.hideLoading();
        }
    };
    sendRequest(options);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}
function echarts_4(schedule) {

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart4'));
    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;
    var count= document.getElementById('dayCount').textContent;
    var worksTimesArr = new Array(count);
    var allStartTimesArr = new Array(count);
    var datesArr = new Array(count);
    var effectionArr = new Array(count);

    var options = {
        url:"/spreader/getEffectInfo",
        type:"post",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function(data) {
            var tempMax = 0; // allStartTimesArr 数组中的最大值
            var tempMaxWorks = 0; // worksTimesArr数组中的最大值

            for (let i = 0; i < data.length; i++) {
                worksTimesArr[i] = formatTime(data[i].worksTimes);
                allStartTimesArr[i] = formatTime(data[i].allStartTimes);
                datesArr[i] = data[i].dates;
                effectionArr[i] = data[i].effection;
                if (worksTimesArr[i] > tempMaxWorks) {
                    tempMaxWorks = worksTimesArr[i];
                }
                if (allStartTimesArr[i] > tempMax) {
                    tempMax = allStartTimesArr[i];
                }
            }


            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        if (params && params.length === 3) {
                            return (
                                params[0].name + '<br/>' +
                                params[0].seriesName + ' : ' + params[0].value + zb3_hour + '<br/>' +
                                params[1].seriesName + ' : ' + params[1].value + zb3_hour + '<br/>' +
                                params[2].seriesName + ' : ' + params[2].value + '%'
                            );
                        } else {
                            // 处理params为空的情况
                            return 'NULL';
                        }
                    }
                },
                legend: {
                    data: [echarts_4_startuptime, echarts_4_spreadTimeMin, echarts_4_effectUR],
                    // data: ['开机时间', '铺布时间(分)','有效利用率'],
                    align: 'right',
                    right: '25%',
                    top:'0%',
                    textStyle: {
                        color: "#fff",
                        fontSize: '16',

                    },
                    itemWidth: 16,
                    itemHeight: 16,
                    itemGap: 35
                },
                grid: {
                    left: '0%',
                    top:'40px',
                    right: '0%',
                    bottom: '2%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: datesArr,
                    axisLine: {
                        rotate: 45,
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,.1)",
                            width: 1,
                            type: "solid"
                        },
                    },

                    axisTick: {
                        show: false,
                    },
                    axisLabel:  {
                        interval: 0,
                        rotate:50,
                        show: true,
                        splitNumber: 15,
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: '16',
                        },
                    },
                }],
                yAxis: [{
                    name: echarts_4_spreadTimeMin,
                    min: 0,
                    max: fomatFloat((parseFloat(tempMaxWorks) + parseFloat(tempMaxWorks * 0.1)),2),
                    position: 'left',
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} '+zb3_hour,
                        show:true,
                        textStyle: {
                            color: "rgba(255,255,255,0.83)",
                            fontSize: '14',
                        },
                    },
                    axisTick: {

                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,0.83)",
                            width: 1,
                            type: "solid"
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,0.83)",
                        }
                    }
                },
                    {
                        type: "value",
                        min: 0,
                        max: fomatFloat(parseFloat(tempMax) + parseFloat(tempMax * 0.1),2),
                        name: echarts_4_startuptime,
                        position: 'right',
                        show: true,
                        axisLabel: {
                            show: true,

                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(255,255,255,0.83)'
                            }
                        }, //右线色
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: "#85a5f5"
                            }
                        }, //x轴线
                    },

                    {
                        type: "value",
                        min: 0,
                        max: 100,
                        name: echarts_4_effectUR,
                        position: 'right',
                        show: false,
                        axisLabel: {
                            show: true,

                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(255,255,255,0.83)'
                            }
                        }, //右线色
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: "#85a5f5"
                            }
                        }, //x轴线
                    }

                ],
                series: [{
                    name: echarts_4_startuptime,
                    type: 'bar',
                    data: allStartTimesArr,
                    yAxisIndex: 1,
                    barWidth:'15', //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: 13,
                                formatter: '{c}',
                                position: 'top'
                            },
                            color:'#2f89cf',
                            opacity: 1,
                            barBorderRadius: 5,
                        }
                    }
                }, {
                    name: echarts_4_spreadTimeMin,
                    type: 'bar',
                    data: worksTimesArr,
                    yAxisIndex: 0,
                    barWidth:'9',
                    // barGap: 1,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                color: 'rgba(255, 255, 255, .9)',
                                fontSize: 13,
                                formatter: '{c}',
                                position: 'top'

                            },
                            color:'#62c98d',
                            opacity: 1,
                            barBorderRadius: 5,
                        }
                    }
                },{
                    name: echarts_4_effectUR,
                    type: 'line',
                    smooth: true,
                    data: effectionArr,
                    yAxisIndex: 2,
                    barWidth:'15',
                    // barGap: 1,
                    itemStyle: {
                        normal: {
                            color:'#F7FD44FF',
                            opacity: 1,
                            barBorderRadius: 5,
                            label: {
                                show: true, //开启显示
                                formatter: '{c}%',//显示百分号
                                color: 'rgba(199, 202, 26, .9)',
                                fontSize: 13
                            },
                        }
                    }
                },
                ]
            };

            myChart.setOption(option);
            myChart.hideLoading();
        },
        error:function () {
            console.log("getSpeedInfo error");
            myChart.hideLoading();
        }
    };
    window.addEventListener("resize", function() {
        myChart.resize();
    });

    sendRequest(options);
}
function echarts_5(schedule) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart5'));

    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;

    var leftSpeedArr = new Array(64);
    var rightSpeedArr = new Array(64);
    var timesArr = new Array(64);

    var options = {
        url:"/spreader/getSpeedInfo",
        type:"post",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function(data) {

            leftSpeedArr = new Array(data.length);
            rightSpeedArr = new Array(data.length);
            timesArr = new Array(data.length);

            for (let i = 0; i < leftSpeedArr.length; i++) {
                leftSpeedArr[i] = data[i].leftSpeed;
                rightSpeedArr[i] = data[i].rightSpeed;
                timesArr[i] = data[i].times;
            }
            var internalNum = 5;
            if (data.length < 20){ internalNum = 0 }
            // console.log(leftSpeedArr);
            // console.log(rightSpeedArr);
            // console.log(timesArr);

            option = {
                //  backgroundColor: '#00265f',

                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: [echarts_5_spreadingSpeed, echarts_5_forwardspeed],
                    align: 'right',
                    right: '10%',
                    top:'0%',
                    textStyle: {
                        color: "#fff",
                        fontSize: '14',
                    },
                    itemGap: 35
                },
                grid: {
                    left: '0%',
                    top:'40px',
                    right: '0%',
                    bottom: '2%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: timesArr,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,.1)",
                            width: 1,
                            type: "solid"
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel:  {
                        rotate:45,
                        interval: internalNum,
                        show: true,
                        splitNumber: 15,
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: '10',
                        },
                    },
                }],
                yAxis: [{
                    type: 'value',
                    min: 0,
                    // 三元运算符，段速是否大于10？大于的话那就等于好了  js大法好
                    max: (leftSpeedArr[0] + 2),
                    name: echarts_5_upto10speed,
                    axisLabel: {
                        //formatter: '{value} %'
                        show:true,
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: '16',
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,.3	)",
                            width: 1,
                            type: "solid"
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.3)",
                        }
                    }
                }],
                series: [{
                    name: echarts_5_forwardspeed,
                    type: 'line',

                    smooth: true,
                    symbol: 'roundRect',
                    symbolSize: 4,
                    showSymbol: true,

                    data: leftSpeedArr,

                    itemStyle: {
                        normal: {
                            label: {
                                show: false, //开启显示
                                color: 'rgba(199, 202, 26, .9)',
                                fontSize: 16
                            },
                            color:'#2f89cf',
                            opacity: 1,

                            barBorderRadius: 5,
                        }
                    }
                }, {
                    name: echarts_5_spreadingSpeed,
                    type: 'line',

                    smooth: true,
                    symbol: 'triangle',
                    symbolSize: 4,
                    showSymbol: true,

                    data: rightSpeedArr,
                    barWidth:'15',
                    // barGap: 1,
                    itemStyle: {
                        normal: {
                            color:'#62c98d',
                            opacity: 1,
                            barBorderRadius: 5,
                        }
                    }
                },
                ]
            };

            myChart.setOption(option);
            myChart.hideLoading();
        },
        error:function () {
            console.log("getSpeedInfo error");
            myChart.hideLoading();
        }
    };
    sendRequest(options);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}
function zb1(schedule) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('zb1'));

    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;
    var totalMinutes = calculateTimeDifference(
        param.startTime,
        param.endTime,
        param.scheduleStartTime,
        param.scheduleEndTime
    );
    var options = {
        url:"/spreader/queryWorkTime_JustSpread",
        type:"post",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function(data) {

           /* var all = 60;
            if (data<60){
                all = 8;
                data = data/60;
            }*/

            var v1 = data;
            var v2 = formatTime(data);
            //var v2 = fomatFloat((data / 60),0); //显示分钟数
            var v3 = 24*count - v2; //总订单数

            option = {

                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return params.value + zb3_hour;
                    }
                },
                series: [{
                    type: 'pie',
                    radius: ['60%', '70%'],
                    color:'#49bcf7',
                    label: {
                        normal: {
                            position: 'center',
                            formatter: '{b}\n{c}' + zb3_hour,  // b代表name，c代表value
                            textStyle: {
                                fontSize: 16,
                                color: '#fff'
                            }
                        }
                    },
                    data: [{
                        value: v2,
                        name: zb1_pureSpreadTime,
                        label: {
                            normal: {
                                formatter: v2 + zb3_hour,
                                textStyle: {
                                    fontSize: 16,
                                    color:'#fff',
                                }
                            }
                        }
                    },
                        {
                            value: v3,
                            label: {
                                normal: {
                                    formatter : function (params){
                                        return zb1_pureSpreadTime // 纯铺布时间
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

            myChart.setOption(option);
            myChart.hideLoading();
        },
        error:function () {
            console.log("getSpeedInfo error");
            myChart.hideLoading();
        }
    };
    sendRequest(options);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}
function zb2(schedule) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('zb2'));

    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;


    var options = {
        url:"/spreader/queryLayerToday",
        type:"post",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function(data) {
            var v1 = data;
            // console.log(data.knifeStone)
            var v2 = distanceCalcu(v1) - v1;//未结算数
            var v3 = distanceCalcu(v1);//总订单数

            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return zb2_finishedlayers + params.value;
                    }
                },
                //animation: false,
                series: [{


                    type: 'pie',
                    radius: ['60%', '70%'],
                    color:'#49bcf7',
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                        value: v1, //当前的
                        name: '今日已铺',
                        label: {
                            normal: {
                                formatter: zb2_finished + v1,
                                textStyle: {
                                    fontSize: 16,
                                    color:'#fff',
                                }
                            }
                        }
                    }, {
                        value: v2,// 还差的
                        label: {
                            normal: {
                                formatter : v3 + zb2_layerwith + Math.round( v1/v3 * 100)+ '%',
                                textStyle: {
                                    color: '#aaa',
                                    fontSize: 16
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

            myChart.setOption(option);
            myChart.hideLoading();
        },
        error:function () {
            console.log("getSpeedInfo error");
            myChart.hideLoading();
        }
    };
    sendRequest(options);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}

// 计算时间差（分钟）
function calculateTimeDifference(startTime, endTime, scheduleStartTime, scheduleEndTime) {
    var startDate = new Date(startTime);
    var endDate = new Date(endTime);

    // 如果没有排程时间，直接计算 startTime 和 endTime 的分钟差
    if (!scheduleStartTime || !scheduleEndTime) {
        return Math.round((endDate - startDate) / (1000 * 60));
    }

    // 否则，计算每天 scheduleStartTime 到 scheduleEndTime 的时间差，并累加
    var totalMinutes = 0;
    var currentDate = new Date(startDate);
    var scheduleStart = new Date(currentDate.toDateString() + " " + scheduleStartTime);
    var scheduleEnd = new Date(currentDate.toDateString() + " " + scheduleEndTime);

    // 处理跨天情况（如 23:00:00 到 01:00:00）
    if (scheduleEnd < scheduleStart) {
        scheduleEnd.setDate(scheduleEnd.getDate() + 1);
    }

    var dailyMinutes = Math.round((scheduleEnd - scheduleStart) / (1000 * 60));

    // 遍历每一天，计算有效时间
    while (currentDate <= endDate) {
        var dayStart = new Date(currentDate);
        var dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);

        // 如果是第一天，可能不是完整的 schedule 时间
        if (currentDate.getTime() === startDate.getTime()) {
            var effectiveStart = new Date(Math.max(startDate, scheduleStart));
            var effectiveEnd = new Date(Math.min(dayEnd, scheduleEnd));
            if (effectiveEnd > effectiveStart) {
                totalMinutes += Math.round((effectiveEnd - effectiveStart) / (1000 * 60));
            }
        }
        // 如果是最后一天，可能不是完整的 schedule 时间
        else if (currentDate.toDateString() === endDate.toDateString()) {
            var effectiveStart = new Date(Math.max(dayStart, scheduleStart));
            var effectiveEnd = new Date(Math.min(endDate, scheduleEnd));
            if (effectiveEnd > effectiveStart) {
                totalMinutes += Math.round((effectiveEnd - effectiveStart) / (1000 * 60));
            }
        }
        // 中间的天数，直接加 dailyMinutes
        else {
            totalMinutes += dailyMinutes;
        }

        currentDate.setDate(currentDate.getDate() + 1); // 下一天
    }

    return totalMinutes;
}

function formatMinutesToWeeksDaysHours(minutes) {
    const minutesInHour = 60;
    const hoursInDay = 24;
    const daysInWeek = 7;

    const hours = Math.floor(minutes / minutesInHour);
    const remainingMinutes = minutes % minutesInHour;

    const days = Math.floor(hours / hoursInDay);
    const remainingHours = hours % hoursInDay;

    const weeks = Math.floor(days / daysInWeek);
    const remainingDays = days % daysInWeek;

    let result = [];
    if (weeks > 0) result.push(weeks + zb3_week);
    if (remainingDays > 0) result.push(remainingDays + zb3_day);
    if (remainingHours > 0) result.push(remainingHours + zb3_hour);
    if (remainingMinutes > 0) result.push(remainingMinutes + zb3_min);

    return result.join(' ') || '0' + zb3_min;
}




function zb3(schedule) {
    var myChart = echarts.init(document.getElementById('zb3'));

    var param = {};
    param.sncode = $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;

    var totalMinutes = calculateTimeDifference(
        param.startTime,
        param.endTime,
        param.scheduleStartTime,
        param.scheduleEndTime
    );

    // Format the total time for display
    var formattedTotalTime = (totalMinutes);

    var options = {
        url: "/spreader/quertStartTimer",
        type: "post",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(param),
        dataType: "json",
        getresult: function(data) {
            var v1 = formatTime(data); // Operating time in minutes
            var v2 = formatTime(totalMinutes*60 - data); // Idle time in minutes
            var v3 = formatTime(totalMinutes*60); // Total time in minutes

            // Format the operating time
            var formattedOperatingTime = (v1);
            var formattedIdleTime = (v2);

            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return  (params.value)+zb3_hour;
                    }
                },
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
                        value: v1,
                        name: '开机时间',
                        label: {
                            normal: {
                                formatter: zb3_boot + formattedOperatingTime+zb3_hour,
                                textStyle: {
                                    fontSize: 16,
                                    color: '#fff',
                                }
                            }
                        }
                    }, {
                        value: v2,
                        label: {
                            normal: {
                                formatter: zb3_bootPercentage + Math.round(v1 / v3 * 100) + '%',
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

            myChart.setOption(option);
            myChart.hideLoading();
        },
        error: function() {
            console.log("getSpeedInfo error");
            myChart.hideLoading();
        }
    };
    sendRequest(options);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}
function zb4(schedule) {
    // 基于准备好的dom，初始化echarts实例

    var myChart = echarts.init(document.getElementById('zb4'));

    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    param.scheduleStartTime = schedule.scheduleStartTime;
    param.scheduleEndTime = schedule.scheduleEndTime;

    var options = {
        url:"/spreader/queryDistanceToday",
        type:"post",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        dataType:"json", // 这里声明收到的服务器的响应数据类型，如果是json的话，不声明也可以正常使用
        getresult: function(data) {
            var v1 = (data/1000);
            console.log(v1);
            // console.log(data.knifeStone)
            var v2 = distanceCalcuMiter(data / 1000);//未结算数
            var v3 = formatDistanceToKm(data/1000);

            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return zb4_distanceOf +params.value + zb4_meters;
                    }
                },
                series: [{

                    type: 'pie',
                    radius: ['60%', '70%'],
                    color:'#29d08a',
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                        value: v1,
                        name: '今日铺布距离',
                        label: {
                            normal: {
                                formatter: zb4_todayWalks + v3,
                                textStyle: {
                                    fontSize: 16,
                                    color:'#fff',
                                }
                            }
                        }
                    }, {
                        value: v2,
                        label: {
                            normal: {
                                formatter : v2 + zb4_meterwith + Math.round( v1/v2 * 100) + '%',
                                textStyle: {
                                    color: '#aaa',
                                    fontSize: 16
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

            myChart.setOption(option);
            myChart.hideLoading();
        },
        error:function () {
            console.log("getSpeedInfo error");
            myChart.hideLoading();
        }
    };
    sendRequest(options);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}

function exportEffext(){
    // 定义传入的东西
    var param = {};
    param.sncode =  $("#devices").find("option:selected").text();
    param.startTime = document.getElementById('dateTimeStart').value;
    param.endTime = document.getElementById('dateTimeEnd').value;
    //添加语言参数

    // 获取当前语言设置
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('l');
    param.lang = langParam;


    // 根据语言环境设置文件名
    let fileName = '设备有效利用率.csv'; // 默认文件名
    if (langParam === 'en_US') {
        fileName = 'Equipment_Effectiveness.csv';
    } else if (langParam === 'de_DE') {
        fileName = 'Anlageneffektivität.csv';
    }

    axios({
        url: "/spreader/exportEffectInfo",
        method: 'POST',
        data: JSON.stringify(param), // JSON.stringify() 将JS对象转化为JSON格式
        responseType: 'blob', // 这里就是转化为blob文件流，指定响应类型为二进制数据
        headers: {
            'Content-Type': 'application/json; application/octet-stream',
        }
    }).then(res => {
        const href = URL.createObjectURL(res.data)
        const link = document.createElement('a')
        link.download = fileName
        link.href = href
        link.click()
        URL.revokeObjectURL(href); // 释放内存
    })
}