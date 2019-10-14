<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>datasheet-viewer</title>
        <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/static/bootstrap/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/static/datatables/dataTables.bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/static/explore/explore.css" />
        <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/static/leaflet/leaflet.css" />
    </head>
    <body>
        <% if(!request.getAttribute("sheetContent").equals(false)){ %>
        <div class="explore">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="tab" role="tabpanel">
                            <!-- Nav tabs -->
                            <ul class="nav nav-tabs alert alert-link" role="tablist">
                                <li role="presentation" class="active"><a href="#datatables" aria-controls="datatables" role="tab" data-toggle="tab">表格</a></li>
                                <% if (request.getAttribute("selectData").toString().length() != 2) { %>
                                <li role="presentation"><a href="#echarts" aria-controls="echarts" role="tab" data-toggle="tab">图表</a></li>
                                <% } if (request.getAttribute("map").toString().length() != 2) { %>
                                <li role="presentation"><a href="#maps" aria-controls="maps" role="tab" data-toggle="tab">地图</a></li>
                                <% } %>
                                
                                <% if (request.getAttribute("sheetName").toString().length() != 2) { %>
                                    <form action="<%=request.getContextPath()%>/explore" method="get" class="form-inline pull-right">
                                        <div class="form-group">
                                            <label for="sheetname">Sheet 表格</label>
                                            <select id="sheetname" name="sheetNo" class="form-control"></select>
                                            <button type="submit" class="btn btn-info">确定</button>
                                        </div>
                                    </form>
                                <% } %>
                            </ul>
                            <!-- Tab panes -->
                            <div class="tab-content tabs">
                                <div role="tabpanel" class="tab-pane fade in active" id="datatables">
                                    <div id="explore-table" class="p_7">
                                        <table id="example" class="table table-bordered table-striped table-hover" width="100%" > </table>
                                    </div>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" id="echarts">
                                    <div class="col-md-10 p_7" id="explore-echart" style="height:550px;width: 800px;"></div>
                                    <div class="col-md-2">
                                        <div class="m_t">
                                            <button class="btn btn-default filter">过滤</button>
                                            <button class="btn btn-info field">字段</button>
                                        </div>
                                        <div class="m_t">
                                            <form action="" id="formSe">
                                                <select name="echart" class="form-control" id="sel" onchange="changeSelect(this)">
                                                    <option value="0">请选择</option>
                                                </select>
                                            </form>
                                            <button class="btn btn-default m_t" id="addSeries">添加序列</button>
                                        </div>

                                        <div class="panel-group addfield m_t" style="background: #f5f5f5; border-radius: 5px; padding: 10px;">
                                            <h3 class="text-center">字段</h3>
                                        </div>
                                    </div>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" id="maps">
                                    <div style="width:100%;height:550px;border:#ccc solid 1px;" id="explore-map"></div>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
        </div>

        <script src="<%= request.getContextPath()%>/static/jquery.min.js"></script>
        <script src="<%= request.getContextPath()%>/static/bootstrap/bootstrap.min.js"></script>
        <script src="<%= request.getContextPath()%>/static/datatables/jquery.dataTables.min.js"></script>
        <script src="<%= request.getContextPath()%>/static/datatables/dataTables.bootstrap.min.js"></script>
        <script src="<%= request.getContextPath()%>/static/echarts/echarts.min.js"></script>
        <script src="<%= request.getContextPath()%>/static/leaflet/leaflet.js"></script>
        <script src="<%= request.getContextPath()%>/static/leaflet/leaflet.ChineseTmsProviders.js"></script>

        <!-- <script type="text/javascript" src="http://api.map.baidu.com/api?key=IX02Hr6z25IZIWjHrXXFamCrhw2fpGnv&v=1.1&services=true"></script>-->

        <script type="text/javascript">
            var sheetName = <%=request.getAttribute("sheetName")%>;             // sheet 名称
            var datatablesData = <%=request.getAttribute("datatablesData")%>;   // datatables 表数据
            var datatablesTitle = <%=request.getAttribute("datatablesTitle")%>; // datatables 表头
            var points = <%=request.getAttribute("map")%>;                      // maps 数据
            var echartData = <%=request.getAttribute("echart")%>;               // echarts 数据
            var selectData = <%=request.getAttribute("selectData")%>;           // echarts select 数据
            var xData = <%=request.getAttribute("xData")%>;                     // echarts x 轴 数据
        </script>
        <script src="<%= request.getContextPath()%>/static/explore/explore.js"></script>
        <% } else{%>
        <div class="alert alert-warning">对不起，您所查看的excel内容不存在！</div>
        <% } %>
    </body>
</html>