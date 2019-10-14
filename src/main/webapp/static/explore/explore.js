var count = 1;
var series = [];
var legend = [];

$(function(){
    initDatatable();  // 创建和初始化表格
    initSelect();     // echarts 中下拉框中内容
    addSeries();      // 添加序列
    initMap();        // 初始化地图
    initSheetName();  // sheet 表格名称
});

// 创建和初始化下拉框(excel中存在多个sheet时下拉框中出现多个值)
function initSheetName(){
    if(sheetName.length !== 0){
        // 初始化时，select下拉框设置为空
        document.getElementById("sheetname").options.length = 0;

        // 循环添加 下拉框中内容
        if( sheetName.length !== undefined){
            for(var i = 0;i < sheetName.length; i++){
                document.getElementById("sheetname").options.add(new Option(sheetName[i],i));   // 设置下拉框值
            }
        }
    }
}

// 创建和初始化表格函数：
function initDatatable(){
    $('#example').DataTable( {
        data: datatablesData,         // 表格中的值
        columns: datatablesTitle,     // 表格中的标题
        keys: true,
        autoWidth: false,
        language: {
            info: "第 _PAGE_ 页，共 _PAGES_ 页",
            infoEmpty: "没有记录",
            infoFiltered: "（ 从 _MAX_ 记录中搜索得到 _TOTAL_ 条记录）",
            search: "搜索：",
            lengthMenu: "每页 _MENU_ 条记录",
            paginate: {
                first: "首页",
                last: "末页",
                next: "下一页",
                previous: "上一页"
            },
            aria: {
                sortAscending: ": 单击按照升序排序",
                sortDescending: ": 单击按照降序排序"
            }
        }
    });
}

// 创建和初始化图表函数：
function initEchart(){
    //$("#explore-echart").css('width',$("#explore-echart").width());   // 获取父级的宽度，赋给自己
    var myChart = echarts.init(document.getElementById('explore-echart'));
    myChart.showLoading();
    var option = {
        legend: {data:[] },
        dataZoom: {                 // 添加横线滚动条
            start: 0,               // 默认为0
            end: 100 - 1500 / 31,   // 默认为100
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            handleSize: 0,          // 滑动条的 左右2个滑动条的大小
            height: 8,              // 组件高度
            left: 20,               // 左边的距离
            right: 20,              // 右边的距离
            bottom: 30,             // 右边的距离
            handleColor: '#CBBCDB', // h滑动图标的颜色
            handleStyle: {
                borderColor: "#CBBCDB",
                borderWidth: "1",
                shadowBlur: 2,
                background: "#CBBCDB",
                shadowColor: "#CBBCDB",
            },
            fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                offset: 0,          // 给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变， 给第一个设置0，第四个设置1，就是垂直渐变
                color: '#CBBCDB'
            }, {
                offset: 1,
                color: '#CBBCDB'
            }]),
            backgroundColor: 'rgba(37, 46, 100, 0.45)', // 两边未选中的滑动条区域的颜色
            showDataShadow: false,                      // 是否显示数据阴影 默认auto
            showDetail: false,                          // 即拖拽时候是否显示详细数值信息 默认true
            handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
            filterMode: 'filter'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    backgroundColor: '#283b56'
                }
            }
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: true,
                    optionToContent: function (opt) {
                        var  axisData = opt.xAxis[0].data;  // 坐标数据
                        var series = opt.series;            // 折线图数据
                        var tdHeads = '<td></td>';          // 表头
                        var tdBodys = '';                   // 数据
                        series.forEach(function (item) {
                            tdHeads += '<th class="text-center">'+item.name+'</th>'; // 组装表头
                        });
                        var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center" class="table table-hover"><tbody><tr>'+tdHeads+' </tr>';
                        for (var i = 0, l = axisData.length; i < l; i++) {
                            for (var j = 0; j < series.length; j++) {
                                tdBodys += '<td>'+series[j].data[i]+'</td>'; // 组装表数据
                            }
                            table += '<tr><td>'+axisData[i]+'</td>'+tdBodys+'</tr>';
                            tdBodys = '';
                        }
                        table += '</tbody></table>';
                        return table;
                    }
                },
                magicType: {show: true, type: ['line', 'bar', 'tiled']},
                dataZoom: {show: true},
                restore: {show: true},
                saveAsImage: {show: true},
            }
        },
        xAxis: {
            type: 'category',
            data: xData
        },
        yAxis: {
            type: 'value'
        },
        series: []
    };

    option.series = series;
    option.legend.data = legend;

    myChart.hideLoading();
    myChart.setOption(option, true);

    //图表根据窗口大小自适应
    window.onresize = function () {
        myChart.resize();
    };
}

