package com.goaksoft.dspace.util;

import com.alibaba.fastjson.JSONArray;
import com.goaksoft.dspace.servlet.ExploreServlet;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;

/**
 * @author  cokele
 * @version V1.0
 * @desc    Dspace 显示页面所需要的参数
 */
public class ExploreEntryUtil {
    
    private JSONArray data;
    private JSONArray columns;
    private JSONArray maps;
    private JSONArray echarts;
    private JSONArray echartsSel;
    private JSONArray echartsOne;

    public JSONArray getData() {
        return data;
    }

    public void setData(JSONArray data) {
        this.data = data;
    }

    public JSONArray getColumns() {
        return columns;
    }

    public void setColumns(JSONArray columns) {
        this.columns = columns;
    }

    public JSONArray getMaps() {
        return maps;
    }

    public void setMaps(JSONArray maps) {
        this.maps = maps;
    }

    public JSONArray getEcharts() {
        return echarts;
    }

    public void setEcharts(JSONArray echarts) {
        this.echarts = echarts;
    }

    public JSONArray getEchartsSel() {
        return echartsSel;
    }

    public void setEchartsSel(JSONArray echartsSel) {
        this.echartsSel = echartsSel;
    }

    public JSONArray getEchartsOne() {
        return echartsOne;
    }

    public void setEchartsOne(JSONArray echartsOne) {
        this.echartsOne = echartsOne;
    }

    @Override
    public String toString() {
        return "ExploreEntryUtil{" + "data=" + data + ", columns=" + columns + ", maps=" + maps + ", echarts=" + echarts + ", echartsSel=" + echartsSel + ", echartsOne=" + echartsOne + '}';
    }
    
    /**
     * 设置 Explore 页面所需要的参数
     * @param is    文件流
     * @param file  文件名称
     * @param sheetNo sheet序号
     * @param request 请求
     */
    public static void setExplore(InputStream is, String file, Integer sheetNo,  HttpServletRequest request){
        ExploreEntryUtil vo = null;
        List<List<String>> result = null;

        // 判断是否是 excel
        if(ExcelUtil.OFFICE_EXCEL_XLS.equals(ExcelUtil.getSuffiex(file)) || ExcelUtil.OFFICE_EXCEL_XLSX.equals(ExcelUtil.getSuffiex(file))){
            try {
                // 获取 excel 格式的文件，进行输出
                result = ExcelUtil.readExcel(is, sheetNo);
            } catch (IOException ex) {
                Logger.getLogger(ExploreServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        request.setAttribute("sheetContent", result.size() > 0);
        
        if(result.size() > 0){
            vo = ExcelUtil.getExplore(result);
            request.setAttribute("sheetName", JSONArray.toJSON(ExcelUtil.sheetName));
            request.setAttribute("datatablesData", vo.getData());
            request.setAttribute("datatablesTitle", vo.getColumns());
            request.setAttribute("map", vo.getMaps());
            request.setAttribute("echart", vo.getEcharts());
            request.setAttribute("selectData", vo.getEchartsSel());
            request.setAttribute("xData", vo.getEchartsOne());
        }
    }
}