// 创建和初始化地图函数：
function initMap(){
    /**
     * 智图地图内容
     */
    var normalm1 = L.tileLayer.chinaProvider('Geoq.Normal.Map', { maxZoom: 18, minZoom: 5 });
    // var normalm2 = L.tileLayer.chinaProvider('Geoq.Normal.Color', { maxZoom: 18, minZoom: 5 });
    var normalm3 = L.tileLayer.chinaProvider('Geoq.Normal.PurplishBlue', { maxZoom: 18, minZoom: 5  });
    var normalm4 = L.tileLayer.chinaProvider('Geoq.Normal.Gray', { maxZoom: 18, minZoom: 5 });
    var normalm5 = L.tileLayer.chinaProvider('Geoq.Normal.Warm', { maxZoom: 18, minZoom: 5 });
    // var normalm6 = L.tileLayer.chinaProvider('Geoq.Normal.Cold', { maxZoom: 18, minZoom: 5 });

    /**
     * 天地图内容
     */
    var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', { maxZoom: 18, minZoom: 5 }),
        normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', { maxZoom: 18, minZoom: 5 }),
        imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', { maxZoom: 18, minZoom: 5 }),
        imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', { maxZoom: 18, minZoom: 5 });

    var normal = L.layerGroup([normalm, normala]), image = L.layerGroup([imgm, imga]);

    /**
     * 谷歌
     */
    var normalMap = L.tileLayer.chinaProvider('Google.Normal.Map', { maxZoom: 18, minZoom: 5 }),
        satelliteMap = L.tileLayer.chinaProvider('Google.Satellite.Map', { maxZoom: 18, minZoom: 5 });

    /**
     * 高德地图
     */
    var Gaode = L.tileLayer.chinaProvider('GaoDe.Normal.Map', { maxZoom: 18, minZoom: 5 });
    var Gaodimgem = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', { maxZoom: 18, minZoom: 5 });
    var Gaodimga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', { maxZoom: 18, minZoom: 5 });
    var Gaodimage = L.layerGroup([Gaodimgem, Gaodimga]);

    var baseLayers = {
        "智图地图": normalm1,
        // "智图多彩": normalm2,
        "智图午夜蓝": normalm3,
        "智图灰色": normalm4,
        "智图暖色": normalm5,
        // "智图冷色": normalm6,
        "天地图": normal,
        "天地图影像": image,
        "谷歌地图": normalMap,
        "谷歌影像": satelliteMap,
        "高德地图": Gaode,
        "高德影像": Gaodimage
     };

    // 初始化 leaflet 控件
    var map = L.map("explore-map", {
        center:  [39.9, 116.4],
        zoom: 5,
        layers: [normalm1],
        zoomControl: false
    });

    // 把上面设置的地图放在页面
    L.control.layers(baseLayers, null).addTo(map);
    L.control.zoom({zoomInTitle: '放大', zoomOutTitle: '缩小' }).addTo(map);

    if(points.length > 0){
        // 循环建立标注点
        for(var i = 0, pointsLen = points.length; i < pointsLen; i++) {
            var showPopup = showInfo(points[i]);        // 设置 点击内容
            L.marker([points[i].lat, points[i].lng]).addTo(map).bindPopup(showPopup).openPopup();   // 设置地图标注
        }
    }

    // 百度地图API功能
    /*var map = new BMap.Map("explore-map");              // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.4, 39.9), 5);  // 初始化地图,设置中心点坐标和地图级别
    map.addControl(new BMap.MapTypeControl());          // 添加地图类型控件
    map.addControl(new BMap.NavigationControl());       // 添加控件：缩放地图的
    map.addControl(new BMap.ScaleControl());            // 添加控件：地图显示比例的控件，默认在左下方；
    map.addControl(new BMap.OverviewMapControl());      // 添加控件：地图的缩略图的控件，默认在右下方； TrafficControl
    map.setCurrentCity("北京");                         // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);                    // 开启鼠标滚轮缩放

    // 循环建立标注点
    for(var i=0, pointsLen = points.length; i<pointsLen; i++) {
        var point = new BMap.Point(points[i].lng, points[i].lat);   // 将标注点转化成地图上的点
        var marker = new BMap.Marker(point);                        // 将点转化成标注点
        map.addOverlay(marker);                                     // 将标注点添加到地图上
        // 添加监听事件
        (function() {
            var thePoint = points[i];
            marker.addEventListener("click", function() {
                showInfo(this,thePoint);
            });
        })();
    }*/
}

// 初始化Echarts中的下拉框
function initSelect(){
    if(selectData.length !== 0){
        initField();    // 初始化 echarts中字段内容

        // 初始化时，select下拉框设置为空
        document.getElementById("sel").options.length = 0;
        // 循环添加 下拉框中内容
        for(var i = 0;i < selectData.length; i++){
            // 判断sel中是否存在 经纬度，如果存在，则不添加
            //if("经度" !== selectData[i] && "lng" !== selectData[i] && "纬度" !== selectData[i] && "lat" !== selectData[i]){  
                document.getElementById("sel").options.add(new Option(selectData[i],i));   // 设置下拉框值
            //}
        }
        // 获取下拉框中第一个内容
        var text = document.getElementById("sel").options[0].text;

        // 修改下拉框时，echarts中的内容也跟着变化
        changeEchart(text, 0);
    }
}

// 添加序列
function addSeries(){
    $("#addSeries").click(function(){
        var div = $("<div id=\"series"+count+"\" class=\"m_t\"></div>");// 设置一个容器
        $("#formSe").append(div);// 把设置的容器添加到 第一个下拉框下面

        var a = $("<span>序列 " + count + " </span><a href=\"#\" onclick=\"removeSeries(this)\">[删除下拉框]</a>");// 设置删除下拉框链接
        var select = $("<select name=\"echart\" class=\"form-control\" id=\"sel"+count+"\" onchange=\"changeSelect(this)\"></select>");// 设置下拉框

        $("#series"+count).append(a).append(select);// 把编写好的下拉框添加到 容器中
        document.getElementById("sel"+count).options.length = 0;// 设置下拉框为空

        for(var i = 0;i < selectData.length; i++){
            // 循环添加下拉框中内容
            //if("经度" !== selectData[i] && "lng" !== selectData[i] && "纬度" !== selectData[i] && "lat" !== selectData[i]){
                document.getElementById("sel"+count).options.add(new Option(selectData[i],i));
            //}
        }

        // 添加容器的 id
        count++;
    })
}

// 下拉框中的内容发生变化时
function changeSelect(_this){
    var value = _this.options[_this.selectedIndex].value;   // 获取value
    var text = _this.options[_this.selectedIndex].text;     // 获取文本
    var series1 = $("#series1").val();                       // 获取series1来判断除了默认的下拉框是否还添加了下拉框

    changeEchart(text, value, series1);                      // 修改下拉框时，echarts中的内容也跟着变化
}

// 修改下拉框时，echarts中的内容也跟着变化
function changeEchart(title ,value, success){

    // 判断除了默认的下拉框是否还添加了下拉框，如果没添加，则每次修改下拉框中的内容，数据都重新获取
    if(success === undefined){
        series = [];
        legend = [];
    }

    // 获取数据
    var datas = new Array(echartData.length);
    var i = 0;
    for(var item of echartData){
        datas[i] = item[value];
        i++;
    }


    // 添加 图表中的数据
    series.push({
        name: title,
        type: "line",
        data: datas
    });

    legend += title+",";

    legend = legend.split(",");

    initEchart();// 重新创建和初始化图表函数
}

// 删除序列
function removeSeries(_this){
    count = count - 1;          // 删除下拉框时，id减1
    $(_this).parent().remove(); // 删除下拉框
 }

// 地图中点击显示详情
function showInfo(/*thisMarker ,*/ point) {
    // 获取点的信息
    var sContent = '<ul style="margin:0 0 5px 0;padding:0.2em 0">'
        +'<li style="line-height: 26px;font-size: 15px;"><span style="width: 50px;display: inline-block;">id：</span>' + point.id + '</li>'
        +'<li style="line-height: 26px;font-size: 15px;"><span style="width: 50px;display: inline-block;">经度：</span>' + point.lng + '</li>'
        +'<li style="line-height: 26px;font-size: 15px;"><span style="width: 50px;display: inline-block;">纬度：</span>' + point.lat + '</li>'
        +'<li style="line-height: 26px;font-size: 15px;"><span style="width: 50px;display: inline-block;">名称：</span>' + point.name + '</li>'
        +'</ul>';
    //var infoWindow = new BMap.InfoWindow(sContent); // 创建信息窗口对象
    //thisMarker.openInfoWindow(infoWindow);          // 图片加载完后重绘infoWindow
    return sContent;
}

// 点击echarts中字段按钮
function initField(){
    $(".addfield").hide();              // 默认隐藏状态
    $(".field").click(function(){
        $(".addfield").toggle('slow');  // 改变显隐状态
        for(var item of selectData){           // echarts 中 字段按钮
            var div = "<div style=\"padding:5px 5px 0;border-bottom:1px solid;\"><i class=\"glyphicon glyphicon-file\"></i><span style=\"margin-left:5px;\">"+item+"</span></div>";
            $(".addfield").append(div);
        }
    })
 }